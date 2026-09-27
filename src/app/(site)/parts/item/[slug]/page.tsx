import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Package, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LeadForm } from "@/components/quote/LeadForm";
import { getSiteContent } from "@/lib/catalogue";
import { systemLabel } from "@/lib/parts";

type Params = { slug: string };

export async function generateStaticParams() {
  const { parts } = await getSiteContent();
  return parts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const { parts, catalogue } = await getSiteContent();
  const p = parts.find((x) => x.slug === slug);
  if (!p) return {};
  const fits = catalogue.machines.filter((m) => p.compatibleModelIds.includes(m.id)).map((m) => m.modelName).join(", ");
  return {
    title: `${p.name} ${p.sku} | Genuine RIPPA Part${fits ? ` for ${fits}` : ""}`,
    description: `Genuine RIPPA ${p.name} (part number ${p.sku})${fits ? ` for the ${fits}` : ""}. ${systemLabel(p.system)}. Request it from Niagara Equipment Supply; shipped across Canada.`,
    alternates: { canonical: `/parts/item/${p.slug}` },
  };
}

export default async function PartPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { parts, catalogue, site } = await getSiteContent();
  const p = parts.find((x) => x.slug === slug);
  if (!p) notFound();
  const fits = catalogue.machines.filter((m) => p.compatibleModelIds.includes(m.id));
  const related = parts.filter((x) => x.id !== p.id && x.system === p.system && x.compatibleModelIds.some((id) => p.compatibleModelIds.includes(id))).slice(0, 5);
  const jsonLd = { "@context": "https://schema.org", "@type": "Product", name: p.name, sku: p.sku, mpn: p.sku, brand: { "@type": "Brand", name: "RIPPA" }, category: systemLabel(p.system), image: p.image?.src, description: `Genuine RIPPA ${p.name}${fits.length ? ` for ${fits.map((m) => m.modelName).join(", ")}` : ""}.` };
  return (
    <>
      <section className="border-b border-line">
        <Container className="py-8">
          <Breadcrumbs items={[{ href: "/parts", label: "Parts Catalogue" }, ...(fits[0] ? [{ href: `/parts/${fits[0].slug}`, label: `${fits[0].modelName} parts` }] : []), { label: p.name }]} />
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <EquipmentImage image={p.image} kind="attachment" alt={p.name} priority sizes="(max-width: 1024px) 100vw, 560px" ratio="aspect-square" className="border border-line bg-white" />
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-navy">{systemLabel(p.system)}{p.engineBrand ? ` · ${p.engineBrand === "kubota" ? "Kubota" : "Briggs & Stratton"}` : ""}</p>
              <h1 className="display mt-2 text-charcoal">{p.name}</h1>
              <p className="mt-2 font-mono text-[15px] text-grey">RIPPA part number <span className="font-bold text-charcoal">{p.sku}</span></p>
              {p.description && <p className="mt-3 text-[16px] text-charcoal/85">{p.description}</p>}
              <div className="mt-5 border-t border-line pt-4">
                <h2 className="text-sm font-bold text-charcoal">Fits these machines</h2>
                {fits.length ? (
                  <ul className="mt-2 flex flex-wrap gap-2">{fits.map((m) => <li key={m.id}><Link href={`/parts/${m.slug}`} className="inline-flex h-8 items-center rounded-full bg-tint px-3 text-sm font-semibold text-navy hover:bg-navy hover:text-white">{m.modelName}</Link></li>)}</ul>
                ) : <p className="mt-1 text-sm text-grey">Fitment to be confirmed. Send us your model and serial number.</p>}
              </div>
              <ul className="mt-5 space-y-2 text-sm text-charcoal">
                {["Genuine RIPPA part, matched to your serial number before it ships", `Stocked items ship same or next business day from ${site.address.city}`, "Canada-wide tracked shipping; US owners quoted with cross-border shipping", "Backed by the RIPPA Service Centre"].map((t) => <li key={t} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />{t}</li>)}
              </ul>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <Button href="#request" size="lg" arrow icon={<Package className="size-4" aria-hidden />}>Request this part</Button>
                <Button href={site.phoneHref} variant="secondary" size="lg" icon={<Phone className="size-4" aria-hidden />}>Call {site.phone}</Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="request" className="section scroll-mt-28 bg-light/60">
        <Container className="grid gap-8 lg:grid-cols-[2fr_3fr]">
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.3em] text-navy">Parts request</p>
            <h2 className="display text-charcoal">Get a price and availability</h2>
            <p className="mt-3 text-[16px] text-charcoal/85">Tell us your machine and serial number and how many you need. We reply with price, stock status and shipping to your postal code.</p>
          </div>
          <LeadForm source="parts" title="Request this part" submitLabel="Request Price & Availability" messageLabel="Model, serial number, quantity" defaultMessage={`Part request: ${p.name} (${p.sku})${fits[0] ? ` for my ${fits[0].modelName}` : ""}. Quantity: 1.`} />
        </Container>
      </section>

      {related.length > 0 && (
        <section className="section-tight">
          <Container>
            <SectionHeading title={`More ${systemLabel(p.system).toLowerCase()} parts`} rule={false} link={fits[0] ? { href: `/parts/${fits[0].slug}`, label: `All ${fits[0].modelName} parts` } : undefined} />
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {related.map((r) => <li key={r.id}><Link href={`/parts/item/${r.slug}`} className="flex h-full flex-col rounded-card border border-line bg-white p-3 hover:border-electric"><EquipmentImage image={r.image} kind="attachment" alt={r.name} ratio="aspect-square" className="bg-white" compact /><span className="mt-2 line-clamp-2 text-sm font-semibold text-charcoal">{r.name}</span><span className="mt-1 font-mono text-[11px] text-grey">{r.sku}</span></Link></li>)}
            </ul>
          </Container>
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
