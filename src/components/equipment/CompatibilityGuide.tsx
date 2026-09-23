import Link from "next/link";
import type { Attachment, Machine } from "@/lib/types";
import { plateLabels } from "@/lib/plates";

const shortPlate: Record<string, string> = { "toro-dingo": "Toro Dingo plate", "rippa-mini": "RIPPA plate", "universal-ssl": "Universal plate", "excavator-qc": "Quick coupler", "pin-on": "Pin-on" };

/** Which version / part number fits which machine. One row per machine, one line per version. */
export function CompatibilityGuide({ attachment, machines }: { attachment: Attachment; machines: Machine[] }) {
  const rows = machines
    .map((m) => ({ m, variants: attachment.variants.filter((v) => (v.compatibleModelIds ?? []).includes(m.id)) }))
    .filter((r) => r.variants.length > 0)
    .sort((a, b) => a.m.category.localeCompare(b.m.category) || a.m.sortOrder - b.m.sortOrder);
  if (rows.length === 0) return null;
  const showPlate = attachment.variants.some((v) => v.plateType);
  return (
    <div className="overflow-x-auto rounded-card border border-line">
      <table className="w-full min-w-[560px] text-sm">
        <caption className="sr-only">{attachment.name} compatibility by model</caption>
        <thead className="bg-light/70 text-left text-[12px] font-semibold uppercase tracking-wide text-grey">
          <tr><th className="px-4 py-3">Machine</th><th className="px-4 py-3">Version</th>{showPlate && <th className="px-4 py-3">Plate</th>}<th className="px-4 py-3">Part number</th></tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map(({ m, variants }) => variants.map((v, i) => (
            <tr key={v.id} className={`align-top ${i === 0 && "border-t-2 border-line"}`}>
              {i === 0 ? (
                <th scope="rowgroup" rowSpan={variants.length} className="px-4 py-3 text-left font-bold text-charcoal">
                  <Link href={`/inventory/${m.category}/${m.slug}`} className="hover:text-navy">{m.modelName}</Link>
                  {m.plateType && <span className="block text-[11px] font-medium text-grey">{plateLabels[m.plateType]}</span>}
                </th>
              ) : null}
              <td className="px-4 py-3 text-charcoal">{v.widthOrSize ?? attachment.name}</td>
              {showPlate && <td className="px-4 py-3 text-[13px] text-charcoal">{v.plateType ? shortPlate[v.plateType] ?? v.plateType : "Either"}</td>}
              <td className="px-4 py-3 font-mono text-[12px] text-grey">{v.sku ?? "Quoted"}</td>
            </tr>
          )))}
        </tbody>
      </table>
    </div>
  );
}
