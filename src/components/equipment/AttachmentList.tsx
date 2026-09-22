import Link from "next/link";
import type { Attachment, Machine } from "@/lib/types";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { attachmentUnitPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { compatibleVariants } from "@/lib/compatibility";
import { AddToQuoteButton } from "./AddToQuoteButton";
import { plateLabels } from "@/lib/plates";

/** Attachments that fit this machine, grouped by type, with the variants that fit and quote buttons. */
export function AttachmentList({ attachments, machine }: { attachments: Attachment[]; machine: Machine }) {
  const types = Array.from(new Set(attachments.map((a) => a.attachmentType)));
  if (attachments.length === 0) return null;
  return (
    <div className="space-y-6">
      {types.map((t) => (
        <div key={t}>
          <h3 className="mb-2 text-[12px] font-bold uppercase tracking-[0.15em] text-grey">{t}</h3>
          <ul className="divide-y divide-line rounded-card border border-line">
            {attachments.filter((a) => a.attachmentType === t).map((a) => {
              const variants = compatibleVariants(a, machine);
              const from = attachmentUnitPrice(a, variants[0]?.id);
              return (
                <li key={a.id} className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
                  <EquipmentImage image={a.images[0]} kind="attachment" alt={a.name} className="w-20 shrink-0 bg-light" ratio="aspect-[4/3]" sizes="80px" compact />
                  <div className="min-w-0 flex-1">
                    <Link href={`/attachments/${a.attachmentCategory}/${a.slug}`} className="font-bold text-charcoal hover:text-navy">{a.name}</Link>
                    <p className="text-[13px] text-grey">{a.description}</p>
                    {variants.length > 0 && <p className="mt-1 text-[12px] text-grey">Fits this model: {variants.map((v) => v.widthOrSize ?? v.label).join(", ")}</p>}
                    {a.plateType && <p className="mt-1 text-[12px] text-grey">Mount: {plateLabels[a.plateType] ?? a.plateType}</p>}
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <p className="text-sm font-bold text-navy">{from !== undefined ? `${variants.length > 1 ? "From " : ""}${formatPrice(from)}` : "Request pricing"}</p>
                    <AddToQuoteButton kind="attachment" id={a.id} variantId={variants[0]?.id} size="sm" label="Add" />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
