import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getSiteContent } from "@/lib/catalogue";
import { isThin } from "@/lib/machines";
import { serviceAreas } from "@/data/service-areas";
import { compareHref } from "@/lib/compare";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;
  const { categories, attachmentCategories, posts, parts, catalogue: { machines, attachments } } = await getSiteContent();
  const statics = ["", "/inventory", "/attachments", "/builder/excavator", "/builder/skid-steer", "/parts", "/financing", "/service", "/service/parts", "/lubricants", "/blog", "/about", "/contact", "/quote"];
  return [
    ...statics.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...["/service-area", "/compare", "/privacy", "/terms", "/accessibility"].map((p) => ({ url: `${base}${p}`, changeFrequency: "monthly" as const, priority: p === "/service-area" || p === "/compare" ? 0.7 : 0.3 })),
    ...serviceAreas.map((a) => ({ url: `${base}/service-area/${a.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...categories.map((c) => { const slugs = machines.filter((m) => m.category === c.slug && !isThin(m)).slice(0, 3).map((m) => m.slug); return slugs.length >= 2 ? [{ url: `${base}${compareHref(slugs)}`, changeFrequency: "monthly" as const, priority: 0.5 }] : []; }).flat(),
    ...categories.map((c) => ({ url: `${base}/inventory/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...machines.filter((m) => !isThin(m)).map((m) => ({ url: `${base}/inventory/${m.category}/${m.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...attachmentCategories.map((c) => ({ url: `${base}/attachments/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...attachments.map((a) => ({ url: `${base}/attachments/${a.attachmentCategory}/${a.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.publishedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...machines.filter((m) => parts.some((p) => p.compatibleModelIds.includes(m.id))).map((m) => ({ url: `${base}/parts/${m.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...parts.map((p) => ({ url: `${base}/parts/item/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.4 })),
  ];
}
