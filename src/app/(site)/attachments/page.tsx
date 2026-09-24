import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AttachmentCard } from "@/components/equipment/AttachmentCard";
import { CtaBand } from "@/components/home/CtaBand";
import { getSiteContent } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "RIPPA Attachments for Sale in Ontario | Excavator, Skid Steer & Loader",
  description: "Buckets, thumbs, augers, rakes, forks, cutters and more for RIPPA excavators and skid steers. Add attachments to your quote.",
  alternates: { canonical: "/attachments" },
};

export default async function AttachmentsPage() {
  const { attachmentCategories, catalogue } = await getSiteContent();
  const getAttachmentsByCategory = (slug: string) => catalogue.attachments.filter((a) => a.attachmentCategory === slug);
  return (
    <>
      <PageHero title="Attachments" text="Get more from every machine. Browse attachments by machine family, or use the Excavator Builder to see only what fits your model." crumbs={[{ label: "Attachments" }]} />
      {[...attachmentCategories].sort((a, b) => a.sortOrder - b.sortOrder).map((cat) => {
        const items = getAttachmentsByCategory(cat.slug);
        return (
          <section key={cat.slug} className="section-tight">
            <Container>
              <SectionHeading title={cat.name} link={{ href: `/attachments/${cat.slug}`, label: "View All" }} />
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {items.slice(0, 5).map((a) => <li key={a.id}><AttachmentCard attachment={a} showQuote /></li>)}
              </ul>
              <Link href={`/attachments/${cat.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-electric lg:hidden">View all {cat.name.toLowerCase()} <ArrowRight className="size-4" aria-hidden /></Link>
            </Container>
          </section>
        );
      })}
      <CtaBand title="Need help matching an attachment?" text="Tell us your model and the job. We'll confirm fit, coupler and hydraulic requirements." />
    </>
  );
}
