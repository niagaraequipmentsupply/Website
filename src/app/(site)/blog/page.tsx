import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostCard, postCategoryLabels } from "@/components/content/PostCard";
import { SocialStrip } from "@/components/content/SocialStrip";
import { ContentRequest } from "@/components/content/ContentRequest";
import { getSiteContent } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "RIPPA Service Guides, Field Calls & How-To Videos",
  description: "DIY maintenance guides, field-call write-ups and technical help for RIPPA mini excavators and skid steers from certified technicians at Niagara Equipment Supply, Ontario.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string; model?: string }> }) {
  const { category, model } = await searchParams;
  const { posts, site, catalogue } = await getSiteContent();
  const machine = model ? catalogue.machines.find((m) => m.slug === model) : undefined;
  const cats = Array.from(new Set(posts.map((p) => p.category)));
  let list = category ? posts.filter((p) => p.category === category) : posts;
  if (machine) list = list.filter((p) => p.relatedMachineIds.includes(machine.id));
  const featured = !category ? list.find((p) => p.featured) ?? list[0] : undefined;
  const rest = featured ? list.filter((p) => p.id !== featured.id) : list;

  return (
    <>
      <PageHero title={<>The Shop <span className="text-navy">Blog</span></>} text="We're a service-first dealership. Everything our certified RIPPA technicians learn in the shop and on field calls gets written up here so you can keep your machine working, whether you bought it from us or not." crumbs={[{ label: "Blog" }]} />
      <section className="section-tight">
        <Container>
          <ul className="flex flex-wrap gap-2" aria-label="Categories">
            <li><Link href="/blog" className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-semibold ${!category ? "border-navy bg-navy text-white" : "border-line text-navy hover:border-electric"}`}>All posts</Link></li>
            {cats.map((c) => <li key={c}><Link href={`/blog?category=${c}`} className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-semibold ${category === c ? "border-navy bg-navy text-white" : "border-line text-navy hover:border-electric"}`}>{postCategoryLabels[c] ?? c}</Link></li>)}
          </ul>
          {machine && <p className="mt-4 text-sm text-grey">Showing posts for the <strong className="text-charcoal">{machine.modelName}</strong>. <Link href="/blog" className="font-semibold text-navy">Clear</Link></p>}
          {featured && <div className="mt-6"><PostCard post={featured} large /></div>}
          {rest.length > 0 ? (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{rest.map((p) => <li key={p.id}><PostCard post={p} /></li>)}</ul>
          ) : !featured && <p className="mt-6 rounded-card border border-dashed border-line p-8 text-center text-grey">First guides are being written. Tell us what you want covered below.</p>}
        </Container>
      </section>
      <section className="section-tight bg-light/60">
        <Container className="grid gap-8 lg:grid-cols-[3fr_2fr]">
          <ContentRequest />
          <div>
            <SectionHeading title="Follow the shop" subtitle="Field calls, deliveries and repairs as they happen." rule={false} />
            <SocialStrip site={site} compact />
          </div>
        </Container>
      </section>
    </>
  );
}
