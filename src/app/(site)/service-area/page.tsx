import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Truck, Wrench, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { IconFeature } from "@/components/ui/IconFeature";
import { Button } from "@/components/ui/Button";
import { getSiteContent } from "@/lib/catalogue";
import { serviceAreas } from "@/data/service-areas";

export const metadata: Metadata = {
  title: "Areas We Serve: Niagara & Southern Ontario",
  description: "RIPPA equipment sales, delivery, demos and service for Niagara Falls, St. Catharines, Welland, Thorold, Fort Erie, Grimsby, Hamilton, Burlington and across Ontario from Niagara Equipment Supply.",
  alternates: { canonical: "/service-area" },
};

export default async function ServiceAreasPage() {
  const { site } = await getSiteContent();
  return (
    <>
      <PageHero
        title={<>Areas we <span className="text-navy">serve</span></>}
        text="Based on Highway 20 in Thorold, we sell, deliver, demo and service RIPPA equipment across the Niagara Region and Southern Ontario. Pick your area for local delivery details, the jobs we see there and the models that fit."
        crumbs={[{ label: "Areas we serve" }]}
      >
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          <li><IconFeature icon={Truck} title="Delivered price on every quote" text="Flatbed delivery across Ontario" compact /></li>
          <li><IconFeature icon={Wrench} title="One service centre" text="Warranty claims handled in Thorold" compact /></li>
          <li><IconFeature icon={MapPin} title="Demos in the yard" text="Run the models back to back" compact /></li>
        </ul>
      </PageHero>

      <section className="section">
        <Container>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceAreas.map((a) => (
              <li key={a.slug}>
                <Link href={`/service-area/${a.slug}`} className="group flex h-full flex-col rounded-card border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-electric hover:shadow-lift">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-navy">{a.distanceKm === 0 ? "Home base" : `${a.distanceKm} km from Thorold`}</p>
                  <h2 className="display mt-1 text-2xl text-charcoal">{a.name}</h2>
                  <p className="mt-1 text-[13px] text-grey">{a.region}</p>
                  <p className="mt-3 text-sm text-charcoal/85">{a.jobs.slice(0, 3).map((j) => j.title).join(" · ")}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[13px] font-semibold text-navy group-hover:text-electric">Local details <ArrowRight className="size-3.5" aria-hidden /></span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-4 rounded-card border border-line bg-light/60 p-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-navy">Not on the list?</p>
              <p className="mt-1 text-sm text-charcoal/85">We deliver anywhere in Ontario and ship parts across Canada. Ask for a delivered price to your town and we will quote it in writing.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button href="/contact" arrow>Request a quote</Button>
              <Button href={site.phoneHref} variant="secondary">Call {site.phone}</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
