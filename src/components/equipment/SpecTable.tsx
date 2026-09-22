import type { SpecValue, SpecGroup } from "@/lib/types";

const groupLabels: Record<SpecGroup, string> = { general: "General", performance: "Performance", engine: "Engine", dimensions: "Dimensions & transport" };
const order: SpecGroup[] = ["general", "performance", "engine", "dimensions"];

/** Full specification table grouped by section. Values are pre-formatted in website units (kg / lb, ft / in). */
export function SpecTable({ specs, modelName }: { specs: SpecValue[]; modelName: string }) {
  if (specs.length === 0) return <p className="text-sm text-grey">Official specifications will be listed here once confirmed.</p>;
  const groups = order.map((g) => ({ g, rows: specs.filter((s) => (s.group ?? "general") === g) })).filter((x) => x.rows.length);

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-2">
        {groups.map(({ g, rows }) => (
          <div key={g} className="overflow-hidden rounded-card border border-line">
            <h3 className="bg-light/70 px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.15em] text-charcoal">{groupLabels[g]}</h3>
            <table className="w-full text-sm">
              <caption className="sr-only">{modelName} {groupLabels[g]} specifications</caption>
              <tbody className="divide-y divide-line">
                {rows.map((s) => (
                  <tr key={s.label}>
                    <th scope="row" className="w-1/2 px-4 py-2.5 text-left font-medium text-grey">{s.label}</th>
                    <td className="px-4 py-2.5 font-semibold text-charcoal">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
