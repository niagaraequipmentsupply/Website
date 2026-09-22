import Link from "next/link";
import { Check, CalendarClock, ArrowRight } from "lucide-react";
import type { FinancePromo, Machine } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });

export function PromoCard({ promo, machines, emphasis }: { promo: FinancePromo; machines: Machine[]; emphasis?: boolean }) {
  const eligible = promo.eligibleModelIds === "all" ? [] : machines.filter((m) => promo.eligibleModelIds.includes(m.id));
  const external = promo.ctaHref.startsWith("http");
  return (
    <article className={`flex h-full flex-col rounded-card border-2 p-5 ${emphasis ? "border-navy bg-white shadow-card" : "border-line bg-white"}`}>
      <div className="flex flex-wrap items-center gap-2">
        {promo.badge && <Badge tone={emphasis ? "navy" : "grey"}>{promo.badge}</Badge>}
        <Badge tone={promo.kind === "promo" ? "warning" : "grey"}>{promo.kind === "promo" ? "Limited time" : "Program"}</Badge>
      </div>
      <h3 className="display mt-3 text-2xl text-charcoal">{promo.title}</h3>
      <p className="mt-2 text-[15px] text-charcoal/85">{promo.summary}</p>
      {promo.highlights.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-sm text-charcoal">
          {promo.highlights.map((h) => <li key={h} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />{h}</li>)}
        </ul>
      )}
      {eligible.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-grey">Eligible models</p>
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {eligible.map((m) => <li key={m.id}><Link href={`/inventory/${m.category}/${m.slug}`} className="inline-flex h-7 items-center rounded-full bg-tint px-2.5 text-[12px] font-semibold text-navy hover:bg-navy hover:text-white">{m.modelName}</Link></li>)}
          </ul>
        </div>
      )}
      {promo.endDate && <p className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-warning"><CalendarClock className="size-4" aria-hidden />Ends {fmtDate(promo.endDate)}</p>}
      <div className="mt-auto pt-4">
        <a href={promo.ctaHref} {...(external ? { target: "_blank", rel: "noopener" } : {})} className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-electric">{promo.ctaLabel} <ArrowRight className="size-4" aria-hidden /></a>
        {promo.terms && <p className="mt-2 text-[11px] leading-snug text-grey">{promo.terms}</p>}
      </div>
    </article>
  );
}
