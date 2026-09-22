import Link from "next/link";
import type { Machine } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { machinePrice, machineHasMultiplePrices } from "@/lib/pricing";

/** Side-by-side spec summary for a category. Columns come from the highlighted specs present in the data. */
export function CompareTable({ machines, title = "Compare models" }: { machines: Machine[]; title?: string }) {
  const rows = machines.filter((m) => m.specs.some((s) => s.highlight));
  if (rows.length < 2) return null;
  const labels = Array.from(new Set(rows.flatMap((m) => m.specs.filter((s) => s.highlight).map((s) => s.label)))).filter((l) => l !== "Warranty");
  return (
    <section id="compare" aria-labelledby="compare-title" className="scroll-mt-28">
      <h2 id="compare-title" className="display mb-4 text-2xl text-charcoal">{title}</h2>
      <div className="overflow-x-auto rounded-card border border-line">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-light/70 text-left text-[12px] font-semibold uppercase tracking-wide text-grey">
            <tr>
              <th scope="col" className="px-4 py-3">Model</th>
              {labels.map((l) => <th key={l} scope="col" className="px-4 py-3">{l}</th>)}
              <th scope="col" className="px-4 py-3 text-right">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((m) => {
              const price = machinePrice(m);
              return (
                <tr key={m.id}>
                  <th scope="row" className="px-4 py-3 text-left font-bold text-charcoal"><Link href={`/inventory/${m.category}/${m.slug}`} className="hover:text-navy">{m.modelName}</Link>{m.series ? <span className="block text-[11px] font-medium uppercase tracking-wide text-grey">{m.series}</span> : null}</th>
                  {labels.map((l) => <td key={l} className="px-4 py-3 text-grey">{m.specs.find((s) => s.label === l)?.value || "—"}</td>)}
                  <td className="px-4 py-3 text-right font-bold text-navy">{m.showPrice && price !== undefined ? `${machineHasMultiplePrices(m) ? "From " : ""}${formatPrice(price)}` : "Request"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
