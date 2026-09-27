import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { AttachmentCard } from "@/components/equipment/AttachmentCard";
import { CtaBand } from "@/components/home/CtaBand";
import { Button } from "@/components/ui/Button";
import { getSiteContent, getAttachmentCategory, getAttachments } from "@/lib/catalogue";
import { slugify } from "@/lib/format";
import Link from "next/link";
import { plateLabels } from "@/lib/plates";
import { groupAttachments } from "@/lib/attachment-groups";

type Params = { category: string };

export async function generateStaticParams() {
  const { attachmentCategories } = await getSiteContent();
  return attachmentCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const cat = await getAttachmentCategory((await params).category);
  if (!cat) return {};
  return { title: cat.name, description: cat.description, alternates: { canonical: `/attachments/${cat.slug}` } };
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
        {cat.slug === "excavator-attachments" && <Button href="/builder/excavator" arrow>See What Fits Your Excavator</Button>}
      </PageHero>
      <section className="section">
        <Container>
          <div className="mb-6 rounded-card border border-line bg-light/60 p-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-grey">Show attachments that fit</p>
            <ul className="flex flex-wrap gap-2">
              <li><Link href={`/attachments/${cat.slug}${qs(undefined, plate)}`} className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-semibold ${!machine ? "border-navy bg-navy text-white" : "border-line bg-white text-navy hover:border-electric"}`}>All models</Link></li>
              {modelsHere.map((m) => <li key={m.id}><Link href={`/attachments/${cat.slug}${qs(m.slug, plate)}`} className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-semibold ${machine?.id === m.id ? "border-navy bg-navy text-white" : "border-line bg-white text-navy hover:border-electric"}`}>{m.modelName}</Link></li>)}
            </ul>
            {platesHere.length > 1 && (
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Plate type">
                <li><Link href={`/attachments/${cat.slug}${qs(machine?.slug)}`} className={`inline-flex h-9 items-center rounded-full border px-3 text-[13px] font-semibold ${!plate ? "border-charcoal bg-charcoal text-white" : "border-line bg-white text-charcoal hover:border-electric"}`}>Any plate</Link></li>
                {platesHere.map((p) => <li key={p}><Link href={`/attachments/${cat.slug}${qs(machine?.slug, p)}`} className={`inline-flex h-9 items-center rounded-full border px-3 text-[13px] font-semibold ${plate === p ? "border-charcoal bg-charcoal text-white" : "border-line bg-white text-charcoal hover:border-electric"}`}>{plateLabels[p] ?? p}</Link></li>)}
              </ul>
            )}
            <p className="mt-3 text-[13px] text-grey">{machine ? `${items.length} attachments listed by RIPPA for the ${machine.modelName}.` : `${items.length} attachments.`} Not sure which plate you have, or want to run attachments from another machine? We convert plates and fit adapters. <Link href="/contact" className="font-semibold text-navy">Ask us</Link>.</p>
          </div>
          {types.length > 1 && (
            <ul className="mb-6 flex flex-wrap gap-2" aria-label="Attachment types">
              {types.map((t) => <li key={t}><a href={`#${slugify(t)}`} className="inline-flex h-10 items-center rounded-full border border-line px-4 text-sm font-semibold text-navy hover:border-electric hover:text-electric">{t}</a></li>)}
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
      <CtaBand title="Add attachments to your quote" text="Combine machines and attachments in one request. Our team confirms compatibility and pricing." />
    </>
  );
}
