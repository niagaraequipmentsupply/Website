"use client";
import { useState } from "react";
import { Check, Plus, Minus } from "lucide-react";
import type { Attachment, AttachmentSelection, Machine } from "@/lib/types";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { Button } from "@/components/ui/Button";
import { compatibleVariants } from "@/lib/compatibility";
import { attachmentUnitPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { BuilderSection } from "./BuilderSection";

interface Props {
  machine?: Machine;
  attachments: Attachment[];
  selections: AttachmentSelection[];
  onAdd: (attachmentId: string, variantId?: string) => void;
  onRemove: (attachmentId: string, variantId?: string) => void;
  onQuantity: (attachmentId: string, variantId: string | undefined, qty: number) => void;
}

export function AttachmentSelector({ machine, attachments, selections, onAdd, onRemove, onQuantity }: Props) {
  return (
    <BuilderSection id="add-attachments" step={2} title="Add Attachments" text={machine ? `Showing attachments compatible with the ${machine.modelName}.` : "Select a model to see compatible attachments."} link={{ href: "/attachments/excavator-attachments", label: "View All Attachments" }}>
      {!machine ? (
        <p className="rounded-card bg-light p-6 text-center text-sm text-grey">Choose a model above to unlock compatible attachments.</p>
      ) : attachments.length === 0 ? (
        <p className="rounded-card bg-light p-6 text-center text-sm text-grey">No attachments have been configured for this model yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {attachments.map((a) => (
            <li key={a.id}><AttachmentOption attachment={a} machine={machine} selections={selections.filter((s) => s.attachmentId === a.id)} onAdd={onAdd} onRemove={onRemove} onQuantity={onQuantity} /></li>
          ))}
        </ul>
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
    <div className={`relative flex h-full flex-col rounded-card border-2 bg-white p-4 transition-all duration-200 ${added ? "border-navy bg-tint/30" : "border-line hover:border-electric"}`}>
      {added && <span className="absolute right-3 top-3 z-[1] flex size-7 items-center justify-center rounded-full bg-navy text-white"><Check className="size-4" aria-hidden /></span>}
      <EquipmentImage image={a.images[0]} kind="attachment" alt={a.name} />
      <h3 className="mt-3 text-base font-bold text-charcoal">{a.name}</h3>
      <p className="text-[13px] text-grey">{a.description}</p>
      {variants.length > 1 && (
        <label className="mt-2 block text-[12px] font-semibold text-grey">
          <span className="sr-only">{a.name} size</span>
          <select value={activeVariant?.id} onChange={(e) => setVariantId(e.target.value)} disabled={added} className="mt-1 h-10 w-full rounded-btn border border-line bg-white px-2 text-sm text-charcoal">
            {variants.map((v) => <option key={v.id} value={v.id}>{v.widthOrSize ?? v.label}</option>)}
          </select>
        </label>
      )}
      <p className="mt-3 text-base font-bold text-navy">{price !== undefined ? `+ ${formatPrice(price)}` : "Price on request"}</p>
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
