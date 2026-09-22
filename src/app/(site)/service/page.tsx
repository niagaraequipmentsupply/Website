import type { Metadata } from "next";
import Link from "next/link";
import { Wrench, Cog, ShieldCheck, Truck, MapPin, Package, Globe, Check, ClipboardCheck, Snowflake, Droplets, Video } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { LeadForm } from "@/components/quote/LeadForm";
import { PostCard } from "@/components/content/PostCard";
import { ContentRequest } from "@/components/content/ContentRequest";
import { SocialStrip } from "@/components/content/SocialStrip";
import { getSiteContent } from "@/lib/catalogue";
import { ServiceHub } from "@/components/content/ServiceHub";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "RIPPA Service, Repairs & Parts in Niagara | Certified Technicians",
  description: "Certified RIPPA technicians in St. Catharines. Maintenance, repairs and field service for RIPPA mini excavators and skid steers, any owner welcome. Genuine RIPPA parts shipped across Canada, sourcing help for US customers.",
  alternates: { canonical: "/service" },
};

const services = [
  { icon: ClipboardCheck, title: "Dealer PDI & setup", text: "Every machine we sell is inspected, fluids checked, relief pressures verified, controls set to your pattern and attachments fitted before delivery." },
  { icon: Wrench, title: "Scheduled maintenance", text: "25-hour first service, 250 / 500 / 1,000-hour services with genuine filters and the right Chevron oils. We record it for your warranty file." },
  { icon: Cog, title: "Diagnostics & repairs", text: "Hydraulic leaks, pump and valve issues, electrical faults, track and undercarriage, engine work on Kubota, Yanmar and Briggs & Stratton." },
  { icon: MapPin, title: "Field service", text: "Mobile technician for on-site repairs, seasonal services and attachment installs across Niagara. Most field calls end up as a blog post." },
  { icon: Snowflake, title: "Winterization & storage", text: "Cold-weather hydraulic oil, coolant checks, block-heater installs, battery care and spring recommissioning." },
  { icon: ShieldCheck, title: "Warranty & recall work", text: "Authorized warranty repairs and RIPPA recall campaigns (like the RS06 cooling-fan update) handled in our shop." },
];

const parts = [
  { title: "Filters & service kits", text: "Engine, hydraulic, fuel and air filters bundled by model and hour interval." },
  { title: "Undercarriage", text: "Rubber tracks, rollers, idlers, sprockets and track-tension components." },
  { title: "Hydraulics", text: "Hoses, quick couplers, o-rings, cylinders, seals, pumps and valve sections." },
  { title: "Wear parts", text: "Bucket teeth, cutting edges, pins, bushings and dozer blade edges." },
  { title: "Electrical & controls", text: "Switches, sensors, displays, joysticks, pilot lines and safety locks." },
  { title: "Attachments & couplers", text: "Thumbs, buckets, augers and quick-coupler kits sized to your model." },
];

export default async function ServicePage() {
  const { site, posts, catalogue, lubricants } = await getSiteContent();
  const guides = posts.filter((p) => ["guide", "maintenance", "field-call"].includes(p.category)).slice(0, 3);
  return (
    <>
      <PageHero
        title={<>Certified RIPPA <span className="text-navy">Service &amp; Parts</span></>}
        text="We're a service-first dealership. Our technicians are RIPPA-certified and work on RIPPA machines every day, in our St. Catharines shop and on site across Niagara. You don't need to have bought your machine from us: if it's a RIPPA, we'll look after it. Genuine parts ship anywhere in Canada, and we help US owners source what they need."
        crumbs={[{ label: "Parts & Service" }]}
        aside={
          <ul className="grid gap-3">
            {[{ icon: ShieldCheck, t: "Certified RIPPA technicians", s: "Factory-trained on the full lineup" }, { icon: Package, t: "Parts shipped Canada-wide", s: "Most stocked parts leave same or next day" }, { icon: Globe, t: "US customers", s: "We'll help you source parts and support" }].map((i) => (
              <li key={i.t} className="flex items-center gap-3 rounded-card border border-line bg-white px-4 py-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-tint text-navy"><i.icon className="size-5" aria-hidden /></span><span><span className="block font-bold text-charcoal">{i.t}</span><span className="block text-sm text-grey">{i.s}</span></span></li>
            ))}
          </ul>
        }
      >
        <div className="flex flex-wrap gap-3"><Button href="#hub" size="lg" arrow>Find Help for My Machine</Button><Button href="#book" size="lg" variant="secondary">Book Service</Button><Button href="/service/parts" size="lg" variant="secondary">Order Parts</Button></div>
      </PageHero>

      <section id="hub" className="section scroll-mt-28">
        <Container>
          <Suspense><ServiceHub machines={catalogue.machines.filter((m) => m.category === "excavators" || m.category === "skid-steers")} posts={posts} lubricants={lubricants} /></Suspense>
        </Container>
      </section>

      <section className="section-tight bg-light/60">
        <Container>
          <SectionHeading title="What we do" subtitle="In-shop and mobile service for RIPPA excavators, skid steers, loaders, dumpers and backhoes. Other compact brands by arrangement." rule={false} />
          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((s) => <li key={s.title} className="rounded-card border border-line bg-white p-5"><span className="flex size-11 items-center justify-center rounded-md bg-tint text-navy"><s.icon className="size-6" strokeWidth={1.75} aria-hidden /></span><h3 className="mt-3 text-base font-bold text-charcoal">{s.title}</h3><p className="mt-1 text-sm text-grey">{s.text}</p></li>)}
          </ul>
        </Container>
      </section>

      <section id="parts" className="section-tight scroll-mt-28">
        <Container className="grid gap-8 lg:grid-cols-[2fr_3fr]">
          <div>
            <SectionHeading title="Genuine RIPPA parts, shipped across Canada" rule={false} />
            <p className="text-[15px] text-charcoal/85">Send us your model and serial number and we&apos;ll confirm the exact part. Stocked filters, tracks, teeth, hoses and couplers ship from {site.address.city}; everything else is ordered direct from RIPPA with tracking. US owners: we can quote parts and shipping, or point you to the right source if it&apos;s faster.</p>
            <ul className="mt-4 space-y-2 text-sm text-charcoal">{["Filters and service kits for every current model", "Canada-wide shipping, tracked", "Help sourcing parts for US and international owners", "Fleet parts sourcing for shops and contractors running mixed brands"].map((t) => <li key={t} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />{t}</li>)}</ul>
            <div className="mt-5 flex flex-wrap gap-3"><Button href="/service/parts" arrow>Request a part</Button><Button href="/lubricants" variant="secondary" icon={<Droplets className="size-4" aria-hidden />}>Oil &amp; lubricants</Button></div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {parts.map((p) => <li key={p.title} className="rounded-card border border-line bg-white p-4"><h3 className="font-bold text-charcoal">{p.title}</h3><p className="mt-1 text-[13px] text-grey">{p.text}</p></li>)}
          </ul>
        </Container>
      </section>

      <section className="section-tight">
        <Container>
          <SectionHeading title="Fix it yourself, with our help" subtitle="We publish the same procedures our technicians follow. Guides, field-call write-ups and videos, free." rule={false} link={{ href: "/blog", label: "All guides" }} />
          {guides.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{guides.map((p) => <li key={p.id}><PostCard post={p} /></li>)}</ul>
          ) : <p className="rounded-card border border-dashed border-line p-6 text-center text-grey">First guides are on their way. <Link href="/blog" className="font-semibold text-navy">Visit the blog</Link>.</p>}
          <div id="request" className="mt-8 grid scroll-mt-28 gap-6 lg:grid-cols-[3fr_2fr]">
            <ContentRequest compact />
            <div><p className="mb-3 flex items-center gap-2 text-sm font-bold text-charcoal"><Video className="size-4 text-navy" aria-hidden />Follow the shop</p><SocialStrip site={site} compact /></div>
          </div>
        </Container>
      </section>

      <section id="book" className="section scroll-mt-28 bg-light/60">
        <Container className="grid gap-8 lg:grid-cols-[2fr_3fr]">
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.3em] text-navy">Service request</p>
            <h2 className="display text-charcoal">Book service or a field call</h2>
            <p className="mt-3 text-[16px] text-charcoal/85">Tell us the model, hours and what&apos;s going on. We&apos;ll reply with the next available shop slot or a field visit, and a parts list if we can already tell what&apos;s needed.</p>
            <ul className="mt-5 space-y-2 text-sm text-charcoal">{["Any RIPPA owner welcome, not just our customers", "Photos and a short video of the problem speed things up", `Shop in ${site.address.city}, field service across Niagara`, "Pickup and delivery available"].map((t) => <li key={t} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />{t}</li>)}</ul>
            <p className="mt-5 flex items-center gap-2 text-sm text-grey"><Truck className="size-4 text-navy" aria-hidden />Machine down on a job? Call {site.phone} and ask for service.</p>
          </div>
          <LeadForm source="service" title="Service request" submitLabel="Request Service" messageLabel="Model, serial / hours, and what's happening" />
        </Container>
      </section>
    </>
  );
}
