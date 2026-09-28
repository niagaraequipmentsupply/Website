import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AttachmentCard } from "@/components/equipment/AttachmentCard";
import { CtaBand } from "@/components/home/CtaBand";
import { Button } from "@/components/ui/Button";
import { getSiteContent, getAttachmentCategory, getAttachments } from "@/lib/catalogue";
import { slugify } from "@/lib/format";
import Link from "next/link";
import { RuggedChip } from "@/components/ui/RuggedChip";
import { Check } from "lucide-react";
import { plateLabels } from "@/lib/plates";
import { groupAttachments } from "@/lib/attachment-groups";
import { builderForAttachmentCategory } from "@/lib/builders";

type Params = { category: string };

export async function generateStaticParams() {
  const { attachmentCategories } = await getSiteContent();
  return attachmentCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const cat = await getAttachmentCategory((await params).category);
  if (!cat) return {};
  return { title: `RIPPA ${cat.name} in Ontario`, description: `${cat.description} Sized by model, with plate and coupler fitment confirmed by Niagara Equipment Supply, Thorold.`.slice(0, 160), alternates: { canonical: `/attachments/${cat.slug}` } };
}

export default async function AttachmentCategoryPage({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<{ model?: string; plate?: string }> }) {
  const cat = await getAttachmentCategory((await params).category);
  if (!cat) notFound();
  const { model, plate } = await searchParams;
  const { catalogue } = await getSiteContent();
  const modelsHere = catalogue.machines.filter((m) => cat.machineCategories.includes(m.category)).sort((a, b) => a.sortOrder - b.sortOrder);
  const machine = model ? modelsHere.find((m) => m.slug === model) : undefined;
  const all = await getAttachments(cat.slug);
  const platesOf = (a: (typeof all)[number]) => Array.from(new Set([a.plateType, ...a.variants.map((v) => v.plateType)].filter((x): x is string => !!x)));
  const platesHere = Array.from(new Set(all.flatMap(platesOf)));
  let items = machine ? all.filter((a) => a.compatibleModelIds.includes(machine.id) || (a.compatibleModelIds.length === 0 && a.compatibleCategories.includes(machine.category))) : all;
  if (plate) items = items.filter((a) => platesOf(a).includes(plate));
  const qs = (m?: string, p?: string) => { const u = new URLSearchParams(); if (m) u.set("model", m); if (p) u.set("plate", p); const s = u.toString(); return s ? `?${s}` : ""; };
  const groups = groupAttachments(items);
  const types = groups.map(([g]) => g);
  return (
    <>
      <PageHero title={cat.name} text={cat.description} crumbs={[{ href: "/attachments", label: "Attachments" }, { label: cat.name }]}>
        {builderForAttachmentCategory(cat.slug) && <Button href={builderForAttachmentCategory(cat.slug)!.href} arrow>See What Fits Your {builderForAttachmentCategory(cat.slug)!.label}</Button>}
      </PageHero>
      <section className="section">
        <Container>
          <div className="mb-6 rounded-card border border-line bg-light/60 p-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-grey">Show attachments that fit</p>
            <ul className="flex flex-wrap gap-2">
              <li><RuggedChip href={`/attachments/${cat.slug}${qs(undefined, plate)}`} active={!machine}>All models</RuggedChip></li>
              {modelsHere.map((m) => <li key={m.id}><RuggedChip href={`/attachments/${cat.slug}${qs(m.slug, plate)}`} active={machine?.id === m.id}>{m.modelName}</RuggedChip></li>)}
            </ul>
            {platesHere.length > 1 && (
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Plate type">
                <li><RuggedChip href={`/attachments/${cat.slug}${qs(machine?.slug)}`} size="sm" active={!plate}>Any plate</RuggedChip></li>
                {platesHere.map((p) => <li key={p}><RuggedChip href={`/attachments/${cat.slug}${qs(machine?.slug, p)}`} size="sm" active={plate === p}>{plateLabels[p] ?? p}</RuggedChip></li>)}
              </ul>
            )}
            <p className="mt-3 text-[13px] text-grey">{machine ? `${items.length} attachments listed by RIPPA for the ${machine.modelName}.` : `${items.length} attachments.`} Not sure which plate you have, or want to run attachments from another machine? We convert plates and fit adapters. <Link href="/contact" className="font-semibold text-navy">Ask us</Link>.</p>
          </div>
          {cat.intro && !machine && !plate && <p className="mb-6 max-w-3xl text-[16px] leading-relaxed text-charcoal/85">{cat.intro}</p>}
          {types.length > 1 && (
            <ul className="mb-6 flex flex-wrap gap-2" aria-label="Attachment types">
              {groups.map(([t, group]) => <li key={t}><RuggedChip href={`#${slugify(t)}`} size="sm" count={group.length}>{t}</RuggedChip></li>)}
            </ul>
          )}
          {groups.map(([t, group]) => (
            <div key={t} id={slugify(t)} className="mb-10 scroll-mt-28">
              <h2 className="display mb-4 text-2xl text-charcoal">{t} <span className="text-lg text-grey">{group.length}</span></h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {group.map((a) => <li key={a.id}><AttachmentCard attachment={a} showQuote /></li>)}
              </ul>
            </div>
          ))}
        </Container>
      </section>
      {((cat.buyingGuide ?? []).length > 0 || (cat.highlights ?? []).length > 0) && (
        <section className="section-tight bg-light/60">
          <Container>
            {(cat.buyingGuide ?? []).length > 0 && (
              <>
                <SectionHeading eyebrow="Buying guide" title="What to add first" rule={false} />
                <ul className="mb-8 grid gap-4 md:grid-cols-3">
                  {(cat.buyingGuide ?? []).map((b) => <li key={b.title} className="rounded-card border border-line bg-white p-5"><h3 className="font-bold text-charcoal">{b.title}</h3><p className="mt-1 text-sm text-grey">{b.text}</p></li>)}
                </ul>
              </>
            )}
            {(cat.highlights ?? []).length > 0 && (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {(cat.highlights ?? []).map((h) => <li key={h.title} className="flex gap-3 rounded-card border border-line bg-white p-4"><Check className="mt-0.5 size-5 shrink-0 text-navy" aria-hidden /><div><h3 className="font-bold text-charcoal">{h.title}</h3><p className="mt-1 text-sm text-grey">{h.text}</p></div></li>)}
              </ul>
            )}
          </Container>
        </section>
      )}
      {(cat.faqs ?? []).length > 0 && (
        <section className="section-tight">
          <Container className="grid gap-8 lg:grid-cols-[1fr_2fr]">
            <div><h2 className="display text-charcoal">{cat.name} FAQ</h2><p className="mt-2 text-sm text-grey">Plate types, fitment and what to buy first. Still unsure? <Link href="/contact" className="font-semibold text-navy">Ask our team</Link>.</p></div>
            <dl className="divide-y divide-line rounded-card border border-line bg-white">
              {(cat.faqs ?? []).map((f) => <div key={f.question} className="p-4"><dt className="font-bold text-charcoal">{f.question}</dt><dd className="mt-1 text-sm text-grey">{f.answer}</dd></div>)}
            </dl>
          </Container>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: (cat.faqs ?? []).map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }) }} />
        </section>
      )}
      <CtaBand title="Add attachments to your quote" text="Combine machines and attachments in one request. Our team confirms compatibility and pricing." />
    </>
  );
}
