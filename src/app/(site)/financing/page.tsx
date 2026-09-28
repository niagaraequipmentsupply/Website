import type { Metadata } from "next";
import { Percent, Clock, FileText, Handshake, ShieldCheck, ArrowRight, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { LeadForm } from "@/components/quote/LeadForm";
import { PromoCard } from "@/components/financing/PromoCard";
import { PaymentCalculator } from "@/components/financing/PaymentCalculator";
import { getSiteContent } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Equipment Financing & Leasing",
  description: "Finance or lease RIPPA equipment in Ontario through our partner LeaseLink: seasonal leasing, deferred payments and pre-approval in about one business day.",
  alternates: { canonical: "/financing" },
};

const steps = [
  { title: "Pick your machine", text: "Choose a model, or configure one in the Excavator Builder with attachments, warranty and delivery." },
  { title: "Tell us about your business", text: "A two-minute form. Most applications need only your business details and the equipment you want." },
  { title: "Get approved", text: "Our financing partner works with 20+ lenders and typically responds within one business day." },
  { title: "Take delivery", text: "Sign, schedule delivery or pickup, and get to work. Payments start on the schedule you chose." },
];

const faqs = [
  { q: "Do I need a large down payment?", a: "Not always. Depending on credit and the machine, financing can be structured with minimal or zero down. Most customers put 0–20% down." },
  { q: "Can I finance attachments, warranty and delivery too?", a: "Yes. Everything in your quote or build can go on one agreement, so you're not paying cash for a bucket and thumb on delivery day." },
  { q: "What's the difference between a lease and a loan?", a: "A loan means you own the machine from day one with fixed payments. A lease-to-own usually has lower payments with a buyout at the end of the term, and payments may be treated as an operating expense. Talk to your accountant about what suits your business." },
  { q: "I'm a new business or have bruised credit. Can I still finance?", a: "Often, yes. Our partner works with lenders that support all sizes and credit profiles. Approval terms may differ, and we'll tell you up front." },
  { q: "Is a payment estimate on this page a quote?", a: "No. The estimator is for illustration. Your actual rate, term and payment are confirmed by the lender on approved credit, in writing, before you sign anything." },
];

export default async function FinancingPage() {
  const { financing, financePromos, catalogue, site } = await getSiteContent();
  const promos = financePromos.filter((p) => p.kind === "promo");
  const programs = financePromos.filter((p) => p.kind === "program");
  const partner = financing.partner;

  return (
    <>
      <PageHero
        title={<>Financing <span className="text-navy">&amp; Leasing</span></>}
        text="Flexible ways to put a RIPPA machine to work without tying up your cash. Loans, lease-to-own, seasonal payments and limited-time promotions, arranged through our financing partner on approved credit."
        crumbs={[{ label: "Financing" }]}
        aside={
          <ul className="grid gap-3">
            {[{ icon: Clock, t: "Fast decisions", s: "Typically within one business day" }, { icon: Percent, t: "Competitive rates", s: "20+ lenders compete for your deal" }, { icon: FileText, t: "One agreement", s: "Machine, attachments, warranty & delivery" }].map((i) => (
              <li key={i.t} className="flex items-center gap-3 rounded-card border border-line bg-white px-4 py-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-tint text-navy"><i.icon className="size-5" aria-hidden /></span>
                <span><span className="block font-bold text-charcoal">{i.t}</span><span className="block text-sm text-grey">{i.s}</span></span>
              </li>
            ))}
          </ul>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Button href="#apply" size="lg" arrow>Get Pre-Approved</Button>
          <Button href="#estimator" size="lg" variant="secondary">Estimate a Payment</Button>
        </div>
      </PageHero>

      {promos.length > 0 && (
        <section id="promotions" className="section scroll-mt-28">
          <Container>
            <SectionHeading eyebrow="Limited time" title="Current Financing Promotions" subtitle="Offers change through the year. Eligible models show the promotion on their product page." rule={false} />
            <ul className={`grid gap-4 ${promos.length === 1 ? "max-w-2xl" : "md:grid-cols-2"}`}>
              {promos.map((p, i) => <li key={p.id}><PromoCard promo={p} machines={catalogue.machines} emphasis={i === 0} /></li>)}
            </ul>
          </Container>
        </section>
      )}

      {programs.length > 0 && (
        <section id="programs" className="section-tight scroll-mt-28 bg-light/60">
          <Container>
            <SectionHeading title="Financing Programs" subtitle="Available year-round. Mix and match with a promotion where eligible." rule={false} />
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {programs.map((p) => <li key={p.id}><PromoCard promo={p} machines={catalogue.machines} /></li>)}
            </ul>
          </Container>
        </section>
      )}

      {partner && (
        <section className="section-tight">
          <Container>
            <div className="grid items-center gap-8 rounded-card border border-line p-6 md:grid-cols-[1fr_1.4fr] md:p-10">
              <div>
                <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.3em] text-navy">Our financing partner</p>
                <h2 className="display text-charcoal">{partner.name}</h2>
                <div className="mt-4 flex items-center gap-3">
                  <span className="flex size-12 items-center justify-center rounded-md bg-tint text-navy"><Handshake className="size-7" aria-hidden /></span>
                  <a href={partner.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-electric">{partner.url.replace(/^https?:\/\//, "").replace(/\/$/, "")} <ArrowRight className="size-4" aria-hidden /></a>
                </div>
              </div>
              <div>
                <p className="text-[16px] leading-relaxed text-charcoal/85">{partner.blurb}</p>
                <ul className="mt-4 grid gap-2 text-sm text-charcoal sm:grid-cols-2">
                  {["Lease-to-own and equipment loans", "Seasonal and skip-payment structures", "Minimal or zero down on approved credit", "Support for new businesses and all credit profiles"].map((t) => <li key={t} className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />{t}</li>)}
                </ul>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button href="#apply" arrow>Apply through {site.name}</Button>
                  {partner.applyUrl && <Button href={partner.applyUrl} variant="secondary" target="_blank" rel="noopener">Apply directly with {partner.name}</Button>}
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      <section className="section-tight bg-light/60">
        <Container>
          <SectionHeading title="How It Works" rule={false} />
          <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-card border border-line bg-white p-5">
                <span className="flex size-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">{i + 1}</span>
                <h3 className="mt-3 text-base font-bold text-charcoal">{s.title}</h3>
                <p className="mt-1 text-sm text-grey">{s.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section id="estimator" className="section scroll-mt-28">
        <Container className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <PaymentCalculator />
          <div>
            <h2 className="display text-2xl text-charcoal">Financing FAQ</h2>
            <dl className="mt-4 divide-y divide-line rounded-card border border-line">
              {faqs.map((f) => (
                <div key={f.q} className="p-4">
                  <dt className="font-bold text-charcoal">{f.q}</dt>
                  <dd className="mt-1 text-sm text-grey">{f.a}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-grey">Still have questions? Call <a href={site.phoneHref} className="inline-flex items-center gap-1 font-semibold text-navy"><Phone className="size-4" aria-hidden />{site.phone}</a> and ask for financing.</p>
          </div>
        </Container>
      </section>

      <section id="apply" className="section-tight scroll-mt-28 bg-light/60">
        <Container className="grid gap-8 lg:grid-cols-[2fr_3fr]">
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.3em] text-navy">Pre-approval</p>
            <h2 className="display text-charcoal">Get Pre-Approved</h2>
            <p className="mt-3 text-[16px] text-charcoal/85">Tell us what you&apos;re looking at and how you&apos;d like to pay. We&apos;ll come back with options from our partner, usually within a business day. No obligation and no hit to your credit until you choose to proceed.</p>
            <div className="mt-5 rounded-card border border-line bg-white p-5">
              <h3 className="font-bold text-charcoal">Have these handy</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-grey">
                {["Business name and years in operation", "Equipment you're interested in (or your saved build)", "Preferred term and down payment, if any", "Contact details for the decision maker"].map((t) => <li key={t} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-navy" aria-hidden />{t}</li>)}
              </ul>
              <p className="mt-4 text-[12px] text-grey">{financing.disclaimer}</p>
            </div>
          </div>
          <LeadForm source="financing" title="Financing Request" submitLabel="Request Pre-Approval" messageLabel="Equipment of interest, preferred term / down payment, and any questions" />
        </Container>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }} />
    </>
  );
}
