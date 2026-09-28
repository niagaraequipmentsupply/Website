import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Phone, Check, Download, Wrench, ShieldCheck, Truck, ArrowRight, Package } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AddToQuoteButton } from "@/components/equipment/AddToQuoteButton";
import { ConfigurationTable } from "@/components/equipment/ConfigurationTable";
import { SpecTable } from "@/components/equipment/SpecTable";
import { ProductSubnav } from "@/components/equipment/ProductSubnav";
import { AttachmentPicker } from "@/components/equipment/AttachmentPicker";
import { ConfigurationPicker } from "@/components/equipment/ConfigurationPicker";
import { ProductCard } from "@/components/equipment/ProductCard";
import { LeadForm } from "@/components/quote/LeadForm";
import { ServiceCentreStrip } from "@/components/service/ServiceCentre";
import { MobileQuoteBar } from "@/components/equipment/MobileQuoteBar";
import { getCategory, getMachine, getSiteContent, getAttachments } from "@/lib/catalogue";
import { compatibleAttachments } from "@/lib/compatibility";
import { machinePrice, machineHasMultiplePrices } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { plateLabels } from "@/lib/plates";
import { isThin } from "@/lib/machines";
import { builderHref } from "@/lib/builders";

type Params = { category: string; slug: string };

/** "Backhoe Loader", "Track Dumper" when the series names the machine type; otherwise the category singular ("Excavator"). */
const kindOf = (series: string | undefined, shortName: string | undefined) => series && !/series$/i.test(series) ? series : (shortName ?? "").replace(/s$/, "");


export async function generateStaticParams() {
  const { catalogue } = await getSiteContent();
  return catalogue.machines.map((m) => ({ category: m.category, slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, category } = await params;
  const m = await getMachine(slug);
  if (!m || m.category !== category) return {};
  const cat = await getCategory(m.category);
  const { site } = await getSiteContent();
  const kind = kindOf(m.series, cat?.shortName);
  const thin = isThin(m);
  return {
    ...(thin ? { robots: { index: false, follow: true } } : {}),
    title: `${m.brand} ${m.modelName} ${kind} for Sale in Ontario`.replace(/\s+/g, " "),
    description: `${m.shortDescription.replace(/\s+$/, "")} Written quotes, dealer PDI and delivery across Ontario from ${site.name}, ${site.address.city}.`.slice(0, 160),
    alternates: { canonical: `/inventory/${m.category}/${m.slug}` },
    keywords: [`RIPPA ${m.modelName}`, `${m.modelName} ${kind.toLowerCase()}`, `RIPPA ${kind.toLowerCase()} Ontario`, `RIPPA dealer Niagara`, `${kind.toLowerCase()} for sale Ontario`],
    openGraph: m.images[0] ? { images: [{ url: m.images[0].src, alt: m.images[0].alt }] } : undefined,
  };
}

export default async function MachinePage({ params }: { params: Promise<Params> }) {
  const { slug, category } = await params;
  const m = await getMachine(slug);
  if (!m || m.category !== category) notFound();
  const cat = (await getCategory(m.category))!;
  const { site, catalogue, parts } = await getSiteContent();
  const compat = compatibleAttachments(await getAttachments(), m);
  const price = machinePrice(m);
  const heroStats = m.specs.filter((s) => s.highlight).slice(0, 5);
  const brochure = m.documents.find((d) => d.kind === "brochure") ?? m.documents[0];
  const gallery = m.images.slice(1, 7);
  const related = catalogue.machines.filter((x) => x.category === m.category && x.id !== m.id).slice(0, 4);
  const partCount = parts.filter((p) => p.compatibleModelIds.includes(m.id)).length;

  const sections = [
    { id: "overview", label: "Overview", show: true },
    { id: "features", label: "Features", show: m.features.length > 0 },
    { id: "specs", label: "Specifications", show: m.specs.length > 0 },
    { id: "configurations", label: "Configurations", show: m.configurations.length > 0 },
    { id: "attachments", label: "Attachments", show: compat.length > 0 },
    { id: "applications", label: "Applications", show: m.applications.length > 0 },
    { id: "downloads", label: "Downloads", show: m.documents.length > 0 },
    { id: "faq", label: "FAQ", show: m.faqs.length > 0 },
    { id: "quote", label: "Get a Quote", show: true },
  ].filter((s) => s.show).map(({ id, label }) => ({ id, label }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${m.brand} ${m.modelName}`,
    brand: { "@type": "Brand", name: m.brand },
    description: m.shortDescription,
    category: cat.name,
    image: m.images.map((i) => i.src),
    sku: m.slug, mpn: m.modelName, model: m.modelName, url: `${site.url}/inventory/${m.category}/${m.slug}`,
    itemCondition: "https://schema.org/NewCondition",
    manufacturer: { "@type": "Organization", name: "Shandong Rippa Machinery Group" },
    additionalProperty: heroStats.map((s) => ({ "@type": "PropertyValue", name: s.label, value: s.value })),
    ...(m.configurations.length > 1 ? { hasVariant: m.configurations.map((c) => ({ "@type": "Product", name: `${m.brand} ${m.modelName} · ${c.label}`, sku: c.sku ?? `${m.slug}-${c.id}`, mpn: m.modelName })) } : {}),
    ...(m.showPrice && price !== undefined ? { offers: { "@type": "AggregateOffer", priceCurrency: "CAD", lowPrice: price, offerCount: Math.max(1, m.configurations.length), itemCondition: "https://schema.org/NewCondition", availability: m.inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder", areaServed: "Ontario, Canada", seller: { "@type": "LocalBusiness", name: site.name, telephone: site.phone, address: { "@type": "PostalAddress", addressLocality: site.address.city, addressRegion: "ON", addressCountry: "CA" } } } } : {}),
    ...(m.faqs.length ? { subjectOf: { "@type": "FAQPage", mainEntity: m.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) } } : {}),
  };

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section id="overview" className="scroll-mt-32 border-b border-line bg-gradient-to-b from-white to-light/50">
        <Container className="py-6 lg:py-8">
          <Breadcrumbs items={[{ href: "/inventory", label: "Equipment" }, { href: `/inventory/${cat.slug}`, label: cat.name }, { label: m.modelName }]} />
          <div className="mt-5 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
            <div>
              <EquipmentImage image={m.images[0]} kind={m.category} alt={`${m.brand} ${m.modelName}`} priority sizes="(max-width: 1024px) 100vw, 720px" ratio="aspect-[4/3]" className="border border-line bg-white" />
              {gallery.length > 0 && (
                <ul className="mt-3 grid grid-cols-6 gap-2" aria-label="More photos">
                  {gallery.map((img) => (
                    <li key={img.src} className="relative aspect-[4/3] overflow-hidden rounded-md border border-line bg-white">
                      <Image src={img.src} alt={img.alt} fill sizes="120px" className="object-cover" />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-navy">{m.brand} {m.series ?? cat.shortName}</p>
                {m.badge && <Badge>{m.badge}</Badge>}
                {m.inStock !== undefined && <Badge tone={m.inStock ? "success" : "grey"}>{m.inStock ? "In stock" : "Order"}</Badge>}
                {m.isPlaceholder && <Badge tone="warning">Sample data</Badge>}
              </div>
              <h1 className="display mt-2 text-charcoal">{m.brand} {m.modelName} <span className="text-navy">{kindOf(m.series, cat.shortName)}</span></h1>
              <p className="mt-3 text-[16px] leading-relaxed text-charcoal/85">{m.shortDescription || `The RIPPA ${m.modelName} is joining our lineup. Full specifications and photos are being prepared; ask us for the spec sheet, availability and a written quote.`}</p>
              <p className="mt-2 text-[13px] font-semibold text-navy">Sold, set up and serviced in {site.address.city}, Ontario · Delivery across Ontario</p>
              {m.certifications.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2" aria-label="Certifications">
                  {m.certifications.map((c) => <li key={c} className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-grey"><ShieldCheck className="size-3.5 text-navy" aria-hidden />{c}</li>)}
                </ul>
              )}

              {heroStats.length > 0 && (
                <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-line py-5 sm:grid-cols-3">
                  {heroStats.map((s) => (
                    <div key={s.label}>
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-grey">{s.label}</dt>
                      <dd className="text-lg font-bold text-charcoal">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mt-5 rounded-card border border-line bg-light/60 p-4">
                {price !== undefined ? (
                  <><p className="text-[12px] font-semibold uppercase tracking-wide text-grey">{machineHasMultiplePrices(m) ? "Starting from" : "Price"}</p><p className="display text-3xl text-navy">{formatPrice(price)}</p></>
                ) : (
                  <><p className="text-[12px] font-semibold uppercase tracking-wide text-grey">Pricing</p><p className="text-[15px] font-bold text-charcoal">Written quote within one business day</p><p className="mt-0.5 text-[13px] text-grey">Configuration, attachments, warranty, delivery and financing on one page. No obligation.</p></>
                )}
                {m.configurations.length > 1 && <a href="#configurations" className="mt-1 inline-block text-[13px] font-semibold text-navy hover:text-electric">{m.configurations.length} configurations available</a>}
              </div>
              <div className="mt-5">
                <ConfigurationPicker machine={m} />
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {builderHref(m) && <Button href={builderHref(m)!} variant="secondary" size="md" arrow>Build a full package</Button>}
                  <Button href={site.phoneHref} variant="secondary" size="md" icon={<Phone className="size-4" aria-hidden />}>Call {site.phone}</Button>
                </div>
              </div>
              <ul className="mt-5 grid gap-2 text-[13px] text-grey sm:grid-cols-3">
                {m.warranty && <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-navy" aria-hidden />{m.warranty}</li>}
                <li className="flex items-center gap-2"><Wrench className="size-4 text-navy" aria-hidden /><Link href={`/service?model=${m.slug}#hub`} className="hover:text-navy">Guides, videos &amp; service for this model</Link></li>
                {partCount > 0 ? <li className="flex items-center gap-2"><Package className="size-4 text-navy" aria-hidden /><Link href={`/parts/${m.slug}`} className="hover:text-navy">{partCount} genuine parts for this model</Link></li> : <li className="flex items-center gap-2"><Truck className="size-4 text-navy" aria-hidden />Delivery across Ontario</li>}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <ProductSubnav modelName={`${m.brand} ${m.modelName}`} sections={sections} brochureUrl={brochure?.url} />

      {/* ---------- Overview ---------- */}
      {m.longDescription && (
        <section className="section-tight border-b border-line">
          <Container className="grid gap-8 lg:grid-cols-[3fr_2fr]">
            <div>
              <h2 className="display text-2xl text-charcoal">{m.brand} {m.modelName} overview</h2>
              {m.longDescription.split("\n\n").map((para, i) => <p key={i} className="mt-3 text-[16px] leading-relaxed text-charcoal/85">{para}</p>)}
              {m.applications.length > 0 && <p className="mt-3 text-[15px] text-grey"><span className="font-semibold text-charcoal">Best for:</span> {m.applications.join(", ").toLowerCase()}.</p>}
            </div>
            <aside className="rounded-card border border-line bg-light/60 p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-navy">Buy the {m.modelName} in Niagara</p>
              <h3 className="mt-1 text-lg font-bold text-charcoal">Your local RIPPA dealer</h3>
              <ul className="mt-3 space-y-2 text-sm text-charcoal">
                {[`Dealer pre-delivery inspection on every ${m.modelName}`, "Warranty claims filed and repaired by the RIPPA Service Centre", "Genuine RIPPA and Kubota parts in stock", "Financing and lease-to-own on approved credit", `Flatbed delivery from ${site.address.city} to anywhere in Ontario`, "Attachment fitment confirmed before you buy"].map((t) => <li key={t} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />{t}</li>)}
              </ul>
              <div className="mt-4 grid gap-2">
                <Button href="#quote" size="sm" arrow>Get a written quote</Button>
                <Button href={site.phoneHref} variant="secondary" size="sm" icon={<Phone className="size-4" aria-hidden />}>Call {site.phone}</Button>
              </div>
            </aside>
          </Container>
        </section>
      )}

      <section className="section-tight border-b border-line"><Container><ServiceCentreStrip phone={site.phone} phoneHref={site.phoneHref} /></Container></section>

      {/* ---------- Features ---------- */}
      {m.features.length > 0 && (
        <section id="features" className="section scroll-mt-32">
          <Container>
            <SectionHeading eyebrow="Why the " title={<>{m.modelName} Features</>} rule={false} />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {m.features.map((f, i) => (
                <article key={f.title} className={`overflow-hidden rounded-card border border-line bg-white ${i === 0 ? "md:col-span-2 xl:col-span-3 md:grid md:grid-cols-[1.2fr_1fr] md:items-center" : ""}`}>
                  <div className={`relative bg-light ${i === 0 ? "aspect-[16/9] md:aspect-auto md:h-full md:min-h-[320px]" : "aspect-[4/3]"}`}>
                    {f.image ? <Image src={f.image.src} alt={f.image.alt} fill sizes={i === 0 ? "(max-width: 768px) 100vw, 760px" : "(max-width: 768px) 100vw, 420px"} className="object-cover" /> : <EquipmentImage kind={m.category} alt={f.title} ratio="aspect-[4/3]" className="rounded-none" />}
                  </div>
                  <div className={i === 0 ? "p-6 md:p-10" : "p-5"}>
                    {f.eyebrow && <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-navy">{f.eyebrow}</p>}
                    <h3 className={`display text-charcoal ${i === 0 ? "text-3xl" : "text-xl"}`}>{f.title}</h3>
                    <p className={`mt-2 text-grey ${i === 0 ? "text-[16px] leading-relaxed" : "text-sm"}`}>{f.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ---------- Standard equipment ---------- */}
      {m.standardEquipment.length > 0 && (
        <section className="section-tight bg-light/60">
          <Container>
            <SectionHeading title="Standard Equipment" subtitle="Included on every unit. No surprises on delivery day." rule={false} />
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {m.standardEquipment.map((s) => <li key={s} className="flex items-start gap-2 rounded-card border border-line bg-white px-4 py-3 text-sm text-charcoal"><Check className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />{s}</li>)}
            </ul>
          </Container>
        </section>
      )}

      {/* ---------- Specs ---------- */}
      {m.specs.length > 0 && (
        <section id="specs" className="section scroll-mt-32">
          <Container>
            <SectionHeading title="Specifications" subtitle="Manufacturer figures in kg / lb and ft / in. Values may vary slightly by configuration and production batch." rule={false} link={brochure ? { href: brochure.url, label: "Download spec sheet" } : undefined} />
            <SpecTable specs={m.specs} modelName={m.modelName} />
          </Container>
        </section>
      )}

      {/* ---------- Configurations & pricing ---------- */}
      {m.configurations.length > 0 && (
        <section id="configurations" className="section-tight scroll-mt-32 bg-light/60">
          <Container>
            <SectionHeading title={`${m.modelName} Configurations`} subtitle="Choose the engine, cab and undercarriage option that fits your work. Add the one you want to your quote and we price it with delivery and setup." rule={false} />
            <ConfigurationTable machine={m} />
            <p className="mt-3 text-sm text-grey">Prefer a monthly payment? <Link href="/financing" className="font-semibold text-navy hover:text-electric">See financing and lease options</Link>.</p>
          </Container>
        </section>
      )}

      {/* ---------- Attachments ---------- */}
      {compat.length > 0 && (
        <section id="attachments" className="section scroll-mt-32">
          <Container>
            <SectionHeading title={`Attachments for the ${m.modelName}`} subtitle={`Every attachment below is listed by RIPPA for the ${m.modelName}. Pick the size or version, add it to your quote beside the machine, and we confirm fitment against your serial number.`} rule={false} link={{ href: "/attachments/excavator-attachments", label: "All attachments" }} />
            <AttachmentPicker attachments={compat} machine={m} />
            {m.plateType && (
              <div className="mt-5 rounded-card border border-line bg-light/60 p-4 text-sm text-charcoal">
                <p className="font-bold">Attachment plate: {plateLabels[m.plateType] ?? m.plateType}</p>
                <p className="mt-1 text-grey">{m.plateNote ?? "We can modify or change the attachment plate on this machine so you can keep using attachments you already own, or run a different plate standard. Ask about plate conversions when you request a quote."}</p>
              </div>
            )}
            {builderHref(m) && <Button href={builderHref(m)!} variant="secondary" arrow className="mt-6">Build a {m.modelName} package</Button>}
          </Container>
        </section>
      )}

      {/* ---------- Applications ---------- */}
      {m.applications.length > 0 && (
        <section id="applications" className="section-tight relative scroll-mt-32 overflow-hidden bg-navy text-white">
          <div aria-hidden className="absolute inset-0 bg-[url('/images/bg/dark-chevron.svg')] bg-cover bg-center opacity-50" />
          <Container className="relative">
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.3em] text-white/80">Built for</p>
            <h2 className="display text-white">What owners do with the {m.modelName}</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {m.applications.map((a) => <li key={a} className="flex items-center gap-3 rounded-card border border-white/20 bg-white/5 px-4 py-3 font-semibold"><ArrowRight className="size-4 text-white/70" aria-hidden />{a}</li>)}
            </ul>
          </Container>
        </section>
      )}

      {/* ---------- Downloads ---------- */}
      {m.documents.length > 0 && (
        <section id="downloads" className="section-tight scroll-mt-32">
          <Container>
            <SectionHeading title="Downloads" rule={false} />
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {m.documents.map((d) => (
                <li key={d.url} className="min-w-0">
                  <a href={d.url} target="_blank" rel="noopener" className="flex min-w-0 items-center gap-4 rounded-card border border-line p-4 transition-colors hover:border-electric hover:bg-tint">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-navy text-white"><Download className="size-5" aria-hidden /></span>
                    <span className="min-w-0 flex-1"><span className="block truncate font-bold text-charcoal">{d.label}</span><span className="block text-[12px] uppercase tracking-wide text-grey">PDF · {d.kind === "spec-sheet" ? "spec sheet" : d.kind?.replace("-", " ")}</span></span>
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* ---------- FAQ ---------- */}
      {m.faqs.length > 0 && (
        <section id="faq" className="section-tight scroll-mt-32 bg-light/60">
          <Container className="grid gap-8 lg:grid-cols-[1fr_2fr]">
            <div>
              <h2 className="display text-charcoal">{m.modelName} FAQ</h2>
              <p className="mt-2 text-sm text-grey">Answers to the questions we hear most about this machine. Still unsure? Call <a href={site.phoneHref} className="font-semibold text-navy">{site.phone}</a>.</p>
            </div>
            <dl className="divide-y divide-line rounded-card border border-line bg-white">
              {m.faqs.map((f) => (
                <div key={f.question} className="p-4">
                  <dt className="font-bold text-charcoal">{f.question}</dt>
                  <dd className="mt-1 text-sm text-grey">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      )}

      {/* ---------- Quote ---------- */}
      <section id="quote" className="section scroll-mt-32">
        <Container className="grid gap-8 lg:grid-cols-[2fr_3fr]">
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.3em] text-navy">Next step</p>
            <h2 className="display text-charcoal">Get a {m.modelName} quote in Ontario</h2>
            <p className="mt-3 text-[16px] text-charcoal/85">Tell us where the machine is going and what it needs to do. We reply with a written quote covering the configuration, attachments, warranty, delivery and financing options.</p>
            <ul className="mt-5 space-y-2 text-sm text-charcoal">
              {["Written quote, usually within one business day", "Attachment fitment confirmed for your model", "Financing and lease options on approved credit", "Dealer PDI and delivery scheduled for you"].map((t) => <li key={t} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />{t}</li>)}
            </ul>
          </div>
          <LeadForm source="contact" title="Ask about this machine" submitLabel="Request a Quote" messageLabel="What will you use it for?" defaultMessage={`I'm interested in the ${m.brand} ${m.modelName}.`} />
        </Container>
      </section>

      {related.length > 0 && (
        <section className="section-tight border-t border-line">
          <Container>
            <SectionHeading title={`Other ${cat.name}`} link={{ href: `/inventory/${cat.slug}#compare`, label: "Compare models" }} />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => <li key={r.id}><ProductCard machine={r} /></li>)}
            </ul>
          </Container>
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MobileQuoteBar label={`Quote the ${m.modelName}`} phone={site.phone} phoneHref={site.phoneHref} />
    </>
  );
}
