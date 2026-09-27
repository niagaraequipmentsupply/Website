"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { Attachment, Machine } from "@/lib/types";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { AddToQuoteButton } from "./AddToQuoteButton";
import { compatibleVariants } from "@/lib/compatibility";
import { groupAttachments } from "@/lib/attachment-groups";

const shortPlate: Record<string, string> = { "toro-dingo": "Toro Dingo plate", "rippa-mini": "RIPPA plate", "universal-ssl": "SSQA plate" };
const optionLabel = (v: { widthOrSize?: string; plateType?: string; sku?: string }, showPlate: boolean) => [v.widthOrSize, showPlate && v.plateType ? shortPlate[v.plateType] ?? v.plateType : undefined].filter(Boolean).join(" · ") || "Standard";

/**
 * Attachments that fit one machine, grouped by type (Buckets, Grapples, Augers…) as collapsible sections.
 * Each row: photo, name, a size / version picker limited to what fits this model, Add to Quote.
 */
export function AttachmentPicker({ attachments, machine }: { attachments: Attachment[]; machine: Machine }) {
  const groups = useMemo(() => groupAttachments(attachments), [attachments]);
  const [open, setOpen] = useState<Set<string>>(() => new Set(groups.slice(0, 2).map(([t]) => t)));
  const toggle = (t: string) => setOpen((s) => { const n = new Set(s); if (n.has(t)) n.delete(t); else n.add(t); return n; });

  return (
    <div>
      <nav aria-label="Attachment types" className="mb-4 flex flex-wrap gap-1.5">
        {groups.map(([t, items]) => <button key={t} type="button" onClick={() => { setOpen((s) => new Set(s).add(t)); document.getElementById(`att-${slug(t)}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="rounded-full border border-line bg-white px-3 py-1 text-[12px] font-semibold text-charcoal hover:border-electric hover:text-navy">{t} <span className="text-grey">{items.length}</span></button>)}
      </nav>
      <div className="divide-y divide-line rounded-card border border-line bg-white">
        {groups.map(([type, items]) => {
          const isOpen = open.has(type);
          return (
            <section key={type} id={`att-${slug(type)}`} className="scroll-mt-36">
              <h3>
                <button type="button" onClick={() => toggle(type)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
                  <span className="text-base font-bold text-charcoal">{type} <span className="ml-1 text-sm font-semibold text-grey">{items.length}</span></span>
                  <ChevronDown className={`size-5 text-grey transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden />
                </button>
              </h3>
              {isOpen && (
                <ul className="divide-y divide-line border-t border-line bg-light/40">
                  {items.map((a) => <Row key={a.id} attachment={a} machine={machine} />)}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Row({ attachment: a, machine }: { attachment: Attachment; machine: Machine }) {
  const variants = useMemo(() => compatibleVariants(a, machine), [a, machine]);
  const showPlate = new Set(variants.map((v) => v.plateType).filter(Boolean)).size > 1;
  const [variantId, setVariantId] = useState<string | undefined>(variants[0]?.id);
  const current = variants.find((v) => v.id === variantId) ?? variants[0];
  const href = `/attachments/${a.attachmentCategory}/${a.slug}`;
  return (
    <li className="grid grid-cols-[64px_1fr] items-center gap-3 px-4 py-3 sm:grid-cols-[64px_minmax(0,1.4fr)_minmax(0,1fr)_auto]">
      <Link href={href} className="block"><EquipmentImage image={a.images[0]} kind="attachment" alt={a.name} className="w-16 bg-white" ratio="aspect-square" sizes="64px" compact /></Link>
      <div className="min-w-0">
        <Link href={href} className="block truncate font-bold text-charcoal hover:text-navy">{a.name}</Link>
        <p className="truncate text-[12px] text-grey">{a.attachmentType} · {a.description}</p>
      </div>
      <div className="col-span-2 min-w-0 sm:col-span-1">
        {variants.length > 1 ? (
          <label className="block">
            <span className="sr-only">{a.name} size or version</span>
            <select value={current?.id} onChange={(e) => setVariantId(e.target.value)} className="h-10 w-full truncate rounded-btn border border-line bg-white px-2 text-sm text-charcoal focus:border-electric">
              {variants.map((v) => <option key={v.id} value={v.id}>{optionLabel(v, showPlate)}</option>)}
            </select>
          </label>
        ) : (
          <p className="truncate text-[13px] text-grey">{current ? optionLabel(current, showPlate) : "Fits this model"}{current?.sku ? ` · ${current.sku}` : ""}</p>
        )}
      </div>
      <div className="col-span-2 flex items-center justify-end gap-2 sm:col-span-1">
        <AddToQuoteButton kind="attachment" id={a.id} variantId={current?.id} size="sm" label="Add" />
      </div>
    </li>
  );
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
