import type { Metadata } from "next";
import { site } from "@/data/site";

/** The layout's title template appends this to every page title that is not marked absolute. */
export const TITLE_SUFFIX = ` | ${site.name}`;
/** Google shows roughly 60 characters of a title tag; audit tools flag anything over 70. */
export const TITLE_MAX_WITH_BRAND = 66;
export const TITLE_MAX_ABSOLUTE = 70;
export const DESCRIPTION_MIN = 120;
export const DESCRIPTION_MAX = 160;

export interface FittedTitle {
  /** Value for `Metadata.title` (plain string → template adds the brand; `{ absolute }` → used as-is). */
  title: Metadata["title"];
  /** The title exactly as it will render, for og:title / twitter:title. */
  text: string;
}

/**
 * Pick the first candidate that fits together with the brand suffix; otherwise the first that fits on its own
 * (rendered as an absolute title, no suffix); otherwise the first candidate trimmed at a word boundary.
 * Pass candidates from most descriptive to shortest, e.g. ["RIPPA R10 ECO Excavator for Sale in Ontario", "RIPPA R10 ECO Excavator for Sale"].
 */
export function fitTitle(candidates: string[]): FittedTitle {
  const list = candidates.map((c) => c.replace(/\s+/g, " ").trim()).filter(Boolean);
  for (const c of list) if (c.length + TITLE_SUFFIX.length <= TITLE_MAX_WITH_BRAND) return { title: c, text: `${c}${TITLE_SUFFIX}` };
  for (const c of list) if (c.length <= TITLE_MAX_ABSOLUTE) return { title: { absolute: c }, text: c };
  const first = list[0] ?? site.name;
  const cut = first.slice(0, TITLE_MAX_ABSOLUTE - 1);
  const word = cut.lastIndexOf(" ");
  const text = `${cut.slice(0, word > 40 ? word : cut.length).replace(/[\s,;:·|–-]+$/, "")}…`;
  return { title: { absolute: text }, text };
}

/** Trim a description to the limit at a sentence end, else a word boundary. */
export function trimDescription(text: string, max = DESCRIPTION_MAX): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const sentence = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  if (sentence >= 80) return cut.slice(0, sentence + 1);
  const word = cut.lastIndexOf(" ");
  return `${cut.slice(0, word > 100 ? word : max - 1).replace(/[,;:\s]+$/, "")}…`;
}

/**
 * Meta description = base sentence(s) + the longest closing line that still fits in 160 characters.
 * Give closers from longest to shortest so short bases get a full closer and long bases a brief one;
 * a base that already fills the space is trimmed at a sentence or word instead.
 */
export function describe(base: string, closers: string[] = []): string {
  let b = base.replace(/\s+/g, " ").trim();
  // A base longer than the limit is cut to a whole sentence first, so a closer can still follow it.
  if (b.length > DESCRIPTION_MAX) b = trimDescription(b);
  if (/[.!?]$/.test(b)) {
    for (const c of closers) {
      const joined = `${b} ${c.trim()}`.trim();
      if (joined.length <= DESCRIPTION_MAX) return joined;
    }
  }
  return b;
}

/** Standard closing lines for pages that sell or support RIPPA equipment, longest first. */
export const CLOSERS = {
  sales: ["Written quotes and delivery across Ontario from Niagara Equipment Supply, Thorold.", "Written quotes and Ontario-wide delivery from Niagara Equipment Supply.", "Quoted in writing and delivered across Ontario.", "Quoted and delivered across Ontario."],
  attachments: ["Fitment confirmed and quoted in writing by Niagara Equipment Supply in Thorold, Ontario.", "Fitment confirmed and quoted in writing by Niagara Equipment Supply.", "Fitment confirmed by Niagara Equipment Supply, Thorold.", "Quoted in writing by Niagara Equipment Supply."],
  parts: ["Request it from Niagara Equipment Supply in Thorold; genuine parts shipped across Canada.", "Request it from Niagara Equipment Supply; shipped across Canada.", "Shipped across Canada by Niagara Equipment Supply.", "Shipped across Canada."],
  guides: ["A guide from the RIPPA Service Centre at Niagara Equipment Supply in Thorold, Ontario.", "From the RIPPA Service Centre at Niagara Equipment Supply, Thorold.", "From the RIPPA Service Centre in Thorold, Ontario.", "From the RIPPA Service Centre."],
};

export interface PageMetaInput {
  /** Title candidates, most descriptive first; see fitTitle. */
  titles: string[];
  description: string;
  /** Canonical path, e.g. "/inventory/excavators/r10-eco". Query strings are allowed for canonical compare URLs. */
  path: string;
  /** Social image; omit to use the site-wide default Open Graph image. */
  image?: { src: string; alt?: string } | null;
  article?: { publishedTime?: string; modifiedTime?: string };
  noindex?: boolean;
  keywords?: string[];
}

/**
 * One call for every page's SEO head: fitted title, bounded description, canonical, full Open Graph
 * (type, url, site name, locale, title, description, image) and Twitter card, all consistent with each other.
 */
/**
 * Site-wide social image (1200×630, rendered once from opengraph-image.tsx). Needed explicitly because a page-level
 * `openGraph` object replaces the layout's, which is where Next attaches the file-based default image.
 */
export const DEFAULT_OG_IMAGE = { src: "/brand/og-default.png", alt: `${site.name}, official RIPPA dealer in Thorold, Ontario`, width: 1200, height: 630 };

export function pageMeta(input: PageMetaInput): Metadata {
  const { title, text } = fitTitle(input.titles);
  const description = trimDescription(input.description);
  const url = `${site.url}${input.path}`;
  const image = input.image?.src ? { url: input.image.src, alt: input.image.alt || text } : { url: DEFAULT_OG_IMAGE.src, alt: DEFAULT_OG_IMAGE.alt, width: DEFAULT_OG_IMAGE.width, height: DEFAULT_OG_IMAGE.height };
  const openGraph: NonNullable<Metadata["openGraph"]> = input.article
    ? { type: "article", url, siteName: site.name, locale: "en_CA", title: text, description, images: [image], publishedTime: input.article.publishedTime, modifiedTime: input.article.modifiedTime, authors: [site.name] }
    : { type: "website", url, siteName: site.name, locale: "en_CA", title: text, description, images: [image] };
  return {
    title,
    description,
    alternates: { canonical: input.path, types: { "application/rss+xml": `${site.url}/blog/feed.xml` } },
    ...(input.keywords?.length ? { keywords: input.keywords } : {}),
    ...(input.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph,
    twitter: { card: "summary_large_image", title: text, description, images: [image.url] },
  };
}
