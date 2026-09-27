"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import type { Part } from "@/lib/types";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { Button } from "@/components/ui/Button";
import { systemLabel, systemOrder } from "@/lib/parts";

/** Search + system filter over one machine's parts; rows link to the part page and a prefilled request. */
export function PartsBrowser({ parts, modelName, modelSlug }: { parts: Part[]; modelName: string; modelSlug: string }) {
  const [q, setQ] = useState("");
  const [system, setSystem] = useState<string>("all");
  const [open, setOpen] = useState<Set<string>>(() => new Set());
  const systems = useMemo(() => Array.from(new Set(parts.map((p) => p.system))).sort((a, b) => systemOrder.indexOf(a) - systemOrder.indexOf(b)), [parts]);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return parts.filter((p) => (system === "all" || p.system === system) && (!s || `${p.name} ${p.sku}`.toLowerCase().includes(s)));
  }, [parts, q, system]);
  const groups = useMemo(() => { const m = new Map<string, Part[]>(); for (const p of filtered) m.set(p.system, [...(m.get(p.system) ?? []), p]); return Array.from(m.entries()).sort((a, b) => systemOrder.indexOf(a[0]) - systemOrder.indexOf(b[0])); }, [filtered]);
  const searching = q.trim().length > 0 || system !== "all";
  const isOpen = (s: string) => searching || open.has(s) || groups.length <= 2;
  const toggle = (s: string) => setOpen((o) => { const n = new Set(o); if (n.has(s)) n.delete(s); else n.add(s); return n; });
  return (
    <div>
      <div className="mb-4 grid gap-3 rounded-card border border-line bg-light/60 p-4 sm:grid-cols-[1fr_auto]">
        <label className="relative block">
          <span className="sr-only">Search {modelName} parts</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-grey" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${modelName} parts by name or part number…`} className="h-11 w-full rounded-btn border border-line bg-white pl-9 pr-3 text-[15px] text-charcoal focus:border-electric" />
        </label>
        <label className="block">
          <span className="sr-only">System</span>
          <select value={system} onChange={(e) => setSystem(e.target.value)} className="h-11 w-full rounded-btn border border-line bg-white px-3 text-[15px] text-charcoal focus:border-electric sm:w-60">
            <option value="all">All systems ({parts.length})</option>
            {systems.map((s) => <option key={s} value={s}>{systemLabel(s)} ({parts.filter((p) => p.system === s).length})</option>)}
          </select>
        </label>
        <p className="text-[13px] text-grey sm:col-span-2">{filtered.length} part{filtered.length === 1 ? "" : "s"}{searching ? " match" : ` listed by RIPPA for the ${modelName}`}. Don&apos;t see it? <Link href={`/service/parts?model=${modelSlug}`} className="font-semibold text-navy">Send us the part number or a photo</Link> and we source it.</p>
      </div>
      <div className="divide-y divide-line rounded-card border border-line bg-white">
        {groups.length === 0 && <p className="p-6 text-center text-sm text-grey">No parts match. Try a shorter search, or ask us directly.</p>}
        {groups.map(([s, items]) => (
          <section key={s} id={`parts-${s}`} className="scroll-mt-36">
            <h3>
              <button type="button" onClick={() => toggle(s)} aria-expanded={isOpen(s)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
                <span className="text-base font-bold text-charcoal">{systemLabel(s)} <span className="ml-1 text-sm font-semibold text-grey">{items.length}</span></span>
                <ChevronDown className={`size-5 text-grey transition-transform ${isOpen(s) ? "rotate-180" : ""}`} aria-hidden />
              </button>
            </h3>
            {isOpen(s) && (
              <ul className="divide-y divide-line border-t border-line bg-light/40">
                {items.map((p) => (
                  <li key={p.id} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 px-4 py-2.5">
                    <Link href={`/parts/item/${p.slug}`} className="block"><EquipmentImage image={p.image} kind="attachment" alt={p.name} className="w-14 bg-white" ratio="aspect-square" sizes="56px" compact /></Link>
                    <div className="min-w-0">
                      <Link href={`/parts/item/${p.slug}`} className="block truncate font-semibold text-charcoal hover:text-navy">{p.name}</Link>
                      <p className="font-mono text-[12px] text-grey">{p.sku}</p>
                    </div>
                    <Button href={`/service/parts?model=${modelSlug}&sku=${encodeURIComponent(p.sku)}`} size="sm" variant="secondary">Request</Button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
