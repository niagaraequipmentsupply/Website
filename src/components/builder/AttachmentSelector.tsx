"use client";
import { RuggedChip } from "@/components/ui/RuggedChip";
import { includedWith, isIncludedAttachment } from "@/lib/included";
import { useMemo, useState } from "react";
import { Check, Plus, Minus } from "lucide-react";
import type { Attachment, AttachmentSelection, Machine } from "@/lib/types";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { Button } from "@/components/ui/Button";
import { compatibleVariants } from "@/lib/compatibility";
import { attachmentUnitPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { BuilderSection } from "./BuilderSection";
import { groupAttachments } from "@/lib/attachment-groups";

interface Props {
  machine?: Machine;
  attachments: Attachment[];
  selections: AttachmentSelection[];
  onAdd: (attachmentId: string, variantId?: string) => void;
  onRemove: (attachmentId: string, variantId?: string) => void;
  onQuantity: (attachmentId: string, variantId: string | undefined, qty: number) => void;
  browseHref: string;
}

export function AttachmentSelector({ machine, attachments, selections, onAdd, onRemove, onQuantity, browseHref }: Props) {
  const included = includedWith(machine);
  const selectable = useMemo(() => attachments.filter((a) => !isIncludedAttachment(machine, a.name)), [attachments, machine]);
  const groups = useMemo(() => groupAttachments(selectable), [selectable]);
  const [type, setType] = useState<string>("all");
  const visible = type === "all" ? groups : groups.filter(([t]) => t === type);
  const selectedCount = selections.length;
  return (
    <BuilderSection id="add-attachments" step={2} title="Add Attachments" text={machine ? `Attachments RIPPA lists for the ${machine.modelName}, grouped by type. Pick a size, then add.${selectedCount ? ` ${selectedCount} added.` : ""}` : "Select a model to see compatible attachments."} link={{ href: browseHref, label: "Browse all attachments" }}>
      {!machine ? (
        <p className="rounded-card bg-light p-6 text-center text-sm text-grey">Choose a model above to see the attachments that fit it.</p>
      ) : attachments.length === 0 ? (
        <p className="rounded-card bg-light p-6 text-center text-sm text-grey">No attachments have been configured for this model yet.</p>
      ) : (
        <>
          {included.length > 0 && (
            <div className="mb-5 rounded-card border border-success/40 bg-success/5 p-4">
              <p className="flex flex-wrap items-center gap-2 text-[12px] font-bold uppercase tracking-[0.15em] text-charcoal">
                <Check className="size-4 text-success" aria-hidden />Included with every {machine.modelName}
                <span className="chamfer bg-success px-2 py-1 text-[10px] text-white">No additional charge</span>
              </p>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {included.map((i) => (
                  <li key={i.label} className="flex items-start gap-2 text-sm text-charcoal"><Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden /><span><strong>{i.label}</strong> <span className="text-grey">· {i.detail}</span></span></li>
                ))}
              </ul>
            </div>
          )}
          <div className="no-scrollbar -mx-1 mb-4 flex gap-1.5 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Attachment types">
            <RuggedChip role="tab" aria-selected={type === "all"} active={type === "all"} onClick={() => setType("all")} size="sm" count={selectable.length} className="shrink-0">All</RuggedChip>
            {groups.map(([t, items]) => <RuggedChip key={t} role="tab" aria-selected={type === t} active={type === t} onClick={() => setType(t)} size="sm" count={items.length} className="shrink-0">{t}</RuggedChip>)}
          </div>
          <div className="space-y-6">
            {visible.map(([t, items]) => (
              <div key={t}>
                {type === "all" && <h3 className="mb-2 text-[12px] font-bold uppercase tracking-[0.15em] text-grey">{t}</h3>}
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((a) => (
                    <li key={a.id}><AttachmentOption attachment={a} machine={machine} selections={selections.filter((s) => s.attachmentId === a.id)} onAdd={onAdd} onRemove={onRemove} onQuantity={onQuantity} /></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </BuilderSection>
  );
}

function AttachmentOption({ attachment: a, machine, selections, onAdd, onRemove, onQuantity }: { attachment: Attachment; machine: Machine; selections: AttachmentSelection[] } & Pick<Props, "onAdd" | "onRemove" | "onQuantity">) {
  const variants = compatibleVariants(a, machine);
  const [variantId, setVariantId] = useState<string | undefined>(variants[0]?.id);
  const activeVariant = variants.find((v) => v.id === variantId) ?? variants[0];
  const current = selections.find((s) => s.variantId === (a.variants.length ? activeVariant?.id : undefined));
  const added = !!current;
  const price = attachmentUnitPrice(a, activeVariant?.id);

  return (
    <div className={`relative flex h-full min-w-0 flex-col rounded-card border-2 bg-white p-3 transition-all duration-200 ${added ? "border-navy bg-tint/30" : "border-line hover:border-electric"}`}>
      {added && <span className="absolute right-3 top-3 z-[1] flex size-7 items-center justify-center rounded-full bg-navy text-white"><Check className="size-4" aria-hidden /></span>}
      <EquipmentImage image={a.images[0]} kind="attachment" alt={a.name} />
      <h3 className="mt-3 truncate text-base font-bold text-charcoal" title={a.name}>{a.name}</h3>
      <p className="line-clamp-2 text-[12px] leading-snug text-grey">{a.description}</p>
      {variants.length === 1 && variants[0].widthOrSize && <p className="mt-2 truncate text-[12px] text-grey">{variants[0].widthOrSize}</p>}
      {variants.length > 1 && (
        <label className="mt-2 block text-[12px] font-semibold text-grey">
          <span className="sr-only">{a.name} size</span>
          <select value={activeVariant?.id} onChange={(e) => setVariantId(e.target.value)} disabled={added} className="mt-1 h-10 w-full min-w-0 truncate rounded-btn border border-line bg-white px-2 pr-7 text-[13px] text-charcoal focus:border-electric disabled:bg-light">
            {variants.map((v) => <option key={v.id} value={v.id}>{v.widthOrSize ?? "Standard"}</option>)}
          </select>
        </label>
      )}
      <p className="mt-auto pt-3 text-[13px] font-semibold text-navy">{price !== undefined ? `+ ${formatPrice(price)}` : "Priced in your quote"}</p>
      <div className="mt-2 flex items-center gap-2">
        {added ? (
          <Button onClick={() => onRemove(a.id, current?.variantId)} size="sm" className="flex-1" icon={<Check className="size-4" aria-hidden />} aria-pressed>Added</Button>
        ) : (
          <Button onClick={() => onAdd(a.id, a.variants.length ? activeVariant?.id : undefined)} variant="secondary" size="sm" className="flex-1" icon={<Plus className="size-4" aria-hidden />}>Add</Button>
        )}
      </div>
      {added && a.supportsQuantity && current && (
        <div className="mt-2 flex items-center justify-center gap-2 text-sm">
          <button type="button" aria-label="Decrease quantity" onClick={() => onQuantity(a.id, current.variantId, current.quantity - 1)} className="flex size-9 items-center justify-center rounded-btn border border-line hover:border-electric"><Minus className="size-4" /></button>
          <span className="w-8 text-center font-semibold" aria-live="polite">{current.quantity}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => onQuantity(a.id, current.variantId, current.quantity + 1)} className="flex size-9 items-center justify-center rounded-btn border border-line hover:border-electric"><Plus className="size-4" /></button>
        </div>
      )}
    </div>
  );
}
