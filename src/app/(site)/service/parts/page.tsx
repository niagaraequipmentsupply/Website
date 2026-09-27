import type { Metadata } from "next";
import { Package, Globe, Truck, Check, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LeadForm } from "@/components/quote/LeadForm";
import { getSiteContent } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "RIPPA Parts Canada | Filters, Tracks, Hydraulics Shipped Nationwide",
  description: "Order genuine RIPPA mini excavator and skid steer parts from Niagara Equipment Supply. Filters, rubber tracks, hoses, couplers, teeth and more, shipped across Canada. Sourcing help for US owners.",
  alternates: { canonical: "/service/parts" },
};

const faqs = [
  { q: "How do I find my model and serial number?", a: "The data plate is on the frame near the operator station on excavators and inside the cab door or on the rear frame on skid steers. Send a photo of the plate and we'll identify the machine." },
  { q: "How fast do parts ship?", a: "Stocked filters, service kits, teeth, hoses and couplers usually ship same or next business day from Thorold. Parts ordered from RIPPA typically take longer; we quote lead time before you commit." },
  { q: "Do you ship outside Ontario?", a: "Yes, anywhere in Canada with tracking. For US owners we quote parts plus cross-border shipping, or tell you if a US source will be faster." },
  { q: "I didn't buy from you. Can I still order?", a: "Yes. Any RIPPA owner can order parts and book service with us." },
  { q: "Can you source parts for other brands in my fleet?", a: "For shops, farms and fleet accounts we source common wear parts and filters across brands alongside your lubricant program. Ask us." },
];

export default async function PartsPage({ searchParams }: { searchParams: Promise<{ model?: string; sku?: string }> }) {
  const { model, sku } = await searchParams;
  const { site, catalogue } = await getSiteContent();
  const machine = model ? catalogue.machines.find((m) => m.slug === model) : undefined;
  return (
    <>
      <PageHero title={<>RIPPA <span className="text-navy">Parts</span></>} text="Genuine RIPPA parts and Kubota engine parts, identified by serial number and shipped across Canada. Send us what you need and we reply with price, availability and lead time." crumbs={[{ href: "/service", label: "Parts & Service" }, { label: "Parts" }]}
        aside={<ul className="grid gap-3">{[{ icon: Package, t: "Stocked in Thorold", s: "Filters, tracks, teeth, hoses, couplers" }, { icon: Truck, t: "Canada-wide shipping", s: "Tracked, same or next day on stock" }, { icon: Globe, t: "US & international", s: "Sourcing help and cross-border quotes" }].map((i) => <li key={i.t} className="flex items-center gap-3 rounded-card border border-line bg-white px-4 py-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-tint text-navy"><i.icon className="size-5" aria-hidden /></span><span><span className="block font-bold text-charcoal">{i.t}</span><span className="block text-sm text-grey">{i.s}</span></span></li>)}</ul>}>
        <div className="flex flex-wrap gap-3"><Button href="/parts" size="lg" arrow>Browse the Parts Catalogue</Button><Button href="#request" size="lg" variant="secondary">Request a Part</Button><Button href={site.phoneHref} size="lg" variant="secondary" icon={<Phone className="size-4" aria-hidden />}>{site.phone}</Button></div>
      </PageHero>
      <section id="request" className="section scroll-mt-28">
        <Container className="grid gap-8 lg:grid-cols-[2fr_3fr]">
          <div>
            <h2 className="display text-2xl text-charcoal">What to include</h2>
            <ul className="mt-3 space-y-2 text-sm text-charcoal">{["Model and serial number (photo of the data plate is perfect)", "Hour reading", "Part name or a photo of the part / failure", "Quantity and shipping address"].map((t) => <li key={t} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />{t}</li>)}</ul>
            <dl className="mt-6 divide-y divide-line rounded-card border border-line">{faqs.map((f) => <div key={f.q} className="p-4"><dt className="font-bold text-charcoal">{f.q}</dt><dd className="mt-1 text-sm text-grey">{f.a}</dd></div>)}</dl>
          </div>
          <LeadForm source="parts" title="Parts request" submitLabel="Request Parts Quote" messageLabel="Model, serial number, hours, and the parts you need" defaultMessage={`${sku ? `Part number: ${sku}\n` : ""}${machine ? `Model: RIPPA ${machine.modelName}\nSerial #: \nHours: \nParts needed: ` : undefined}`} />
        </Container>
      </section>
    </>
  );
}
