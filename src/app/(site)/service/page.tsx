import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Wrench, Cog, ShieldCheck, Truck, MapPin, Package, Globe, Check, ClipboardCheck, Snowflake, Droplets, Video, Phone, Sprout, Trees, HardHat, Home, Tractor, GraduationCap } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { LeadForm } from "@/components/quote/LeadForm";
import { PostCard } from "@/components/content/PostCard";
import { ContentRequest } from "@/components/content/ContentRequest";
import { SocialStrip } from "@/components/content/SocialStrip";
import { ServiceHub } from "@/components/content/ServiceHub";
import { SERVICE_CENTRE, PILLARS } from "@/components/service/ServiceCentre";
import { getSiteContent } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "RIPPA Service Centre in Thorold, Ontario",
  description: "Certified RIPPA technicians in Thorold, Ontario. Warranty claims handled for you, in-shop and field repairs, genuine parts across Canada. Every RIPPA owner welcome.",
  alternates: { canonical: "/service" },
  keywords: ["RIPPA service", "RIPPA warranty", "RIPPA repair Ontario", "RIPPA parts Canada", "RIPPA dealer service Niagara", "mini excavator service Thorold"],
};

const owners = [
  { icon: Home, title: "First machine", text: "Never owned an excavator or skid steer? Your delivery includes a hands-on walk-through, and we check in at your first service so nothing gets missed." },
  { icon: Sprout, title: "Homesteads & acreages", text: "Seasonal service plans, winter storage prep, and guides for the jobs you'll do once a year and want to get right." },
  { icon: Tractor, title: "Farms", text: "Fast parts, field service at the farm, and oil and filter programs so downtime never lands in the middle of a season." },
  { icon: Trees, title: "Landscaping companies", text: "Priority scheduling in spring, loaner attachments when yours is in for repair, and maintenance records for every machine in the fleet." },
  { icon: HardHat, title: "Construction", text: "Same-week diagnostics, hydraulic and undercarriage repairs done right the first time, and documented service for resale value." },
  { icon: Wrench, title: "Hobbyists & weekend operators", text: "Honest advice on what to fix yourself and what to bring in, plus every video and guide we publish, free." },
];

const commitments = [
  { title: "Any RIPPA owner, any dealer", text: "Bought your machine elsewhere, online or used? You get the same technicians, the same parts access and the same warranty support as our own customers." },
  { title: "Warranty without the runaround", text: "We diagnose, document and file the claim with RIPPA, order the parts and complete the repair. You make one call." },
  { title: "Factory-trained, RIPPA every day", text: "Our technicians are certified on the full RIPPA lineup and work on these machines daily. That is why we find things faster." },
  { title: "Genuine parts, straight answers", text: "Genuine RIPPA and OEM engine parts matched to your serial number. Stocked items ship the same or next business day, anywhere in Canada." },
  { title: "Records you can sell on", text: "Every service is logged against your serial number. When you upgrade, the next buyer sees a documented machine." },
  { title: "We teach what we know", text: "The procedures our technicians follow become guides and videos. If you would rather do it yourself, we help you do it right." },
];

const services = [
  { icon: ClipboardCheck, title: "Delivery inspection & owner start-up", text: "Every machine we deliver is inspected, fluids checked, relief pressures verified, controls set to your pattern and attachments fitted. Then we walk you through it." },
  { icon: Wrench, title: "Scheduled maintenance", text: "25-hour first service, then 250 / 500 / 1,000-hour services with genuine filters and the right Chevron oils, logged for your warranty file." },
  { icon: Cog, title: "Diagnostics & repairs", text: "Hydraulic leaks, pump and valve issues, electrical faults, track and undercarriage, engine work on Kubota, Yanmar and Briggs & Stratton." },
  { icon: MapPin, title: "Field service", text: "Mobile technician for on-site repairs, seasonal services and attachment installs across Niagara and the Golden Horseshoe." },
  { icon: Snowflake, title: "Winterization & storage", text: "Cold-weather hydraulic oil, coolant checks, block-heater installs, battery care and spring recommissioning." },
  { icon: ShieldCheck, title: "Warranty & recall work", text: "Authorized warranty repairs and RIPPA recall campaigns, such as the RS06 cooling-fan update, completed in our shop." },
];

const warrantySteps = [
  { n: "1", title: "Tell us what happened", text: "Model, serial number, hours and a photo or short video. Call, use the form below, or stop in." },
  { n: "2", title: "We diagnose and document", text: "In the shop or on site. We confirm the cause and whether it falls under RIPPA warranty." },
  { n: "3", title: "We file the claim", text: "Our technicians prepare and submit the claim to RIPPA and order the parts. No paperwork on your side." },
  { n: "4", title: "We fix it and log it", text: "Repair completed with genuine parts, recorded against your serial number, machine returned ready to work." },
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
        title={<><span className="block text-[12px] font-bold uppercase tracking-[0.3em] text-navy sm:text-sm">Niagara Equipment Supply</span>{SERVICE_CENTRE.name}</>}
        text={`${SERVICE_CENTRE.tagline} ${SERVICE_CENTRE.promise}`}
        crumbs={[{ label: SERVICE_CENTRE.name }]}
        aside={
          <ul className="grid gap-3">
            {PILLARS.map((p) => (
              <li key={p.title}><Link href={p.href} className="flex items-center gap-3 rounded-card border border-line bg-white px-4 py-3 hover:border-electric"><span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-tint text-navy"><p.icon className="size-5" aria-hidden /></span><span><span className="block font-bold text-charcoal">{p.title}</span><span className="block text-sm text-grey">{p.text}</span></span></Link></li>
            ))}
          </ul>
        }
      >
        <div className="flex flex-wrap gap-3"><Button href="#book" size="lg" arrow>Book Service or a Warranty Claim</Button><Button href="#hub" size="lg" variant="secondary">Find Help for My Machine</Button><Button href="/service/parts" size="lg" variant="secondary">Order Parts</Button></div>
        <p className="mt-4 flex items-center gap-2 text-sm text-grey"><Phone className="size-4 text-navy" aria-hidden />Machine down? Call <a href={site.phoneHref} className="font-semibold text-navy">{site.phone}</a> and ask for the Service Centre.</p>
      </PageHero>

      <section className="section-tight border-b border-line">
        <Container>
          <SectionHeading eyebrow="Our commitment" title="The best in the business at RIPPA. That is the whole job." subtitle="Most dealers sell machines and have a shop out back. We built the Service Centre first, because the machine is only as good as the support behind it." rule={false} />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {commitments.map((c, i) => (
              <li key={c.title} className="rounded-card border border-line bg-white p-5">
                <span className="display text-3xl text-navy/30">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-base font-bold text-charcoal">{c.title}</h3>
                <p className="mt-1 text-sm text-grey">{c.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="section-tight relative overflow-hidden bg-light/60">
        <div aria-hidden className="absolute inset-0 bg-[url('/images/bg/farm-field.jpg')] bg-cover bg-[position:center_35%]" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/88 to-white" />
        <Container className="relative">
          <SectionHeading title="Support built around how you work" subtitle="A first machine on an acreage and a fleet on a job site need different things from a dealer. We set the Service Centre up for both." rule={false} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {owners.map((o) => <li key={o.title} className="flex gap-4 rounded-card border border-line bg-white p-5"><span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-tint text-navy"><o.icon className="size-6" strokeWidth={1.75} aria-hidden /></span><div><h3 className="text-base font-bold text-charcoal">{o.title}</h3><p className="mt-1 text-sm text-grey">{o.text}</p></div></li>)}
          </ul>
        </Container>
      </section>

      <section id="warranty" className="section scroll-mt-28 border-b border-line">
        <Container className="grid gap-8 lg:grid-cols-[2fr_3fr]">
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.3em] text-navy">RIPPA warranty</p>
            <h2 className="display text-charcoal">Warranty claims, handled start to finish</h2>
            <p className="mt-3 text-[16px] text-charcoal/85">A warranty is only as good as the dealer who stands behind it. As an authorized RIPPA Service Centre we diagnose the fault, file the claim, source the parts and complete the repair. You never chase a manufacturer, and you never pay for a covered repair.</p>
            <ul className="mt-5 space-y-2 text-sm text-charcoal">{["Covers RIPPA machines sold by any dealer, including online purchases", "Claim preparation and RIPPA correspondence done by our technicians", "Genuine parts, repairs logged against your serial number", "Extended coverage and protection plans available on new machines"].map((t) => <li key={t} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />{t}</li>)}</ul>
            <div className="mt-5 flex flex-wrap gap-3"><Button href="#book" arrow>Start a warranty claim</Button><Button href={site.phoneHref} variant="secondary" icon={<Phone className="size-4" aria-hidden />}>Call {site.phone}</Button></div>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {warrantySteps.map((s) => <li key={s.n} className="rounded-card border border-line bg-white p-5"><span className="flex size-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">{s.n}</span><h3 className="mt-3 font-bold text-charcoal">{s.title}</h3><p className="mt-1 text-sm text-grey">{s.text}</p></li>)}
          </ol>
        </Container>
      </section>

      <section id="hub" className="section scroll-mt-28">
        <Container>
          <SectionHeading eyebrow="Owner support" title="Find help for your machine" subtitle="Guides, videos, service intervals, parts and oils, sorted by model. Pick your machine to start." rule={false} />
          <Suspense><ServiceHub machines={catalogue.machines.filter((m) => m.category === "excavators" || m.category === "skid-steers")} posts={posts} lubricants={lubricants} /></Suspense>
        </Container>
      </section>

      <section className="section-tight bg-light/60">
        <Container>
          <SectionHeading title="What the Service Centre does" subtitle="In-shop and mobile service for RIPPA excavators, skid steers, loaders, backhoe loaders and track dumpers. Other compact brands by arrangement." rule={false} />
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

      <section id="learn" className="section-tight scroll-mt-28 bg-light/60">
        <Container>
          <SectionHeading eyebrow="Owner training" title="Learn it from the people who fix it" subtitle="Delivery walk-throughs, a first-service check-in, and the same procedures our technicians follow published as free guides and videos." rule={false} link={{ href: "/blog", label: "All guides" }} />
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            {[{ icon: GraduationCap, t: "Delivery walk-through", s: "Controls, daily checks, greasing points, attachment changes and trailering, on your machine, before we leave." }, { icon: ClipboardCheck, t: "First-service check-in", s: "At 25 hours we service the machine and go over anything you have run into since delivery." }, { icon: Video, t: "Guides & videos by model", s: "Filter changes, track tension, coupler o-rings, cold starts. Sorted by your model in the hub above." }].map((i) => (
              <div key={i.t} className="flex gap-3 rounded-card border border-line bg-white p-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-tint text-navy"><i.icon className="size-5" aria-hidden /></span><div><p className="font-bold text-charcoal">{i.t}</p><p className="mt-1 text-sm text-grey">{i.s}</p></div></div>
            ))}
          </div>
          {guides.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{guides.map((p) => <li key={p.id}><PostCard post={p} /></li>)}</ul>
          ) : <p className="rounded-card border border-dashed border-line p-6 text-center text-grey">First guides are on their way. <Link href="/blog" className="font-semibold text-navy">Visit the blog</Link>.</p>}
          <div id="request" className="mt-8 grid scroll-mt-28 gap-6 lg:grid-cols-[3fr_2fr]">
            <ContentRequest compact />
            <div><p className="mb-3 flex items-center gap-2 text-sm font-bold text-charcoal"><Video className="size-4 text-navy" aria-hidden />Follow the Service Centre</p><SocialStrip site={site} compact /></div>
          </div>
        </Container>
      </section>

      <section id="book" className="section scroll-mt-28">
        <Container className="grid gap-8 lg:grid-cols-[2fr_3fr]">
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.3em] text-navy">Service request</p>
            <h2 className="display text-charcoal">Book service, a field call or a warranty claim</h2>
            <p className="mt-3 text-[16px] text-charcoal/85">Tell us the model, serial number, hours and what&apos;s going on. We reply with the next shop slot or a field visit, whether it looks like a warranty item, and a parts list if we can already tell what&apos;s needed.</p>
            <ul className="mt-5 space-y-2 text-sm text-charcoal">{["Any RIPPA owner welcome, not just our customers", "Photos and a short video of the problem speed things up", `Service Centre at ${site.address.street}, ${site.address.city}; field service across Niagara`, "Pickup and delivery available", "Certified RIPPA technicians", "Parts shipped Canada-wide, US sourcing help"].map((t) => <li key={t} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />{t}</li>)}</ul>
            <p className="mt-5 flex items-center gap-2 text-sm text-grey"><Truck className="size-4 text-navy" aria-hidden />Machine down on a job? Call {site.phone} and ask for the Service Centre.</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-grey"><Globe className="size-4 text-navy" aria-hidden />Outside Ontario? We still answer questions and ship parts. <Package className="ml-1 size-4 text-navy" aria-hidden /></p>
          </div>
          <LeadForm source="service" title="Service Centre request" submitLabel="Send to the Service Centre" messageLabel="Model, serial / hours, and what's happening (mention if you think it's a warranty item)" />
        </Container>
      </section>
    </>
  );
}
