import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBand } from "@/components/home/CtaBand";
import { AttachmentDetailActions } from "@/components/equipment/AttachmentDetailActions";
import { CompatibilityGuide } from "@/components/equipment/CompatibilityGuide";
import { getAttachmentCategory, getAttachment, getSiteContent } from "@/lib/catalogue";
import { isAttachmentCompatible } from "@/lib/compatibility";
import { plateLabels } from "@/lib/plates";

type Params = { category: string; slug: string };

export async function generateStaticParams() {
  const { catalogue } = await getSiteContent();
  return catalogue.attachments.map((a) => ({ category: a.attachmentCategory, slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, category } = await params;
  const a = await getAttachment(slug);
  if (!a || a.attachmentCategory !== category) return {};
  return { title: `${a.name} | ${(await getAttachmentCategory(category))?.name}`, description: `${a.name}: ${a.description}. Available from Niagara Equipment Supply.`, alternates: { canonical: `/attachments/${category}/${a.slug}` } };
}

export default async function AttachmentPage({ params }: { params: Promise<Params> }) {
  const { slug, category } = await params;
  const a = await getAttachment(slug);
  if (!a || a.attachmentCategory !== category) notFound();
  const cat = (await getAttachmentCategory(category))!;
  const { catalogue } = await getSiteContent();
  const fits = catalogue.machines.filter((m) => isAttachmentCompatible(a, m));

  return (
    <>
      <section className="border-b border-line">
        <Container className="py-8">
          <Breadcrumbs items={[{ href: "/attachments", label: "Attachments" }, { href: `/attachments/${cat.slug}`, label: cat.name }, { label: a.name }]} />
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <EquipmentImage image={a.images[0]} kind="attachment" alt={a.name} priority sizes="(max-width: 1024px) 100vw, 640px" className="border border-line bg-white" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-navy">{a.attachmentType}</p>
                {a.isPlaceholder && <Badge tone="warning">Sample data</Badge>}
              </div>
              <h1 className="display mt-2 text-charcoal">RIPPA {a.name}</h1>
              {(a.longDescription ?? a.description).split("\n\n").map((para, i) => <p key={i} className="mt-3 text-[16px] leading-relaxed text-charcoal/85">{para}</p>)}
              {a.plateType && <p className="mt-3 rounded-card border border-line bg-light/60 px-3 py-2 text-sm text-charcoal"><span className="font-bold">Mounting:</span> {plateLabels[a.plateType] ?? a.plateType}. Running a different plate? We convert plates and adapters so your attachments keep working across machines.</p>}
              <AttachmentDetailActions attachment={a} machines={catalogue.machines} />
              <div className="mt-6 border-t border-line pt-5">
                <h2 className="text-sm font-bold text-charcoal">Fits these machines</h2>
                {fits.length === 0 ? (
                  <p className="mt-1 text-sm text-grey">Compatibility to be confirmed. Ask our team about your model.</p>
                ) : (
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {fits.map((m) => (
                      <li key={m.id}><Link href={`/inventory/${m.category}/${m.slug}`} className="inline-flex h-8 items-center rounded-full bg-tint px-3 text-sm font-semibold text-navy hover:bg-navy hover:text-white">{m.modelName}</Link></li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
      {a.variants.length > 0 && (
        <section className="section-tight border-b border-line">
          <Container>
            <SectionHeading title="Compatibility guide" subtitle="Attachments are built per machine class: pin size, width and hydraulic flow differ. Use the table to find the version and part number for your model." rule={false} />
            <CompatibilityGuide attachment={a} machines={catalogue.machines} />
          </Container>
        </section>
      )}
      <section className="section-tight">
        <Container>
          <SectionHeading title={`More ${cat.name}`} link={{ href: `/attachments/${cat.slug}`, label: "View All" }} />
          <RelatedAttachments category={cat.slug} exclude={a.id} />
        </Container>
      </section>
      <CtaBand title="Ready to add it to your setup?" text="Add this attachment to your quote list or configure it inside the Excavator Builder." primary={{ href: "/builder/excavator", label: "Open Builder" }} />
    </>
  );
}

import { AttachmentCard } from "@/components/equipment/AttachmentCard";
async function RelatedAttachments({ category, exclude }: { category: string; exclude: string }) {
  const { catalogue } = await getSiteContent();
  const items = catalogue.attachments.filter((x) => x.attachmentCategory === category && x.id !== exclude).slice(0, 5);
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((x) => <li key={x.id}><AttachmentCard attachment={x} /></li>)}
    </ul>
  );
}
