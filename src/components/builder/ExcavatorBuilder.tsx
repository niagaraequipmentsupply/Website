"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Stepper } from "@/components/ui/Stepper";
import { ModelSelector } from "./ModelSelector";
import { AttachmentSelector } from "./AttachmentSelector";
import { ProtectionOptions } from "./ProtectionOptions";
import { FinancingSelector } from "./FinancingSelector";
import { BuildSummary } from "./BuildSummary";
import { MobileBuildBar } from "./MobileBuildBar";
import { ModelChangeDialog } from "./ModelChangeDialog";
import { useBuilder, toConfiguration } from "@/store/builder";
import { useQuote } from "@/store/quote";
import { useCatalogue } from "@/components/CatalogueProvider";
import { compatibleAttachments, findIncompatibleSelections, isAddonEligible } from "@/lib/compatibility";
import { calculateTotals } from "@/lib/pricing";
import type { PricedLine } from "@/lib/types";
import { track } from "@/lib/analytics";

const steps = [
  { id: "model", label: "Choose Model", href: "#choose-model" },
  { id: "attachments", label: "Add Attachments", href: "#add-attachments" },
  { id: "protection", label: "Protection & Warranty", href: "#protection" },
  { id: "review", label: "Review Build", href: "#review" },
];

export function ExcavatorBuilder() {
  const router = useRouter();
  const initialModelId = useSearchParams().get("model") ?? undefined;
  const b = useBuilder();
  const addBuild = useQuote((s) => s.addBuild);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { catalogue, financing, taxRate } = useCatalogue();

  const machines = useMemo(() => catalogue.machines.filter((m) => m.builderEnabled && m.category === "excavators"), [catalogue]);
  const machine = catalogue.machines.find((m) => m.id === b.selectedModelId);
  const attachmentsById = useMemo(() => new Map(catalogue.attachments.map((a) => [a.id, a])), [catalogue]);

  // After the saved build rehydrates: drop selections that no longer exist in the catalogue, then apply ?model= if nothing is selected.
  const hydrated = useBuilder((s) => s.hydrated);
  useEffect(() => {
    if (!hydrated) return;
    b.pruneUnknown(new Set(catalogue.machines.map((m) => m.id)), new Set(catalogue.attachments.map((a) => a.id)), new Set(catalogue.addons.map((a) => a.id)), new Set(catalogue.warranties.map((w) => w.id)));
    const target = initialModelId && machines.find((m) => m.id === initialModelId || m.slug === initialModelId);
    if (target && !useBuilder.getState().selectedModelId) b.selectModel(target.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, initialModelId, catalogue]);

  const compatAttachments = useMemo(() => (machine ? compatibleAttachments(catalogue.attachments.filter((a) => a.attachmentCategory === "excavator-attachments"), machine) : []), [machine, catalogue]);
  const eligibleAddons = useMemo(() => (machine ? catalogue.addons.filter((a) => a.selectable && isAddonEligible(a, machine)) : catalogue.addons.filter((a) => a.selectable)), [machine, catalogue]);
  const eligibleWarranties = useMemo(() => (machine ? catalogue.warranties.filter((w) => isAddonEligible(w, machine)) : catalogue.warranties), [machine, catalogue]);

  const totals = useMemo(() => calculateTotals(toConfiguration(b), catalogue, taxRate), [b, catalogue, taxRate]);

  const onSelectModel = (id: string) => {
    if (id === b.selectedModelId) return;
    const target = machines.find((m) => m.id === id);
    if (!target) return;
    const incompatible = findIncompatibleSelections(b.attachmentSelections, attachmentsById, target);
    if (incompatible.length > 0) b.requestModelChange({ targetModelId: id, incompatible });
    else b.selectModel(id);
  };

  const onRemoveLine = (line: PricedLine) => {
    const [kind, id, variant] = line.id.split(":");
    if (kind === "attachment") b.removeAttachment(id, variant === "base" ? undefined : variant);
    else if (kind === "warranty") b.setWarranty(undefined);
    else if (kind === "addon") b.toggleAddon(id);
  };

  const onRequest = () => {
    if (!machine) return;
    addBuild(`${machine.brand} ${machine.modelName} build`, toConfiguration(b));
    track({ name: "builder_complete", modelId: machine.id, lines: totals.lines.length });
    router.push("/quote?from=builder");
  };

  const onSave = () => b.markSaved();

  const completed = [!!machine, b.attachmentSelections.length > 0, b.addonSelections.length > 0 || !!b.warrantySelectionId, false];
  const current = !machine ? 0 : b.attachmentSelections.length === 0 ? 1 : completed[2] ? 3 : 2;
  const pending = b.pendingModelChange;
  const pendingTarget = pending ? machines.find((m) => m.id === pending.targetModelId) : undefined;

  const summary = (
    <BuildSummary machine={machine} configurationLabel={machine?.configurations?.find((c) => c.id === b.selectedConfigurationId)?.label} totals={totals} financing={financing} onRemoveLine={onRemoveLine} onRequest={onRequest} onSave={onSave} savedAt={b.savedAt} />
  );

  return (
    <>
      <div className="border-b border-line bg-white">
        <Container className="py-4"><Stepper steps={steps} current={current} completed={completed} /></Container>
      </div>
      <Container className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 py-8 pb-28 lg:grid-cols-[minmax(0,7fr)_minmax(300px,3fr)] lg:pb-10">
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6">
          <ModelSelector machines={machines} selectedId={b.selectedModelId} configurationId={b.selectedConfigurationId} onSelect={onSelectModel} onConfiguration={b.setConfiguration} />
          <AttachmentSelector machine={machine} attachments={compatAttachments} selections={b.attachmentSelections} onAdd={b.addAttachment} onRemove={b.removeAttachment} onQuantity={b.setAttachmentQuantity} />
          <ProtectionOptions addons={eligibleAddons} warranties={eligibleWarranties} selectedAddons={b.addonSelections} warrantyId={b.warrantySelectionId} onToggleAddon={b.toggleAddon} onWarranty={b.setWarranty} disabled={!machine} />
          <FinancingSelector value={b.financeSelection} onChange={b.setFinance} config={financing} />
          <div id="review" className="scroll-mt-28 lg:hidden">{summary}</div>
        </div>
        <div className="sticky top-24 hidden lg:block">{summary}</div>
      </Container>

      <MobileBuildBar total={totals.total} itemCount={totals.lines.length} open={sheetOpen} onOpen={() => setSheetOpen(true)} onClose={() => setSheetOpen(false)} onRequest={onRequest} canRequest={!!machine}>
        {summary}
      </MobileBuildBar>

      {pending && pendingTarget && (
        <ModelChangeDialog
          targetName={pendingTarget.modelName}
          currentName={machine?.modelName ?? "current model"}
          items={pending.incompatible.map((s) => { const a = attachmentsById.get(s.attachmentId); const v = a?.variants.find((x) => x.id === s.variantId); return `${a?.name ?? s.attachmentId}${v?.widthOrSize ? ` (${v.widthOrSize})` : ""}`; })}
          onRemoveAndSwitch={() => b.confirmModelChange(true)}
          onKeepCurrent={b.cancelModelChange}
        />
      )}
    </>
  );
}
