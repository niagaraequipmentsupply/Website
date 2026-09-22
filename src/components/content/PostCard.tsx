import Link from "next/link";
import Image from "next/image";
import { PlayCircle, Clock } from "lucide-react";
import type { Post } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

export const postCategoryLabels: Record<string, string> = { guide: "How-to guide", "field-call": "Field call", maintenance: "Maintenance", buying: "Buying advice", attachments: "Attachments", parts: "Parts", lubricants: "Lubricants", news: "News" };
export const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });

export function PostCard({ post, large }: { post: Post; large?: boolean }) {
  return (
    <article className={`flex h-full flex-col overflow-hidden rounded-card border border-line bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-electric hover:shadow-lift ${large ? "md:grid md:grid-cols-2" : ""}`}>
      <Link href={`/blog/${post.slug}`} className={`relative block bg-light ${large ? "aspect-[16/10] md:aspect-auto md:h-full" : "aspect-[16/9]"}`}>
        {post.cover ? <Image src={post.cover.src} alt={post.cover.alt} fill sizes={large ? "(max-width: 768px) 100vw, 640px" : "(max-width: 768px) 100vw, 420px"} className="object-cover" /> : <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold uppercase tracking-[0.18em] text-grey">{postCategoryLabels[post.category] ?? post.category}</span>}
        {post.videoUrl && <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-charcoal/85 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white"><PlayCircle className="size-3.5" aria-hidden />Video</span>}
      </Link>
      <div className={`flex flex-1 flex-col ${large ? "p-6 md:p-8" : "p-5"}`}>
        <div className="flex flex-wrap items-center gap-2 text-[12px] text-grey">
          <Badge tone="grey">{postCategoryLabels[post.category] ?? post.category}</Badge>
          <time dateTime={post.publishedAt}>{fmtDate(post.publishedAt)}</time>
          {post.readMinutes && <span className="inline-flex items-center gap-1"><Clock className="size-3.5" aria-hidden />{post.readMinutes} min</span>}
        </div>
        <h3 className={`mt-2 font-bold text-charcoal ${large ? "display text-3xl" : "text-lg leading-snug"}`}><Link href={`/blog/${post.slug}`} className="hover:text-navy">{post.title}</Link></h3>
        <p className={`mt-2 text-grey ${large ? "text-[15px]" : "line-clamp-3 text-sm"}`}>{post.excerpt}</p>
        <Link href={`/blog/${post.slug}`} className="mt-auto pt-4 text-sm font-semibold text-navy hover:text-electric">Read {post.videoUrl ? "& watch" : "more"} →</Link>
      </div>
    </article>
  );
}
