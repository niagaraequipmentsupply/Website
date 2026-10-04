import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Truck, Wrench, Phone, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/equipment/ProductCard";
import { LeadForm } from "@/components/quote/LeadForm";
import { ServiceCentreStrip } from "@/components/service/ServiceCentre";
import { getSiteContent } from "@/lib/catalogue";
import { serviceAreas, serviceAreaBySlug } from "@/data/service-areas";
import { metaDescription } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const area = serviceAreaBySlug(slug);
  if (!area) return {};
  return { title: `RIPPA Dealer for ${area.name}`, description: metaDescription(area.metaDescription), alternates: { canonical: `/service-area/${area.slug}` } };
}

export default async function ServiceAreaPage({ params }: { params: Params }) {
  const { slug } = await params;
  const area = serviceAreaBySlug(slug);
  if (!area) notFound();
  const { catalogue, site } = await getSiteContent();
  const models = area.popularModels.map((s) => catalogue.machines.find((m) => m.slug === s)).filter((m): m is NonNullable<typeof m> => !!m);
  const others = serviceAreas.filter((a) => a.slug !== area.slug);

  const schema = [
    { "@context": "https://schema.org", "@type": "Service", name: `RIPPA equipment sales, delivery and service in ${area.name}`, serviceType: "Compact construction equipment dealer", provider: { "@type": "LocalBusiness", name: site.name, telephone: site.phone, url: site.url }, areaServed: { "@type": "City", name: area.name, containedInPlace: { "@type": "AdministrativeArea", name: "Ontario" } }, url: `${site.url}/service-area/${area.slug}` },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: area.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: site.url }, { "@type": "ListItem", position: 2, name: "Areas we serve", item: `${site.url}/service-area` }, { "@type": "ListItem", position: 3, name: area.name, item: `${site.url}/service-area/${area.slug}` }] },
  ];

  return (
    <>
      <PageHero
        title={<>{area.headline.replace(/^RIPPA /, "RIPPA ")}</>}
        text={`${area.region}. ${area.distanceKm === 0 ? "" : `Delivery and demos ${area.drive} from our Thorold yard.`}`}
        crumbs={[{ href: "/service-area", label: "Areas we serve" }, { label: area.name }]}
        aside={
          <div className="rounded-card border border-line bg-white p-5 shadow-card">
            <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-navy"><MapPin className="size-4" aria-hidden />{area.name}</p>
            <ul className="mt-3 space-y-2 text-sm text-charcoal/85">
              <li className="flex gap-2"><Truck className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />{area.distanceKm === 0 ? "Pickup at the yard or local delivery the same week on stocked units." : `Flatbed delivery from Thorold, ${area.drive}. Delivered price on every quote.`}</li>
              <li className="flex gap-2"><Wrench className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />RIPPA Service Centre and warranty claims handled in-house.</li>
            </ul>
            <div className="mt-4 grid gap-2">
              <Button href="#quote" arrow>Request a quote</Button>
              <Button href={site.phoneHref} variant="secondary" icon={<Phone className="size-4" aria-hidden />}>Call {site.phone}</Button>
            </div>
          </div>
        }
      />

      <section className="section">
        <Container className="grid gap-10 lg:grid-cols-[3fr_2fr]">
          <div>
            {area.intro.map((p) => <p key={p.slice(0, 40)} className="mb-4 text-[16px] leading-relaxed text-charcoal/85">{p}</p>)}
            <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.18em] text-grey">Where we work in {area.name}</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {area.neighbourhoods.map((n) => <li key={n} className="chamfer inline-flex h-8 items-center border-2 border-charcoal/70 bg-white px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal">{n}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="accent-bar display text-2xl text-charcoal">Jobs we see most in {area.name}</h2>
            <ul className="mt-5 divide-y divide-line rounded-card border border-line bg-white">
              {area.jobs.map((j) => (
                <li key={j.title} className="p-4">
                  <p className="font-bold text-charcoal">{j.title}</p>
                  <p className="mt-0.5 text-sm text-grey">{j.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {models.length > 0 && (
        <section className="section-tight bg-light/60">
          <Container>
            <SectionHeading eyebrow="Popular choices" title={`RIPPA models ${area.name} customers buy`} subtitle="Based on the work above. Every one is sold, set up and serviced from Thorold." link={{ href: "/inventory", label: "All equipment" }} />
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {models.map((m) => <li key={m.id}><ProductCard machine={m} /></li>)}
            </ul>
          </Container>
        </section>
      )}

      <ServiceCentreStrip phone={site.phone} phoneHref={site.phoneHref} />

      <section className="section-tight">
        <Container className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 className="display text-charcoal">{area.name} FAQ</h2>
            <p className="mt-2 text-sm text-grey">Delivery, access and service questions we hear from {area.name}. Anything else, call <a href={site.phoneHref} className="font-semibold text-navy">{site.phone}</a>.</p>
          </div>
          <dl className="divide-y divide-line rounded-card border border-line bg-white">
            {area.faqs.map((f) => (
              <div key={f.question} className="p-4">
                <dt className="font-bold text-charcoal">{f.question}</dt>
                <dd className="mt-1 text-sm text-grey">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section id="quote" className="section scroll-mt-32 bg-light/60">
        <Container className="grid gap-8 lg:grid-cols-[2fr_3fr]">
          <div>
            <h2 className="display text-charcoal">Get a delivered quote for {area.name}</h2>
            <p className="mt-2 text-sm text-charcoal/85">Tell us the jobs and the access. We reply within one business day with a model recommendation, attachments, delivery to {area.name} and financing options, all in writing.</p>
            <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.18em] text-grey">Other areas we serve</p>
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
              {others.map((a) => <li key={a.slug}><Link href={`/service-area/${a.slug}`} className="font-semibold text-navy hover:text-electric">{a.name}</Link></li>)}
              <li><Link href="/service-area" className="inline-flex items-center gap-1 font-semibold text-charcoal hover:text-navy">All areas <ArrowRight className="size-3.5" aria-hidden /></Link></li>
            </ul>
          </div>
          <LeadForm source="contact" title={`Quote request: ${area.name}`} submitLabel="Request a Quote" messageLabel="Jobs, access and what you tow with" defaultMessage={`I'm in ${area.name} and looking at a RIPPA for: `} />
        </Container>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </>
  );
}
