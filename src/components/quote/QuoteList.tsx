"use client";
import Link from "next/link";
import { X, Minus, Plus, ArrowRight } from "lucide-react";
import { useQuote } from "@/store/quote";
import { attachmentUnitPrice, calculateTotals, machineConfigPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { useCatalogue } from "@/components/CatalogueProvider";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import type { QuoteItem } from "@/lib/types";
import type { Catalogue } from "@/lib/pricing";

export function QuoteList() {
  const { items, remove, updateQuantity, clear } = useQuote();
  const { catalogue, taxRate } = useCatalogue();

  if (items.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line p-8 text-center">
        <p className="font-semibold text-charcoal">Your quote list is empty.</p>
        <p className="mt-1 text-sm text-grey">Add machines and attachments, or configure a machine in the builder. You can also send us a request with the form below.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm font-semibold text-navy">
          <Link href="/inventory" className="inline-flex items-center gap-1 hover:text-electric">Browse inventory <ArrowRight className="size-4" /></Link>
          <Link href="/attachments" className="inline-flex items-center gap-1 hover:text-electric">Browse attachments <ArrowRight className="size-4" /></Link>
          <Link href="/builder/excavator" className="inline-flex items-center gap-1 hover:text-electric">Excavator builder <ArrowRight className="size-4" /></Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-line rounded-card border border-line">
        {items.map((item) => <li key={item.id} className="p-4"><QuoteRow item={item} catalogue={catalogue} taxRate={taxRate} onRemove={() => remove(item.id)} onQty={(q) => updateQuantity(item.id, q)} /></li>)}
      </ul>
      <div className="mt-3 flex justify-between text-sm">
        <button type="button" onClick={clear} className="font-semibold text-grey hover:text-charcoal">Clear list</button>
        <p className="text-grey">Pricing shown is indicative. Final quote confirmed by our team.</p>
      </div>
    </div>
  );
}

function QuoteRow({ item, catalogue, taxRate, onRemove, onQty }: { item: QuoteItem; catalogue: Catalogue; taxRate?: number; onRemove: () => void; onQty: (q: number) => void }) {
  if (item.kind === "machine") {
    const m = catalogue.machines.find((x) => x.id === item.machineId);
    if (!m) return null;
    const cfg = m.configurations?.find((c) => c.id === item.configurationId);
    const unit = machineConfigPrice(m, item.configurationId);
    return (
      <Row image={<EquipmentImage image={m.images[0]} kind={m.category} alt={m.modelName} className="w-24" ratio="aspect-square" sizes="96px" />} title={`${m.brand} ${m.modelName}${cfg ? ` · ${cfg.label}` : ""}`} sub={cfg ? [cfg.engine, cfg.horsepower, cfg.operatingWeight].filter(Boolean).join(" · ") : m.shortDescription} href={`/inventory/${m.category}/${m.slug}`} price={unit !== undefined ? formatPrice(unit * item.quantity) : "Request pricing"} qty={item.quantity} onQty={onQty} onRemove={onRemove} />
    );
  }
  if (item.kind === "attachment") {
    const a = catalogue.attachments.find((x) => x.id === item.attachmentId);
    if (!a) return null;
    const v = a.variants.find((x) => x.id === item.variantId);
    const unit = attachmentUnitPrice(a, item.variantId);
    return (
      <Row image={<EquipmentImage image={a.images[0]} kind="attachment" alt={a.name} className="w-24" ratio="aspect-square" sizes="96px" />} title={`${a.name}${v?.widthOrSize ? ` (${v.widthOrSize})` : ""}`} sub={a.description} href={`/attachments/${a.attachmentCategory}/${a.slug}`} price={unit !== undefined ? formatPrice(unit * item.quantity) : "Request pricing"} qty={item.quantity} onQty={a.supportsQuantity ? onQty : undefined} onRemove={onRemove} />
    );
  }
  const totals = calculateTotals(item.configuration, catalogue, taxRate);
  const m = catalogue.machines.find((x) => x.id === item.configuration.selectedModelId);
  return (
    <div className="flex gap-4">
      <EquipmentImage image={m?.images[0]} kind="excavators" alt={m?.modelName ?? "Build"} className="w-24 shrink-0" ratio="aspect-square" sizes="96px" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-bold text-charcoal">{item.name}</p>
            <p className="text-[12px] uppercase tracking-wide text-navy">Configured build · {item.configuration.financeSelection}</p>
          </div>
          <button type="button" onClick={onRemove} aria-label={`Remove ${item.name}`} className="flex size-9 shrink-0 items-center justify-center rounded-md text-grey hover:bg-light hover:text-charcoal"><X className="size-4" /></button>
        </div>
        <ul className="mt-2 grid gap-0.5 text-[13px] text-grey sm:grid-cols-2">
          {totals.lines.map((l) => <li key={l.id}>• {l.label}{l.detail ? ` (${l.detail})` : ""}{l.quantity > 1 ? ` × ${l.quantity}` : ""} — {l.lineTotal !== undefined ? formatPrice(l.lineTotal) : "quote"}</li>)}
        </ul>
        <div className="mt-2 flex items-center justify-between text-sm">
          <Link href="/builder/excavator" className="font-semibold text-navy hover:text-electric">Edit in builder</Link>
          <p className="font-bold text-charcoal">{totals.total > 0 ? `Est. ${formatPrice(totals.total)}${totals.unpricedCount > 0 ? " + items on request" : ""}` : "Priced on request"}</p>
        </div>
      </div>
    </div>
  );
}

function Row({ image, title, sub, href, price, qty, onQty, onRemove }: { image: React.ReactNode; title: string; sub: string; href: string; price: string; qty: number; onQty?: (q: number) => void; onRemove: () => void }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0">{image}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={href} className="font-bold text-charcoal hover:text-navy">{title}</Link>
            <p className="truncate text-[13px] text-grey">{sub}</p>
          </div>
          <button type="button" onClick={onRemove} aria-label={`Remove ${title}`} className="flex size-9 shrink-0 items-center justify-center rounded-md text-grey hover:bg-light hover:text-charcoal"><X className="size-4" /></button>
        </div>
        <div className="mt-2 flex items-center justify-between">
          {onQty ? (
            <div className="flex items-center gap-1 text-sm">
              <button type="button" aria-label="Decrease quantity" onClick={() => onQty(qty - 1)} className="flex size-9 items-center justify-center rounded-btn border border-line hover:border-electric"><Minus className="size-4" /></button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => onQty(qty + 1)} className="flex size-9 items-center justify-center rounded-btn border border-line hover:border-electric"><Plus className="size-4" /></button>
            </div>
          ) : <span className="text-sm text-grey">Qty {qty}</span>}
          <p className="font-bold text-charcoal">{price}</p>
        </div>
      </div>
    </div>
  );
}
