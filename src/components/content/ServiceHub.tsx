"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, PlayCircle, FileText, Wrench, Package, Droplets, ArrowRight } from "lucide-react";
import type { Machine, Post, Lubricant } from "@/lib/types";
import { PostCard, postCategoryLabels } from "./PostCard";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { Button } from "@/components/ui/Button";

/** The slice of a machine the hub needs; the service page maps full machines down to this to keep the page payload small. */
export type ServiceHubMachine = Pick<Machine, "id" | "slug" | "modelName" | "brand" | "category" | "engine" | "operatingWeight" | "images" | "documents">;
interface Props { machines: ServiceHubMachine[]; posts: Post[]; lubricants: Lubricant[] }
type Kind = "all" | "video" | "guide" | "maintenance" | "field-call";

/**
 * Model-first service hub: pick your machine, get its guides, videos, spec sheet, oils and the right forms.
 * Deep-linkable with ?model=<slug>&type=video so product pages and social posts can land here.
 */
export function ServiceHub({ machines, posts, lubricants }: Props) {
  const params = useSearchParams();
  const [model, setModel] = useState<string>(params.get("model") ?? "");
  const [kind, setKind] = useState<Kind>((params.get("type") as Kind) ?? "all");
  const [q, setQ] = useState("");
  const selected = machines.find((m) => m.slug === model);
  const cats = [{ key: "excavators", label: "Mini excavators" }, { key: "skid-steers", label: "Skid steers & loaders" }] as const;

  const list = useMemo(() => {
    let l = posts;
    if (selected) l = l.filter((p) => p.relatedMachineIds.includes(selected.id) || p.relatedMachineIds.length === 0);
    if (kind === "video") l = l.filter((p) => p.videoUrl);
    else if (kind !== "all") l = l.filter((p) => p.category === kind);
    if (q.trim()) { const s = q.toLowerCase(); l = l.filter((p) => `${p.title} ${p.excerpt} ${p.tags.join(" ")}`.toLowerCase().includes(s)); }
    return l;
  }, [posts, selected, kind, q]);
  const oils = useMemo(() => (selected ? lubricants.filter((l) => l.rippaUse) : []).slice(0, 4), [lubricants, selected]);
  const videoCount = (m: ServiceHubMachine) => posts.filter((p) => p.relatedMachineIds.includes(m.id) && p.videoUrl).length;
  const guideCount = (m: ServiceHubMachine) => posts.filter((p) => p.relatedMachineIds.includes(m.id)).length;

  return (
    <div className="rounded-card border-2 border-navy bg-white">
      <div className="border-b border-line p-5 md:p-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-navy">Service hub</p>
        <h2 className="display text-charcoal">Find help for your machine</h2>
        <p className="mt-1 text-sm text-grey">Pick your model to see its guides, videos, spec sheet, the right oils and the forms to book service or order parts.</p>
        {cats.map((c) => {
          const ms = machines.filter((m) => m.category === c.key);
          if (!ms.length) return null;
          return (
            <div key={c.key} className="mt-4">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-grey">{c.label}</p>
              <ul className="flex flex-wrap gap-2">
                {ms.map((m) => (
                  <li key={m.id}>
                    <button type="button" onClick={() => setModel(model === m.slug ? "" : m.slug)} aria-pressed={model === m.slug} className={`inline-flex h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition-colors ${model === m.slug ? "border-navy bg-navy text-white" : "border-line text-charcoal hover:border-electric hover:text-navy"}`}>
                      {m.modelName}
                      {guideCount(m) > 0 && <span className={`rounded-full px-1.5 text-[11px] ${model === m.slug ? "bg-white/20" : "bg-light text-grey"}`}>{guideCount(m)}{videoCount(m) > 0 ? ` · ${videoCount(m)}▶` : ""}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="grid gap-4 border-b border-line bg-light/60 p-5 md:grid-cols-[auto_1fr] md:p-6">
          <EquipmentImage image={selected.images[0]} kind={selected.category} alt={selected.modelName} className="w-40 bg-white" ratio="aspect-[4/3]" sizes="160px" compact />
          <div>
            <h3 className="display text-2xl text-charcoal">{selected.brand} {selected.modelName}</h3>
            <p className="text-sm text-grey">{selected.engine ?? ""}{selected.operatingWeight ? ` · ${selected.operatingWeight}` : ""}</p>
            <ul className="mt-3 flex flex-wrap gap-2 text-sm">
              {selected.documents[0] && <li><a href={selected.documents[0].url} target="_blank" rel="noopener" className="inline-flex h-9 items-center gap-1.5 rounded-btn border border-line bg-white px-3 font-semibold text-navy hover:border-electric"><FileText className="size-4" aria-hidden />Spec sheet (PDF)</a></li>}
              <li><Link href={`/inventory/${selected.category}/${selected.slug}#attachments`} className="inline-flex h-9 items-center gap-1.5 rounded-btn border border-line bg-white px-3 font-semibold text-navy hover:border-electric"><Wrench className="size-4" aria-hidden />Attachments that fit</Link></li>
              <li><a href={`#book`} className="inline-flex h-9 items-center gap-1.5 rounded-btn bg-navy px-3 font-semibold text-white hover:bg-electric">Book service for this model <ArrowRight className="size-4" aria-hidden /></a></li>
              <li><Link href={`/service/parts?model=${selected.slug}`} className="inline-flex h-9 items-center gap-1.5 rounded-btn border border-line bg-white px-3 font-semibold text-navy hover:border-electric"><Package className="size-4" aria-hidden />Order parts</Link></li>
            </ul>
            {oils.length > 0 && (
              <p className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-grey"><Droplets className="size-4 text-navy" aria-hidden />Oils &amp; grease: {oils.map((o) => <Link key={o.id} href={`/lubricants#${o.category}`} className="font-semibold text-navy hover:text-electric">{o.name}</Link>)}</p>
            )}
          </div>
        </div>
      )}

      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Content type">
            {([["all", "All"], ["video", "Videos"], ["guide", "How-to guides"], ["maintenance", "Maintenance"], ["field-call", "Field calls"]] as [Kind, string][]).map(([k, l]) => (
              <button key={k} type="button" onClick={() => setKind(k)} aria-pressed={kind === k} className={`inline-flex h-9 items-center gap-1 rounded-full border px-3 text-[13px] font-semibold ${kind === k ? "border-navy bg-navy text-white" : "border-line text-charcoal hover:border-electric"}`}>{k === "video" && <PlayCircle className="size-3.5" aria-hidden />}{l}</button>
            ))}
          </div>
          <label className="relative block md:w-72"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-grey" aria-hidden /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guides… e.g. hydraulic oil" className="h-10 w-full rounded-btn border border-line pl-9 pr-3 text-sm" aria-label="Search guides" /></label>
        </div>
        {list.length > 0 ? (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{list.slice(0, 9).map((p) => <li key={p.id}><PostCard post={p} /></li>)}</ul>
        ) : (
          <div className="mt-5 rounded-card border border-dashed border-line p-6 text-center">
            <p className="font-semibold text-charcoal">Nothing {kind === "video" ? "on video" : "written up"} for {selected ? `the ${selected.modelName}` : "that search"} yet.</p>
            <p className="mt-1 text-sm text-grey">Ask for it below and we&apos;ll bump it up the filming list, or book a technician.</p>
          </div>
        )}
        {list.length > 9 && <p className="mt-4 text-sm"><Link href={`/blog${selected ? `?model=${selected.slug}` : ""}`} className="font-semibold text-navy hover:text-electric">See all {list.length} {kind === "all" ? "posts" : postCategoryLabels[kind] ?? kind} →</Link></p>}
        <div className="mt-5 flex flex-wrap gap-2"><Button href="#book" size="sm" arrow>Book service</Button><Button href="/service/parts" size="sm" variant="secondary">Order parts</Button><Button href="#request" size="sm" variant="secondary">Request a guide</Button></div>
      </div>
    </div>
  );
}
