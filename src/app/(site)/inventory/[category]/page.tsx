import type { Metadata } from "next";
import Link from "next/link";
import { RuggedChip } from "@/components/ui/RuggedChip";
import { notFound } from "next/navigation";
import { Check, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { compareHref } from "@/lib/compare";
import { ProductCard } from "@/components/equipment/ProductCard";
import { CtaBand } from "@/components/home/CtaBand";
import { Button } from "@/components/ui/Button";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { ComparisonChart } from "@/components/equipment/ComparisonChart";
import { AttachmentCard } from "@/components/equipment/AttachmentCard";
import { getSiteContent, getCategory, getMachines } from "@/lib/catalogue";
import { builderForCategory } from "@/lib/builders";

type Params = { category: string };

export async function generateStaticParams() {
  const { categories } = await getSiteContent();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const cat = await getCategory((await params).category);
  if (!cat) return {};
  return { title: `RIPPA ${cat.name} for Sale in Ontario`, description: cat.description, alternates: { canonical: `/inventory/${cat.slug}` } };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  const cat = await getCategory(category);
  if (!cat) notFound();
  const items = await getMachines(cat.slug);
  const { attachmentCategories, catalogue, site } = await getSiteContent();
  const attCat = attachmentCategories.find((a) => a.machineCategories.includes(cat.slug));
  const attachments = attCat ? catalogue.attachments.filter((a) => a.attachmentCategory === attCat.slug && a.featured).slice(0, 5) : [];
  const byId = new Map(items.map((m) => [m.id, m]));
  const hasChart = items.length > 1;

  const faqLd = cat.faqs.length ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: cat.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) } : null;

  return (
    <>
      <PageHero
        title={cat.name}
        text={cat.description}
        crumbs={[{ href: "/inventory", label: "Equipment" }, { label: cat.name }]}
        aside={<EquipmentImage image={cat.image} kind={cat.slug} alt={cat.name} ratio="aspect-[16/9]" className="bg-white" />}
      >
        <div className="flex flex-wrap gap-3">
          {builderForCategory(cat.slug) && <Button href={builderForCategory(cat.slug)!.href} arrow>Build Your {builderForCategory(cat.slug)!.label}</Button>}
          {hasChart && <Button href="#compare" variant="secondary">Compare Models</Button>}
          {attCat && <Button href={`/attachments/${attCat.slug}`} variant="secondary" arrow>{attCat.name}</Button>}
        </div>
        {items.length > 1 && (
          <nav aria-label={`${cat.name} models`} className="mt-5 flex flex-wrap gap-1.5">
            {items.map((m) => <RuggedChip key={m.id} href={`/inventory/${m.category}/${m.slug}`} size="sm">{m.modelName}</RuggedChip>)}
          </nav>
        )}
      </PageHero>

      {/* ---------- Model grid ---------- */}
      <section className="section">
        <Container>
          {items.length === 0 ? (
            <p className="rounded-card border border-line p-8 text-center text-grey">Models for this category are being added. Contact us for current availability.</p>
          ) : (
            <>
              <SectionHeading title={`${items.length} ${cat.name}`} subtitle={cat.intro} rule={false} link={hasChart ? { href: "#compare", label: "Compare all" } : undefined} />
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((m) => <li key={m.id}><ProductCard machine={m} /></li>)}
              </ul>
            </>
          )}
        </Container>
      </section>

      {/* ---------- Buying guide ---------- */}
      {cat.buyingGuide.length > 0 && (
        <section id="which-model" className="section-tight scroll-mt-28 bg-light/60">
          <Container>
            <SectionHeading eyebrow="Buying guide" title="Which model is right for you?" subtitle="Start with the work, then the access and the truck you'll tow with. Every model below shares the same attachment range." rule={false} />
            <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {cat.buyingGuide.map((b, i) => {
                const models = b.modelIds.map((id) => byId.get(id)).filter((m): m is NonNullable<typeof m> => !!m);
                return (
                  <li key={b.title} className="flex flex-col rounded-card border border-line bg-white p-5">
                    <span className="flex size-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">{i + 1}</span>
                    <h3 className="mt-3 text-base font-bold text-charcoal">{b.title}</h3>
                    <p className="mt-1 flex-1 text-sm text-grey">{b.text}</p>
                    {models.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {models.map((m) => <li key={m.id}><Link href={`/inventory/${m.category}/${m.slug}`} className="inline-flex h-7 items-center rounded-full bg-tint px-2.5 text-[12px] font-semibold text-navy hover:bg-navy hover:text-white">{m.modelName}</Link></li>)}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ol>
          </Container>
        </section>
      )}

      {/* ---------- Highlights ---------- */}
      {cat.highlights.length > 0 && (
        <section className="section-tight">
          <Container>
            <SectionHeading title={`Why RIPPA ${cat.name}`} rule={false} />
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {cat.highlights.map((h) => (
                <li key={h.title} className="rounded-card border border-line p-5">
                  <span className="flex size-10 items-center justify-center rounded-md bg-tint text-navy"><Check className="size-5" aria-hidden /></span>
                  <h3 className="mt-3 font-bold text-charcoal">{h.title}</h3>
                  <p className="mt-1 text-sm text-grey">{h.text}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* ---------- Attachments teaser ---------- */}
      {attCat && attachments.length > 0 && (
        <section className="section-tight bg-light/60">
          <Container>
            <SectionHeading title={attCat.name} subtitle={attCat.description} rule={false} link={{ href: `/attachments/${attCat.slug}`, label: "View all" }} />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {attachments.map((a) => <li key={a.id}><AttachmentCard attachment={a} /></li>)}
            </ul>
          </Container>
        </section>
      )}

      {/* ---------- Comparison chart ---------- */}
      {hasChart && (
        <section id="compare" className="section scroll-mt-28">
          <Container>
            <SectionHeading eyebrow="Buying guide" title={`Compare RIPPA ${cat.name}`} subtitle="Side-by-side specs, who each model is for, how well it handles common jobs and what safety and comfort equipment is included." rule={false} />
            <ComparisonChart machines={items.map(({ id, slug, modelName, series, category, images, specs, targetUsers, checklist, applicationFit, warranty, showPrice, basePrice, promoPrice, configurations, indoorUse, noiseLevel }) => ({ id, slug, modelName, series, category, images: images.slice(0, 1), specs, targetUsers, checklist, applicationFit, warranty, showPrice, basePrice, promoPrice, configurations, indoorUse, noiseLevel }))} categoryName={cat.name} />
            {items.length >= 2 && <p className="mt-4 text-sm"><Link href={compareHref(items.slice(0, 3).map((m) => m.slug))} className="inline-flex items-center gap-1 font-semibold text-navy hover:text-electric">Open the full spec-by-spec comparison <ArrowRight className="size-3.5" aria-hidden /></Link></p>}
            <p className="mt-4 text-[12px] text-grey">Ratings and required attachments follow the RIPPA buying guide. Specifications are manufacturer figures and may vary by configuration. Confirm fitment with our team before ordering attachments.</p>
          </Container>
        </section>
      )}

      {/* ---------- FAQ ---------- */}
      {cat.faqs.length > 0 && (
        <section className="section-tight bg-light/60">
          <Container className="grid gap-8 lg:grid-cols-[1fr_2fr]">
            <div>
              <h2 className="display text-charcoal">{cat.name} FAQ</h2>
              <p className="mt-2 text-sm text-grey">Questions we hear most before people buy. Call <a href={site.phoneHref} className="font-semibold text-navy">{site.phone}</a> for anything else.</p>
              <Link href="/contact" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-electric">Ask a specialist <ArrowRight className="size-4" aria-hidden /></Link>
            </div>
            <dl className="divide-y divide-line rounded-card border border-line bg-white">
              {cat.faqs.map((f) => (
                <div key={f.question} className="p-4">
                  <dt className="font-bold text-charcoal">{f.question}</dt>
                  <dd className="mt-1 text-sm text-grey">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      )}

      <CtaBand title={`Get a quote on RIPPA ${cat.name.toLowerCase()}`} text="Add machines to your quote list or call our team for pricing, availability and financing." />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
    </>
  );
}
