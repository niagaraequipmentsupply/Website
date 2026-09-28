import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Wrench, Droplets, BookOpen } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/home/CtaBand";
import { PartsBrowser } from "@/components/parts/PartsBrowser";
import { getSiteContent, getMachine } from "@/lib/catalogue";
import { partsForMachine, systemLabel } from "@/lib/parts";

type Params = { model: string };

export async function generateStaticParams() {
  const { catalogue, parts } = await getSiteContent();
  const ids = new Set(parts.flatMap((p) => p.compatibleModelIds));
  return catalogue.machines.filter((m) => ids.has(m.id)).map((m) => ({ model: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const m = await getMachine((await params).model);
  if (!m) return {};
  const { parts } = await getSiteContent();
  const n = parts.filter((p) => p.compatibleModelIds.includes(m.id)).length;
  return {
    title: `RIPPA ${m.modelName} Parts (${n} genuine parts)`,
    description: `Genuine RIPPA ${m.modelName} parts: filters, hydraulic cylinders and hoses, undercarriage, electrical, engine and body parts with RIPPA part numbers. Shipped across Canada from Niagara Equipment Supply.`,
    alternates: { canonical: `/parts/${m.slug}` },
  };
}

export default async function ModelPartsPage({ params }: { params: Promise<Params> }) {
  const m = await getMachine((await params).model);
  if (!m) notFound();
  const { parts, site } = await getSiteContent();
  const groups = partsForMachine(parts, m.id);
  const list = groups.flatMap(([, items]) => items);
  if (list.length === 0) notFound();
  return (
    <>
      <PageHero
        title={<>{m.modelName} <span className="text-navy">Parts</span></>}
        text={`${list.length} genuine RIPPA parts listed for the ${m.brand} ${m.modelName}, sorted by system. Search by name or part number, then request a quote; we confirm fitment against your serial number before anything ships.`}
        crumbs={[{ href: "/service", label: "RIPPA Service Centre" }, { href: "/parts", label: "Parts Catalogue" }, { label: m.modelName }]}
        aside={<EquipmentImage image={m.images[0]} kind={m.category} alt={`${m.brand} ${m.modelName}`} ratio="aspect-[4/3]" className="bg-white" />}
      >
        <div className="flex flex-wrap gap-3"><Button href={`/service/parts?model=${m.slug}`} size="lg" arrow>Request a Part</Button><Button href={`/inventory/${m.category}/${m.slug}`} size="lg" variant="secondary">{m.modelName} machine page</Button></div>
        <nav aria-label="Systems" className="mt-5 flex flex-wrap gap-1.5">
          {groups.map(([s, items]) => <a key={s} href={`#parts-${s}`} className="rounded-full border border-line bg-white px-3 py-1 text-[12px] font-semibold text-charcoal hover:border-electric hover:text-navy">{systemLabel(s)} <span className="text-grey">{items.length}</span></a>)}
        </nav>
      </PageHero>

      <section className="section">
        <Container>
          <PartsBrowser parts={list} modelName={m.modelName} modelSlug={m.slug} />
        </Container>
      </section>

      <section className="section-tight bg-light/60">
        <Container>
          <SectionHeading title={`Keep the ${m.modelName} running`} rule={false} />
          <ul className="grid gap-4 md:grid-cols-3">
            {[{ icon: Wrench, t: "Service & warranty", s: `Certified RIPPA technicians in ${site.address.city} and on site. Claims filed for you.`, href: `/service?model=${m.slug}#hub`, cta: "Service Centre" }, { icon: Droplets, t: "Oils & filters", s: "Chevron and Catalys oils matched to the engine and hydraulics, with the filters above.", href: "/lubricants", cta: "Oil & lubricants" }, { icon: BookOpen, t: "Guides & videos", s: `Service intervals, track tension, coupler o-rings and more for the ${m.modelName}.`, href: `/blog?model=${m.slug}`, cta: "Read the guides" }].map((i) => (
              <li key={i.t}><Link href={i.href} className="flex h-full flex-col rounded-card border border-line bg-white p-5 hover:border-electric"><span className="flex size-10 items-center justify-center rounded-md bg-tint text-navy"><i.icon className="size-5" aria-hidden /></span><h3 className="mt-3 font-bold text-charcoal">{i.t}</h3><p className="mt-1 text-sm text-grey">{i.s}</p><span className="mt-auto pt-3 text-sm font-semibold text-navy">{i.cta} →</span></Link></li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaBand eyebrow="RIPPA Service Centre" title={`Need a ${m.modelName} part that isn't listed?`} text="Send the part number from your parts book, or a photo of the part and your serial number. We quote it with shipping and order direct from RIPPA." primary={{ href: `/service/parts?model=${m.slug}`, label: "Ask the Parts Desk" }} />
    </>
  );
}
