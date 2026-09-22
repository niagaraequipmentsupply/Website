"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Check, Minus, X, Circle } from "lucide-react";
import type { Machine } from "@/lib/types";
import { PlaceholderArt } from "@/components/ui/PlaceholderArt";
import { formatPrice } from "@/lib/format";
import { machinePrice, machineHasMultiplePrices } from "@/lib/pricing";

/**
 * RIPPA-style buying-guide chart: photo row, key specs, target users, application fit (star ratings + required
 * attachments) and a safety/comfort checklist. Everything is driven by machine data; empty blocks are hidden.
 */
export function ComparisonChart({ machines, categoryName }: { machines: Machine[]; categoryName: string }) {
  const [showAttachments, setShowAttachments] = useState(false);
  if (machines.length < 2) return null;

  const spec = (m: Machine, ...labels: string[]) => {
    const s = m.specs.find((x) => labels.some((l) => x.label.toLowerCase().includes(l)));
    return s ? s.value : "—";
  };

  const allSpecRows: { label: string; get: (m: Machine) => string }[] = [
    { label: "Engine", get: (m) => spec(m, "engine model", "engine") },
    { label: "Max power", get: (m) => spec(m, "max power", "rated power", "horsepower") },
    { label: "Operating weight", get: (m) => spec(m, "operating weight", "total weight") },
    { label: "Max digging depth", get: (m) => spec(m, "dig") },
    { label: "Rated load", get: (m) => spec(m, "rated load") },
    { label: "Bucket capacity", get: (m) => spec(m, "bucket capacity") },
    { label: "Max lift height", get: (m) => spec(m, "max lift height") },
    { label: "Min transport width", get: (m) => spec(m, "transport width") },
    { label: "Warranty", get: (m) => m.warranty ?? spec(m, "warranty") },
    { label: "Noise level", get: (m) => m.noiseLevel ?? "—" },
    { label: "Indoor use", get: (m) => (m.indoorUse ? "Yes" : "—") },
    { label: "Starting price", get: (m) => (m.showPrice && machinePrice(m) !== undefined ? `${machineHasMultiplePrices(m) ? "From " : ""}${formatPrice(machinePrice(m))}` : "Request") },
  ];
  const specRows = allSpecRows.filter((r) => machines.some((m) => r.get(m) !== "—"));

  const applications = Array.from(new Set(machines.flatMap((m) => m.applicationFit.map((a) => a.application))));
  const checklistFeatures = (group: "safety" | "comfort" | "other") => Array.from(new Set(machines.flatMap((m) => m.checklist.filter((c) => c.group === group).map((c) => c.feature))));
  const safety = checklistFeatures("safety"), comfort = checklistFeatures("comfort"), other = checklistFeatures("other");
  const hasTargets = machines.some((m) => m.targetUsers);

  const th = "sticky left-0 z-[1] bg-white px-3 py-2.5 text-left text-[12px] font-semibold text-charcoal shadow-[1px_0_0_#d9e0ea] min-w-[120px] max-w-[160px] sm:min-w-[170px] sm:max-w-[220px]";
  const td = "px-3 py-2.5 text-center text-[13px] text-charcoal min-w-[150px] align-middle";
  const group = (label: string) => (
    <tr><th colSpan={machines.length + 1} scope="colgroup" className="sticky left-0 bg-navy px-3 py-2 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-white">{label}</th></tr>
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-grey">Scroll sideways to see every model. Tap a model name for its full page.</p>
        <div className="flex flex-wrap items-center gap-2">
          {applications.length > 0 && (
            <label className="flex items-center gap-2 text-sm font-semibold text-charcoal"><input type="checkbox" checked={showAttachments} onChange={(e) => setShowAttachments(e.target.checked)} className="size-4 accent-navy" />Show required attachments</label>
          )}
        </div>
      </div>
      <div className="overflow-x-auto rounded-card border border-line bg-white">
        <table className="w-full border-collapse">
          <caption className="sr-only">{categoryName} comparison chart</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className={`${th} align-bottom`}><span className="text-[11px] font-bold uppercase tracking-[0.18em] text-grey">Model</span></th>
              {machines.map((m) => (
                <th key={m.id} scope="col" className="min-w-[150px] px-3 pb-3 pt-3 align-bottom">
                  <Link href={`/inventory/${m.category}/${m.slug}`} className="group block">
                    <span className="relative mx-auto block aspect-[4/3] w-28 overflow-hidden rounded-md bg-light">
                      {m.images[0] ? <Image src={m.images[0].src} alt={m.images[0].alt} fill sizes="112px" className="object-contain p-1" /> : <PlaceholderArt kind={m.category} label={m.modelName} compact />}
                    </span>
                    <span className="mt-2 inline-block rounded-full bg-navy px-3 py-1 text-[12px] font-bold text-white group-hover:bg-electric">{m.modelName}</span>
                    {m.series && <span className="block text-[10px] font-semibold uppercase tracking-wide text-grey">{m.series}</span>}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {hasTargets && (
              <>
                {group("Who it's for")}
                <tr><th scope="row" className={th}>Target users</th>{machines.map((m) => <td key={m.id} className={`${td} text-[12px] leading-snug`}>{m.targetUsers ?? "—"}</td>)}</tr>
              </>
            )}
            {group("Key specifications")}
            {specRows.map((r) => (
              <tr key={r.label}><th scope="row" className={th}>{r.label}</th>{machines.map((m) => <td key={m.id} className={`${td} ${r.label === "Starting price" ? "font-bold text-navy" : ""}`}>{r.get(m)}</td>)}</tr>
            ))}
            {applications.length > 0 && (
              <>
                {group("Application fit")}
                {applications.map((app) => (
                  <tr key={app}>
                    <th scope="row" className={th}>{app}</th>
                    {machines.map((m) => {
                      const a = m.applicationFit.find((x) => x.application === app);
                      return (
                        <td key={m.id} className={td}>
                          {a ? <Rating value={a.rating} /> : <span className="text-grey">—</span>}
                          {showAttachments && a?.attachments && <span className="mt-1 block text-[11px] leading-snug text-grey">{a.attachments}</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </>
            )}
            {safety.length > 0 && (
              <>
                {group("Safety")}
                {safety.map((f) => <ChecklistRow key={f} feature={f} machines={machines} group="safety" th={th} td={td} />)}
              </>
            )}
            {comfort.length > 0 && (
              <>
                {group("Comfort")}
                {comfort.map((f) => <ChecklistRow key={f} feature={f} machines={machines} group="comfort" th={th} td={td} />)}
              </>
            )}
            {other.length > 0 && (
              <>
                {group("Configuration")}
                {other.map((f) => <ChecklistRow key={f} feature={f} machines={machines} group="other" th={th} td={td} />)}
              </>
            )}
          </tbody>
        </table>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-grey" aria-label="Legend">
        <li className="flex items-center gap-1"><Rating value={4} /> Highly suited</li>
        <li className="flex items-center gap-1"><Rating value={3} /> Well suited</li>
        <li className="flex items-center gap-1"><Rating value={2} /> Compatible</li>
        <li className="flex items-center gap-1"><Rating value={1} /> Usable, not optimal</li>
        <li className="flex items-center gap-1"><Rating value={0} /> Not compatible</li>
        <li className="ml-auto flex items-center gap-3"><span className="flex items-center gap-1"><Check className="size-3.5 text-success" /> Standard</span><span className="flex items-center gap-1"><Circle className="size-3 text-navy" /> Optional</span><span className="flex items-center gap-1"><Minus className="size-3.5" /> Not available</span></li>
      </ul>
    </div>
  );
}

function Rating({ value }: { value: 0 | 1 | 2 | 3 | 4 }) {
  const labels = ["Not compatible", "Usable but not optimal", "Compatible", "Well suited", "Highly suited"];
  if (value === 0) return <span className="inline-flex items-center justify-center text-grey" aria-label={labels[0]}><X className="size-4" aria-hidden /></span>;
  if (value === 1) return <span className="inline-flex items-center justify-center text-navy" aria-label={labels[1]}><Star className="size-4" aria-hidden /></span>;
  return (
    <span className="inline-flex items-center justify-center gap-0.5 text-navy" aria-label={labels[value]}>
      {Array.from({ length: value - 1 }).map((_, i) => <Star key={i} className="size-4 fill-current" aria-hidden />)}
    </span>
  );
}

function ChecklistRow({ feature, machines, group, th, td }: { feature: string; machines: Machine[]; group: "safety" | "comfort" | "other"; th: string; td: string }) {
  return (
    <tr>
      <th scope="row" className={th}>{feature}</th>
      {machines.map((m) => {
        const c = m.checklist.find((x) => x.group === group && x.feature === feature);
        return (
          <td key={m.id} className={td}>
            {!c ? <span className="text-grey">—</span> : c.status === "standard" ? (
              <span className="inline-flex flex-col items-center"><Check className="size-4 text-success" aria-label="Standard" />{c.note && <span className="text-[11px] text-grey">{c.note}</span>}</span>
            ) : c.status === "optional" ? (
              <span className="inline-flex flex-col items-center"><Circle className="size-3.5 text-navy" aria-label="Optional" /><span className="text-[11px] text-grey">{c.note ?? "Optional"}</span></span>
            ) : (
              <Minus className="mx-auto size-4 text-grey" aria-label="Not available" />
            )}
          </td>
        );
      })}
    </tr>
  );
}
