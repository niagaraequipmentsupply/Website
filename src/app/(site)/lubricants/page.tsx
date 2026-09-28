import type { Metadata } from "next";
import { Droplets, Truck, FlaskConical, Warehouse, Tractor, Building2, Store, Wrench, Check, Phone, Leaf } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LeadForm } from "@/components/quote/LeadForm";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { getSiteContent } from "@/lib/catalogue";
import { lubricantCategories } from "@/collections/Lubricants";

export const metadata: Metadata = {
  title: "Chevron Oil & Lubricants Dealer in Niagara",
  description: "Chevron Delo and Catalys engine oil, hydraulic fluid, gear oil, grease, coolant and DEF in Thorold, with bulk programs for farms, shops and fleets across Ontario.",
  alternates: { canonical: "/lubricants" },
};

const packLabels: Record<string, string> = { "1l": "1 L", "4l": "4 L", "20l": "20 L pail", drum: "205 L drum", tote: "1,000 L tote", bulk: "Bulk", cartridge: "Cartridge" };

const segments = [
  { icon: Tractor, title: "Farms", text: "Tractors, combines, loaders and irrigation. Seasonal pre-buy, drums and totes delivered before planting and harvest, oil analysis to stretch intervals safely." },
  { icon: Wrench, title: "Repair shops & garages", text: "Shop pricing on Delo, hydraulic and gear oils in pails and drums, plus the Kubota and RIPPA parts your customers ask for." },
  { icon: Truck, title: "Fleets & contractors", text: "One supplier for engine oil, hydraulic fluid, grease, DEF and coolant across mixed fleets, with usage reporting and scheduled deliveries." },
  { icon: Building2, title: "Municipal & industrial", text: "Consolidated quarterly ordering, spec sheets and SDS on file, and a local contact who answers the phone." },
];

const programSteps = [
  { title: "Site walk & oil audit", text: "We list what you run, what you're using now and what each OEM actually calls for. Most sites are carrying two or three products they don't need." },
  { title: "Consolidated product list", text: "A short list of Chevron and Catalys products that covers the whole fleet, with grades, approvals and pack sizes." },
  { title: "Pricing & delivery schedule", text: "Volume pricing on pails, drums and totes, standing orders, and delivery from Thorold on a cadence that suits you." },
  { title: "Analysis & support", text: "Optional oil analysis so you change fluids on condition, not guesswork. Parts sourcing for the same fleet on request." },
];

export default async function LubricantsPage() {
  const { lubricants, site } = await getSiteContent();
  const cats = lubricantCategories.filter((c) => lubricants.some((l) => l.category === c.value));
  return (
    <>
      <PageHero
        title={<>Oil &amp; <span className="text-navy">Lubricants</span></>}
        text="Niagara Equipment Supply is a Catalys Lubricants dealer, bringing Chevron, Catalys and BioBlend engine oils, hydraulic fluids, gear oils, greases, coolants and DEF to Niagara. Buy over the counter, or set up a supply program for your farm, shop or fleet."
        crumbs={[{ href: "/service", label: "Parts & Service" }, { label: "Oil & Lubricants" }]}
        aside={
          <ul className="grid gap-3">
            {[{ icon: Store, t: "Over the counter", s: `Pick up in ${site.address.city}` }, { icon: Warehouse, t: "Pails, drums & totes", s: "Delivered across Ontario" }, { icon: FlaskConical, t: "Oil analysis", s: "Change on condition, not guesswork" }].map((i) => (
              <li key={i.t} className="flex items-center gap-3 rounded-card border border-line bg-white px-4 py-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-tint text-navy"><i.icon className="size-5" aria-hidden /></span><span><span className="block font-bold text-charcoal">{i.t}</span><span className="block text-sm text-grey">{i.s}</span></span></li>
            ))}
          </ul>
        }
      >
        <div className="flex flex-wrap gap-3"><Button href="#program" size="lg" arrow>Set Up a Supply Program</Button><Button href="#products" size="lg" variant="secondary">Browse Products</Button></div>
      </PageHero>

      <section id="program" className="section scroll-mt-28">
        <Container>
          <SectionHeading eyebrow="B2B lubricant programs" title="One supplier for every machine you run" subtitle="Our main focus is business accounts: farmers, local repair shops, landscapers, contractors and fleets who want the right oil in the right pack size, delivered, at volume pricing." rule={false} />
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {segments.map((s) => <li key={s.title} className="rounded-card border border-line bg-white p-5"><span className="flex size-11 items-center justify-center rounded-md bg-tint text-navy"><s.icon className="size-6" aria-hidden /></span><h3 className="mt-3 text-base font-bold text-charcoal">{s.title}</h3><p className="mt-1 text-sm text-grey">{s.text}</p></li>)}
          </ul>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <ol className="grid gap-3">
              {programSteps.map((s, i) => <li key={s.title} className="flex gap-4 rounded-card border border-line bg-white p-4"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">{i + 1}</span><div><h3 className="font-bold text-charcoal">{s.title}</h3><p className="mt-1 text-sm text-grey">{s.text}</p></div></li>)}
            </ol>
            <LeadForm source="lubricants" title="Request program pricing" submitLabel="Request Lubricant Pricing" messageLabel="What do you run, roughly how much oil per year, and current supplier (if any)?" />
          </div>
        </Container>
      </section>

      <section id="products" className="section-tight scroll-mt-28 bg-light/60">
        <Container>
          <SectionHeading title="Products we stock" subtitle="Chevron Delo, Chevron hydraulic and gear oils, Catalys engine and hydraulic oils, BioBlend biodegradables, coolant and DEF. Ask for anything from the Catalys catalogue; we can bring in the full range." rule={false} link={{ href: "https://www.catalyslubricants.ca/en/products", label: "Full Catalys catalogue" }} />
          {lubricants.length === 0 ? (
            <p className="rounded-card border border-dashed border-line bg-white p-8 text-center text-grey">Product list is being loaded. Call {site.phone} for availability today.</p>
          ) : cats.map((c) => (
            <div key={c.value} id={c.value} className="mb-8 scroll-mt-28">
              <h3 className="display mb-3 text-2xl text-charcoal">{c.label}</h3>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {lubricants.filter((l) => l.category === c.value).map((l) => (
                  <li key={l.id} className="flex flex-col rounded-card border border-line bg-white p-4">
                    <div className="flex items-start gap-3">
                      <EquipmentImage image={l.images[0]} kind="generic" alt={l.name} className="w-16 shrink-0" ratio="aspect-square" sizes="64px" compact />
                      <div className="min-w-0"><p className="text-[11px] font-bold uppercase tracking-[0.15em] text-grey">{l.brand}</p><h4 className="font-bold text-charcoal">{l.name}</h4>{l.grades && <p className="text-[13px] text-navy">{l.grades}</p>}</div>
                    </div>
                    {l.tagline && <p className="mt-2 text-sm font-semibold text-charcoal">{l.tagline}</p>}
                    <p className="mt-1 text-[13px] text-grey">{l.description}</p>
                    {l.rippaUse && <p className="mt-2 text-[12px] text-grey"><span className="font-semibold text-charcoal">On RIPPA machines:</span> {l.rippaUse}</p>}
                    {l.approvals && <p className="mt-1 text-[12px] text-grey">{l.approvals}</p>}
                    <div className="mt-3 flex flex-wrap gap-1.5">{l.packaging.map((p) => <Badge key={p} tone="grey">{packLabels[p] ?? p}</Badge>)}{l.brand === "BioBlend" && <Badge tone="success"><Leaf className="mr-1 size-3" aria-hidden />Biodegradable</Badge>}</div>
                    {l.documents.length > 0 && <a href={l.documents[0].url} target="_blank" rel="noopener" className="mt-3 text-[13px] font-semibold text-navy hover:text-electric">Product data sheet →</a>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Container>
      </section>

      <section className="section-tight">
        <Container className="grid gap-8 lg:grid-cols-[2fr_3fr]">
          <div>
            <SectionHeading title="Buying over the counter?" rule={false} />
            <p className="text-[15px] text-charcoal/85">Walk in and pick up jugs, pails and grease for your RIPPA, tractor, truck or skid steer. Bring your model and serial number and we&apos;ll match the right grade. We also stock the filters that go with the oil change.</p>
            <ul className="mt-4 space-y-2 text-sm text-charcoal">{["Kubota-approved engine oils for D722, D902, D1105, V1505 and V2607 engines", "ISO 46 / 68 hydraulic oil and low-temperature hydraulic fluids for Ontario winters", "Multi-purpose and extreme-pressure greases in cartridges", "Coolant, DEF and windshield washer fluid"].map((t) => <li key={t} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />{t}</li>)}</ul>
            <div className="mt-5 flex flex-wrap gap-3"><Button href="/contact#hours" variant="secondary" size="sm">Store hours &amp; map</Button><Button href={site.phoneHref} size="sm" icon={<Phone className="size-4" aria-hidden />}>Check stock: {site.phone}</Button></div>
          </div>
          <div className="rounded-card border border-line bg-white p-6">
            <div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-md bg-tint text-navy"><Droplets className="size-6" aria-hidden /></span><div><p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-navy">Why Catalys</p><h3 className="font-bold text-charcoal">Canadian distributor, Chevron products, local delivery</h3></div></div>
            <p className="mt-3 text-sm text-grey">Catalys Lubricants is a Canadian, family-owned distributor and manufacturer (part of the Crevier Group, founded 1945) and the official Canadian distributor of Chevron lubricants, with an Ontario warehouse in London. Through them we can supply the full Chevron, Catalys, BioBlend and Nemco catalogue, oil-analysis programs and bulk tank monitoring for larger accounts.</p>
            <ul className="mt-3 grid gap-1.5 text-sm text-charcoal sm:grid-cols-2">{["Chevron Delo heavy-duty engine oils", "Chevron 1000 THF tractor hydraulic fluid", "Catalys Optimum & Premium Plus engine oils", "Catalys Extreme XV hydraulic oil", "BioBlend biodegradable hydraulic & bar oils", "Greases, coolant, DEF and washer fluid"].map((t) => <li key={t} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />{t}</li>)}</ul>
          </div>
        </Container>
      </section>
    </>
  );
}
