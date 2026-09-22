"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, Bookmark, Phone, Settings2, Check } from "lucide-react";
import type { BuildTotals, FinancingConfig, Machine, PricedLine } from "@/lib/types";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { SpecList } from "@/components/equipment/SpecList";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { monthlyEstimate } from "@/lib/pricing";
import { useCatalogue } from "@/components/CatalogueProvider";
import { track } from "@/lib/analytics";

interface Props {
  machine?: Machine;
  configurationLabel?: string;
  totals: BuildTotals;
  financing: FinancingConfig;
  onRemoveLine: (line: PricedLine) => void;
  onRequest: () => void;
  onSave: () => void;
  savedAt?: string;
  className?: string;
}

export function BuildSummary({ machine, configurationLabel, totals, financing, onRemoveLine, onRequest, onSave, savedAt, className = "" }: Props) {
  const { taxLabel, phoneHref } = useCatalogue();
  const attachmentLines = totals.lines.filter((l) => l.group === "attachment");
  const protectionLines = totals.lines.filter((l) => l.group === "protection" || l.group === "warranty" || l.group === "delivery");
  const monthly = monthlyEstimate(totals.total, financing);
  const [flash, setFlash] = useState(false);
  const prev = useRef(totals.total);
  useEffect(() => {
    if (prev.current !== totals.total) { setFlash(true); const t = setTimeout(() => setFlash(false), 600); prev.current = totals.total; return () => clearTimeout(t); }
  }, [totals.total]);

  return (
    <aside aria-label="Your build" className={`rounded-card border border-line bg-white ${className}`}>
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 className="display text-2xl text-charcoal">Your Build</h2>
        <button type="button" onClick={onSave} className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-electric"><Bookmark className="size-4" aria-hidden />{savedAt ? "Saved" : "Save Build"}</button>
      </div>

      <div className="px-5 py-4">
        {machine ? (
          <div className="flex gap-4">
            <EquipmentImage image={machine.images[0]} kind="excavators" alt={machine.modelName} className="w-32 shrink-0" ratio="aspect-square" sizes="128px" />
            <div className="min-w-0">
              <p className="display text-xl text-charcoal">{machine.modelName}</p>
              <p className="text-[13px] text-grey">{configurationLabel ?? "Compact Excavator"}</p>
              {machine.badge && <Badge className="mt-1">{machine.badge}</Badge>}
              <SpecList specs={machine.specs.filter((s) => s.highlight)} compact className="mt-2 text-[12px]" />
            </div>
          </div>
        ) : (
          <p className="rounded-card bg-light p-4 text-center text-sm text-grey">No model selected yet. <a href="#choose-model" className="font-semibold text-navy">Choose a model</a> to start.</p>
        )}
      </div>

      <LineGroup title="Selected Attachments" editHref="#add-attachments" lines={attachmentLines} onRemove={onRemoveLine} empty="No attachments added." />
      <LineGroup title="Protection Packages" editHref="#protection" lines={protectionLines} onRemove={onRemoveLine} empty="No packages added." />

      <div className="border-t border-line px-5 py-4 text-sm">
        <div className="flex justify-between text-grey"><span>Estimated Subtotal</span><span className="font-semibold text-charcoal">{formatPrice(totals.subtotal)}</span></div>
        {totals.taxEstimate !== undefined && <div className="mt-1 flex justify-between text-grey"><span>{taxLabel}</span><span className="font-semibold text-charcoal">{formatPrice(totals.taxEstimate)}</span></div>}
        <div className={`mt-3 flex items-baseline justify-between rounded-md px-1 ${flash ? "flash" : ""}`}>
          <span className="text-base font-bold text-charcoal">Estimated Total</span>
          <span className="display text-3xl text-navy" aria-live="polite">{formatPrice(totals.total)}</span>
        </div>
        {totals.unpricedCount > 0 && (
          <p className="mt-2 text-[12px] text-grey">{totals.unpricedCount} item{totals.unpricedCount > 1 ? "s" : ""} priced on request and not included in the estimate{machine && !machine.showPrice ? " (including the base machine)" : ""}.</p>
        )}
      </div>

      <div className="mx-5 mb-4 flex items-center gap-3 rounded-card bg-tint p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-navy"><Settings2 className="size-5" aria-hidden /></span>
        <div className="text-[13px]">
          {monthly !== undefined ? (
            <>
              <p className="text-base font-bold text-charcoal">From {formatPrice(monthly)}/month</p>
              <p className="text-grey">Indicative, based on {financing.termMonths} month term. Rates may vary.</p>
            </>
          ) : (
            <>
              <p className="font-bold text-charcoal">Financing available</p>
              <p className="text-grey">Ask us for an indicative monthly payment.</p>
            </>
          )}
          <Link href="/financing" onClick={() => track({ name: "financing_click", location: "build_summary" })} className="font-semibold text-navy underline-offset-2 hover:underline">Get financing options →</Link>
        </div>
      </div>

      <div className="grid gap-2 px-5 pb-5">
        <Button onClick={onRequest} size="lg" arrow disabled={!machine}>Request This Build</Button>
        <Button onClick={onSave} variant="secondary" size="lg" icon={savedAt ? <Check className="size-4" aria-hidden /> : <Bookmark className="size-4" aria-hidden />}>{savedAt ? "Build Saved" : "Save Build"}</Button>
        <Button href={phoneHref} variant="secondary" size="lg" icon={<Phone className="size-4" aria-hidden />} onClick={() => track({ name: "phone_click", location: "build_summary" })}>Talk to a Specialist</Button>
        <p className="mt-1 text-center text-[12px] text-grey">Have questions? Our team is here to help.</p>
      </div>
    </aside>
  );
}

function LineGroup({ title, editHref, lines, onRemove, empty }: { title: string; editHref: string; lines: PricedLine[]; onRemove: (l: PricedLine) => void; empty: string }) {
  return (
    <div className="border-t border-line px-5 py-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[12px] font-bold uppercase tracking-wide text-charcoal">{title}</h3>
        <a href={editHref} className="text-[12px] font-semibold text-navy hover:text-electric">Edit</a>
      </div>
      {lines.length === 0 ? (
        <p className="text-[13px] text-grey">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {lines.map((l) => (
            <li key={l.id} className="flex items-center gap-3 text-sm">
              <span className="min-w-0 flex-1 truncate text-charcoal">{l.label}{l.detail ? ` (${l.detail})` : ""}{l.quantity > 1 ? ` × ${l.quantity}` : ""}</span>
              <span className="font-semibold text-charcoal">{l.lineTotal !== undefined ? formatPrice(l.lineTotal) : "Quote"}</span>
              <button type="button" onClick={() => onRemove(l)} aria-label={`Remove ${l.label}`} className="flex size-9 shrink-0 items-center justify-center rounded-md text-grey hover:bg-light hover:text-charcoal"><X className="size-4" aria-hidden /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
