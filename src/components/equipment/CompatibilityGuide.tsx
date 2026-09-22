import Link from "next/link";
import type { Attachment, Machine } from "@/lib/types";
import { plateLabels } from "@/lib/plates";

/** Which size / part number fits which machine. */
export function CompatibilityGuide({ attachment, machines }: { attachment: Attachment; machines: Machine[] }) {
  const rows = machines
    .map((m) => ({ m, variants: attachment.variants.filter((v) => (v.compatibleModelIds ?? []).includes(m.id)) }))
    .filter((r) => r.variants.length > 0)
    .sort((a, b) => a.m.category.localeCompare(b.m.category) || a.m.sortOrder - b.m.sortOrder);
  if (rows.length === 0) return null;
  return (
    <div className="overflow-x-auto rounded-card border border-line">
      <table className="w-full min-w-[520px] text-sm">
        <caption className="sr-only">{attachment.name} compatibility by model</caption>
        <thead className="bg-light/70 text-left text-[12px] font-semibold uppercase tracking-wide text-grey"><tr><th className="px-4 py-3">Machine</th><th className="px-4 py-3">Sizes / versions available</th><th className="px-4 py-3">Part numbers</th></tr></thead>
        <tbody className="divide-y divide-line">
          {rows.map(({ m, variants }) => (
            <tr key={m.id} className="align-top">
              <th scope="row" className="px-4 py-3 text-left font-bold text-charcoal"><Link href={`/inventory/${m.category}/${m.slug}`} className="hover:text-navy">{m.modelName}</Link>{m.plateType && <span className="block text-[11px] font-medium text-grey">{plateLabels[m.plateType]}</span>}</th>
              <td className="px-4 py-3 text-charcoal">{variants.map((v) => v.widthOrSize ?? v.label).join(" · ")}</td>
              <td className="px-4 py-3 text-[12px] text-grey">{variants.map((v) => v.sku).filter(Boolean).join(", ") || "Quoted"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
