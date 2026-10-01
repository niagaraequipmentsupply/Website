import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { serviceAreas } from "@/data/service-areas";

/** Home-page strip linking every local landing page (internal links for local search). */
export function ServiceAreas() {
  return (
    <section className="border-y border-line bg-white">
      <Container className="flex flex-col gap-4 py-8 lg:flex-row lg:items-center lg:gap-10">
        <div className="shrink-0 lg:w-72">
          <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-navy"><MapPin className="size-4" aria-hidden />Serving Niagara &amp; Southern Ontario</p>
          <h2 className="display mt-1 text-2xl text-charcoal">Delivery, demos and service near you</h2>
        </div>
        <ul className="flex flex-wrap gap-2">
          {serviceAreas.map((a) => (
            <li key={a.slug}>
              <Link href={`/service-area/${a.slug}`} className="chamfer inline-flex h-9 items-center border-2 border-charcoal/70 bg-white px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal transition-colors hover:border-navy hover:bg-navy hover:text-white">{a.name}</Link>
            </li>
          ))}
          <li><Link href="/service-area" className="inline-flex h-9 items-center gap-1 px-2 text-[13px] font-semibold text-navy hover:text-electric">All areas <ArrowRight className="size-3.5" aria-hidden /></Link></li>
        </ul>
      </Container>
    </section>
  );
}
