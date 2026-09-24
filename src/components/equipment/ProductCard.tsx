import Link from "next/link";
import type { Machine } from "@/lib/types";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { SpecList } from "./SpecList";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/format";
import { machinePrice, machineHasMultiplePrices } from "@/lib/pricing";
import { AddToQuoteButton } from "./AddToQuoteButton";
import { Button } from "@/components/ui/Button";
import { isThin } from "@/lib/machines";

export function ProductCard({ machine }: { machine: Machine }) {
  const href = `/inventory/${machine.category}/${machine.slug}`;
  const price = machinePrice(machine);
  return (
    <article className="flex h-full flex-col rounded-card border border-line bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-electric hover:shadow-lift">
      <Link href={href} className="block">
        <EquipmentImage image={machine.images[0]} kind={machine.category} alt={`${machine.brand} ${machine.modelName}`} />
      </Link>
      <div className="mt-4 flex items-start justify-between gap-2">
        <h3 className="display text-2xl text-charcoal"><Link href={href}>{machine.modelName}</Link></h3>
        {machine.badge && <Badge>{machine.badge}</Badge>}
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-grey">{machine.shortDescription}</p>
      {isThin(machine) ? <p className="mt-3 rounded-md bg-light px-3 py-2 text-[12px] text-grey">Full specs and photos coming soon. Ask us for the spec sheet and availability.</p> : <SpecList specs={machine.specs.filter((s) => s.highlight)} compact className="mt-3" />}
      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <p className="text-sm font-semibold text-navy">{machine.showPrice && price !== undefined ? <>{machineHasMultiplePrices(machine) && <span className="font-medium text-grey">From </span>}{formatPrice(price)}</> : "Request pricing"}</p>
        {machine.inStock !== undefined && <Badge tone={machine.inStock ? "success" : "grey"}>{machine.inStock ? "In stock" : "Order"}</Badge>}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button href={href} variant="secondary" size="sm">Details</Button>
        <AddToQuoteButton kind="machine" id={machine.id} size="sm" />
      </div>
    </article>
  );
}
