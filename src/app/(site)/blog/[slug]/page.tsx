import type { Metadata } from "next";
import { metaDescription } from "@/lib/format";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PostCard, postCategoryLabels, fmtDate } from "@/components/content/PostCard";
import { SocialStrip } from "@/components/content/SocialStrip";
import { ContentRequest } from "@/components/content/ContentRequest";
import { getSiteContent } from "@/lib/catalogue";

type Params = { slug: string };
export async function generateStaticParams() { const { posts } = await getSiteContent(); return posts.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const { posts, site } = await getSiteContent(); const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title, description: metaDescription(post.excerpt), alternates: { canonical: `/blog/${post.slug}` },
    authors: [{ name: site.name, url: "/about" }],
    openGraph: { type: "article", publishedTime: post.publishedAt, modifiedTime: post.updatedAt, authors: [site.name], images: post.cover ? [{ url: post.cover.src, alt: post.cover.alt }] : undefined },
  };
}

const ytId = (url: string) => url.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/)?.[1];

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { posts, catalogue, site } = await getSiteContent();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  const pageUrl = `${site.url}/blog/${post.slug}`;
  const related = catalogue.machines.filter((m) => post.relatedMachineIds.includes(m.id));
  const more = posts.filter((p) => p.id !== post.id && (p.category === post.category || p.relatedMachineIds.some((id) => post.relatedMachineIds.includes(id)))).slice(0, 3);
  const video = post.videoUrl ? ytId(post.videoUrl) : undefined;
  const jsonLd = { "@context": "https://schema.org", "@type": post.category === "guide" || post.category === "maintenance" ? "HowTo" : "Article", headline: post.title, description: post.excerpt, datePublished: post.publishedAt, author: { "@type": "Organization", name: site.name }, publisher: { "@type": "Organization", name: site.name, url: site.url, logo: { "@type": "ImageObject", url: `${site.url}/brand/logo-light.png` } }, dateModified: post.updatedAt ?? post.publishedAt, mainEntityOfPage: pageUrl, url: pageUrl, image: post.cover ? [post.cover.src.startsWith("http") ? post.cover.src : `${site.url}${post.cover.src}`] : undefined, ...(video ? { video: { "@type": "VideoObject", name: post.title, description: post.excerpt, embedUrl: `https://www.youtube.com/embed/${video}`, uploadDate: post.publishedAt } } : {}) };

  return (
    <>
      <article>
        <Container className="max-w-4xl py-8">
          <Breadcrumbs items={[{ href: "/blog", label: "Blog" }, { label: post.title }]} />
          <div className="mt-5 flex flex-wrap items-center gap-2 text-[13px] text-grey">
            <Badge>{postCategoryLabels[post.category] ?? post.category}</Badge>
            <time dateTime={post.publishedAt}>{fmtDate(post.publishedAt)}</time>
            {post.readMinutes && <span className="inline-flex items-center gap-1"><Clock className="size-3.5" aria-hidden />{post.readMinutes} min read</span>}
            {post.author && <span>· By {post.author}</span>}
          </div>
          <h1 className="display mt-3 text-charcoal">{post.title}</h1>
          <p className="mt-3 text-[17px] leading-relaxed text-charcoal/85">{post.excerpt}</p>
          {related.length > 0 && (
            <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-grey">Applies to: {related.map((m) => <Link key={m.id} href={`/inventory/${m.category}/${m.slug}`} className="inline-flex h-7 items-center rounded-full bg-tint px-3 text-[12px] font-semibold text-navy hover:bg-navy hover:text-white">{m.modelName}</Link>)}</p>
          )}
          {video ? (
            <div className="mt-6 aspect-video overflow-hidden rounded-card border border-line bg-charcoal"><iframe src={`https://www.youtube-nocookie.com/embed/${video}`} title={post.title} className="h-full w-full" allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" /></div>
          ) : post.cover ? (
            <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-card border border-line bg-light"><Image src={post.cover.src} alt={post.cover.alt} fill priority sizes="(max-width: 896px) 100vw, 896px" className="object-cover" /></div>
          ) : null}
          <div className="prose-nes mt-8" dangerouslySetInnerHTML={{ __html: post.contentHtml ?? "" }} />
          {post.tags.length > 0 && <ul className="mt-8 flex flex-wrap gap-2">{post.tags.map((t) => <li key={t} className="rounded-full border border-line px-3 py-1 text-[12px] font-semibold text-grey">#{t}</li>)}</ul>}
          <div className="mt-6 rounded-card border border-line bg-light/60 p-5 md:flex md:items-center md:justify-between md:gap-6">
            <div>
              <p className="font-bold text-charcoal">Rather have a certified technician do it?</p>
              <p className="text-sm text-grey">We service RIPPA machines in our shop in {site.address.city} and on site across Niagara. Parts ship Canada-wide.</p>
            </div>
            <div className="mt-3 flex shrink-0 gap-2 md:mt-0"><Button href="/service#book" size="sm" arrow>Book service</Button><Button href={site.phoneHref} variant="secondary" size="sm" icon={<Phone className="size-4" aria-hidden />}>Call</Button></div>
          </div>
        </Container>
      </article>
      <section className="section-tight bg-light/60">
        <Container className="grid gap-8 lg:grid-cols-[3fr_2fr]">
          <ContentRequest compact />
          <SocialStrip site={site} compact />
        </Container>
      </section>
      {more.length > 0 && (
        <section className="section-tight">
          <Container>
            <h2 className="display mb-4 text-2xl text-charcoal">More from the shop</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{more.map((p) => <li key={p.id}><PostCard post={p} /></li>)}</ul>
          </Container>
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
