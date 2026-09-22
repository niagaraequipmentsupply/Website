import type { Machine } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { AddToQuoteButton } from "./AddToQuoteButton";
import { Badge } from "@/components/ui/Badge";

/** Engine / cab / undercarriage options with per-option pricing. Cards on mobile, table from md up. */
export function ConfigurationTable({ machine }: { machine: Machine }) {
  const cfgs = machine.configurations ?? [];
  if (cfgs.length === 0) return null;
  const price = (p?: number) => (machine.showPrice && p !== undefined ? formatPrice(p) : "Request");
  return (
    <>
      <ul className="grid gap-3 md:hidden">
        {cfgs.map((c) => (
          <li key={c.id} className="rounded-card border border-line bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-bold text-charcoal">{c.label}</p>
              {c.inStock && <Badge tone="success">In stock</Badge>}
            </div>
            <dl className="mt-2 grid grid-cols-3 gap-2 text-[13px]">
              <div><dt className="text-[11px] uppercase tracking-wide text-grey">Engine</dt><dd className="text-charcoal">{c.engine ?? "—"}</dd></div>
              <div><dt className="text-[11px] uppercase tracking-wide text-grey">Power</dt><dd className="text-charcoal">{c.horsepower ?? "—"}</dd></div>
              <div><dt className="text-[11px] uppercase tracking-wide text-grey">Weight</dt><dd className="text-charcoal">{c.operatingWeight ?? "—"}</dd></div>
            </dl>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
              <p className="display text-2xl text-navy">{price(c.price)}</p>
              <AddToQuoteButton kind="machine" id={machine.id} configurationId={c.id} size="sm" label="Add to Quote" />
            </div>
          </li>
        ))}
      </ul>
      <div className="hidden overflow-x-auto rounded-card border border-line md:block">
        <table className="w-full min-w-[560px] text-sm">
          <caption className="sr-only">{machine.modelName} configurations</caption>
          <thead className="bg-light/70 text-left text-[12px] font-semibold uppercase tracking-wide text-grey">
            <tr>
              <th scope="col" className="px-4 py-3">Configuration</th>
              <th scope="col" className="px-4 py-3">Engine</th>
              <th scope="col" className="px-4 py-3">Power</th>
              <th scope="col" className="px-4 py-3">Weight</th>
              <th scope="col" className="px-4 py-3 text-right">Price</th>
              <th scope="col" className="px-4 py-3"><span className="sr-only">Add to quote</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {cfgs.map((c) => (
              <tr key={c.id} className="align-middle">
                <td className="px-4 py-3 font-semibold text-charcoal">{c.label}{c.inStock && <Badge tone="success" className="ml-2">In stock</Badge>}</td>
                <td className="px-4 py-3 text-grey">{c.engine ?? "—"}</td>
                <td className="px-4 py-3 text-grey">{c.horsepower ?? "—"}</td>
                <td className="px-4 py-3 text-grey">{c.operatingWeight ?? "—"}</td>
                <td className="px-4 py-3 text-right font-bold text-navy">{price(c.price)}</td>
                <td className="px-4 py-3 text-right"><AddToQuoteButton kind="machine" id={machine.id} configurationId={c.id} size="sm" label="Add" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
