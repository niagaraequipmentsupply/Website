import type { Metadata } from "next";
import Link from "next/link";
import { Package, Truck, Globe, Search } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/home/CtaBand";
import { getSiteContent } from "@/lib/catalogue";
import { isThin } from "@/lib/machines";
import { systemLabel, systemOrder } from "@/lib/parts";

export const metadata: Metadata = {
  title: "Genuine RIPPA Parts Catalogue | Filters, Tracks, Hydraulics by Model",
  description: "Browse genuine RIPPA parts by machine: R06 to R230 excavators, RS03 to RS20 skid steers, RL06 and RB06 loaders. Filters, hydraulic cylinders, undercarriage, electrical, engine parts and more, shipped across Canada from Niagara Equipment Supply.",
  alternates: { canonical: "/parts" },
};

export default async function PartsIndexPage() {
  const { catalogue, categories, parts, site } = await getSiteContent();
  const byMachine = new Map<string, number>();
  for (const p of parts) for (const id of p.compatibleModelIds) byMachine.set(id, (byMachine.get(id) ?? 0) + 1);
  const machines = catalogue.machines.filter((m) => !isThin(m) && (byMachine.get(m.id) ?? 0) > 0);
  const systems = Array.from(new Set(parts.map((p) => p.system))).sort((a, b) => systemOrder.indexOf(a) - systemOrder.indexOf(b));
  return (
    <>
      <PageHero
        title={<>Genuine RIPPA <span className="text-navy">Parts Catalogue</span></>}
        text={`${parts.length.toLocaleString("en-CA")} genuine RIPPA parts, organized by machine and system. Pick your model, find the part number, and request it. Stocked items ship the same or next business day from ${site.address.city}, anywhere in Canada.`}
        crumbs={[{ href: "/service", label: "RIPPA Service Centre" }, { label: "Parts Catalogue" }]}
        aside={
          <ul className="grid gap-3">
            {[{ icon: Search, t: "Search by part number", s: "Every part carries its RIPPA LP number" }, { icon: Package, t: "Genuine RIPPA parts", s: "Matched to your serial number before shipping" }, { icon: Truck, t: "Canada-wide shipping", s: "Tracked, same or next day for stocked items" }, { icon: Globe, t: "US and international owners", s: "We quote parts plus shipping" }].map((i) => (
              <li key={i.t} className="flex items-center gap-3 rounded-card border border-line bg-white px-4 py-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-tint text-navy"><i.icon className="size-5" aria-hidden /></span><span><span className="block font-bold text-charcoal">{i.t}</span><span className="block text-sm text-grey">{i.s}</span></span></li>
            ))}
          </ul>
        }
      >
        <div className="flex flex-wrap gap-3"><Button href="#by-machine" size="lg" arrow>Find Parts for My Machine</Button><Button href="/service/parts" size="lg" variant="secondary">Ask the Parts Desk</Button></div>
      </PageHero>

      <section id="by-machine" className="section scroll-mt-28">
        <Container>
          {categories.map((cat) => {
            const items = machines.filter((m) => m.category === cat.slug);
            if (items.length === 0) return null;
            return (
              <div key={cat.slug} className="mb-10">
                <SectionHeading title={`${cat.name} parts`} rule={false} link={{ href: `/inventory/${cat.slug}`, label: "See the machines" }} />
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {items.map((m) => (
                    <li key={m.id}>
                      <Link href={`/parts/${m.slug}`} className="flex h-full flex-col rounded-card border border-line bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-electric hover:shadow-lift">
                        <EquipmentImage image={m.images[0]} kind={m.category} alt={`${m.brand} ${m.modelName}`} />
                        <h3 className="display mt-3 text-2xl text-charcoal">{m.modelName}</h3>
                        <p className="mt-1 text-sm text-grey">{byMachine.get(m.id)} parts listed</p>
                        <span className="mt-auto pt-3 text-sm font-semibold text-navy">Browse {m.modelName} parts →</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </Container>
      </section>

      <section className="section-tight bg-light/60">
        <Container>
          <SectionHeading title="Browse by system" subtitle="The same systems on every model page. Filters and service kits are the ones most owners need first." rule={false} />
          <ul className="flex flex-wrap gap-2">
            {systems.map((s) => <li key={s}><span className="inline-flex h-10 items-center rounded-full border border-line bg-white px-4 text-sm font-semibold text-charcoal">{systemLabel(s)} <span className="ml-1.5 text-grey">{parts.filter((p) => p.system === s).length}</span></span></li>)}
          </ul>
        </Container>
      </section>

      <CtaBand eyebrow="RIPPA Service Centre" title="Can't find the part number?" text="Send us your model, serial number and a photo. We identify the part, quote it with shipping, and order anything not on the shelf direct from RIPPA." primary={{ href: "/service/parts", label: "Ask the Parts Desk" }} />
    </>
  );
}
