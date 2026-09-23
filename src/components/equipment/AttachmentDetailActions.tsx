"use client";
import { useMemo, useState } from "react";
import type { Attachment, Machine } from "@/lib/types";
import { attachmentUnitPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { AddToQuoteButton } from "./AddToQuoteButton";
import { Button } from "@/components/ui/Button";

const shortPlate: Record<string, string> = { "toro-dingo": "Toro Dingo plate", "rippa-mini": "RIPPA plate", "universal-ssl": "Universal plate" };
const field = "h-11 w-full rounded-btn border border-line bg-white px-3 text-[15px] text-charcoal focus:border-electric";

/**
 * Model-first selector: pick your machine, then the size/variant listed for it. Variants carry the SKU and
 * the exact models they fit, so the quote always names a real part number.
 */
export function AttachmentDetailActions({ attachment, machines }: { attachment: Attachment; machines: Machine[] }) {
  const byModel = useMemo(() => {
    const map = new Map<string, typeof attachment.variants>();
    for (const v of attachment.variants) for (const id of v.compatibleModelIds ?? []) map.set(id, [...(map.get(id) ?? []), v]);
    return map;
  }, [attachment]);
  const fits = machines.filter((m) => byModel.has(m.id));
  const plates = new Set(attachment.variants.map((v) => v.plateType).filter(Boolean));
  const [modelId, setModelId] = useState<string>(fits[0]?.id ?? "");
  const options = byModel.get(modelId) ?? attachment.variants;
  const [variantId, setVariantId] = useState<string | undefined>(options[0]?.id);
  const current = options.find((v) => v.id === variantId) ?? options[0];
  const [qty, setQty] = useState(1);
  const price = attachmentUnitPrice(attachment, current?.id);
  const onModel = (id: string) => { setModelId(id); setVariantId((byModel.get(id) ?? [])[0]?.id); };

  if (attachment.variants.length === 0) {
    return (
      <div className="mt-6">
        <p className="display text-3xl text-navy">{formatPrice(price)}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2"><AddToQuoteButton kind="attachment" id={attachment.id} size="lg" /><Button href="/contact" variant="secondary" size="lg">Ask about fitment</Button></div>
      </div>
    );
  }
  return (
    <div className="mt-6 rounded-card border border-line bg-light/60 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold text-charcoal">1. Your machine
          <select value={modelId} onChange={(e) => onModel(e.target.value)} className={`${field} mt-1`}>
            {fits.map((m) => <option key={m.id} value={m.id}>{m.brand} {m.modelName}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-charcoal">2. Size / version
          <select value={current?.id} onChange={(e) => setVariantId(e.target.value)} className={`${field} mt-1`}>
            {options.map((v) => <option key={v.id} value={v.id}>{v.widthOrSize ?? v.label}{v.plateType && plates.size > 1 ? ` · ${shortPlate[v.plateType] ?? v.plateType}` : ""}{v.sku ? ` · ${v.sku}` : ""}</option>)}
          </select>
        </label>
      </div>
      {current && <p className="mt-2 text-[13px] text-grey">Selected: <span className="font-semibold text-charcoal">{current.label}</span>{current.sku && <> · Part {current.sku}</>}</p>}
      <div className="mt-3 flex flex-wrap items-end gap-4">
        <div><p className="text-[12px] font-semibold uppercase tracking-wide text-grey">Price</p><p className="display text-3xl text-navy">{formatPrice(price)}</p></div>
        {attachment.supportsQuantity && <label className="text-sm font-semibold text-charcoal">Qty<input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} className="ml-2 h-11 w-20 rounded-btn border border-line px-3" /></label>}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <AddToQuoteButton kind="attachment" id={attachment.id} variantId={current?.id} quantity={qty} size="lg" />
        {attachment.attachmentCategory === "excavator-attachments" && <Button href={`/builder/excavator?model=${fits.find((m) => m.id === modelId)?.slug ?? ""}`} variant="secondary" size="lg" arrow>Configure in Builder</Button>}
      </div>
    </div>
  );
}
