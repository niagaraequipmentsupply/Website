import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getSiteContent } from "@/lib/catalogue";
import { isThin } from "@/lib/machines";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url;
  const { categories, attachmentCategories, posts, catalogue: { machines, attachments } } = await getSiteContent();
  const statics = ["", "/inventory", "/attachments", "/builder/excavator", "/builder/skid-steer", "/financing", "/service", "/service/parts", "/lubricants", "/blog", "/about", "/contact", "/quote"];
  return [
    ...statics.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...categories.map((c) => ({ url: `${base}/inventory/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...machines.filter((m) => !isThin(m)).map((m) => ({ url: `${base}/inventory/${m.category}/${m.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...attachmentCategories.map((c) => ({ url: `${base}/attachments/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...attachments.map((a) => ({ url: `${base}/attachments/${a.attachmentCategory}/${a.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: p.publishedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
