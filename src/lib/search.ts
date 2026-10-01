import type { SiteContent } from "@/lib/catalogue";
import type { ImageAsset } from "@/lib/types";

export type HitType = "machine" | "attachment" | "part" | "post" | "lubricant" | "page";
export interface SearchHit { type: HitType; title: string; href: string; subtitle?: string; image?: ImageAsset; score: number }
export interface SearchGroup { type: HitType; label: string; hits: SearchHit[] }

const LABELS: Record<HitType, string> = { machine: "Equipment", attachment: "Attachments", part: "Parts", post: "Guides & news", lubricant: "Oil & lubricants", page: "Pages" };
const ORDER: HitType[] = ["machine", "attachment", "part", "page", "post", "lubricant"];

const PAGES = [
  { title: "RIPPA Service Centre", href: "/service", keywords: "service repair repairs warranty claim claims maintenance technician fix broken hydraulic leak" },
  { title: "RIPPA Parts Catalogue", href: "/parts", keywords: "parts part number filter filters hose hoses bucket teeth pins seals belts genuine" },
  { title: "Financing & leasing", href: "/financing", keywords: "finance financing lease leasing leaselink monthly payment payments pre-approval credit rates" },
  { title: "Oil & lubricants", href: "/lubricants", keywords: "oil lubricants chevron catalys hydraulic grease coolant def fluid" },
  { title: "Excavator Builder", href: "/builder/excavator", keywords: "build builder configure package excavator attachments bundle" },
  { title: "Skid Steer Builder", href: "/builder/skid-steer", keywords: "build builder configure package skid steer loader attachments bundle" },
  { title: "Compare models", href: "/compare", keywords: "compare comparison vs versus specs side by side" },
  { title: "Contact, hours & directions", href: "/contact", keywords: "contact hours address directions phone map email thorold location open" },
  { title: "Areas we serve", href: "/service-area", keywords: "delivery deliver niagara falls st catharines welland hamilton burlington fort erie grimsby area areas local near me" },
  { title: "About Niagara Equipment Supply", href: "/about", keywords: "about dealer team company who we are" },
  { title: "Blog & guides", href: "/blog", keywords: "blog guide guides news tips how to" },
  { title: "Quote list", href: "/quote", keywords: "quote request quote list cart checkout price pricing" },
];

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9"'./-]+/g, " ").trim();

function score(fields: { text?: string; weight: number }[], q: string, tokens: string[]): number {
  let total = 0;
  for (const f of fields) {
    if (!f.text) continue;
    const t = norm(f.text);
    if (!t) continue;
    if (t === q) total += f.weight * 6;
    else if (t.startsWith(q)) total += f.weight * 4;
    else if (t.includes(q)) total += f.weight * 3;
    let hit = 0;
    for (const tok of tokens) if (t.includes(tok)) hit++;
    if (hit) total += f.weight * (hit / tokens.length);
  }
  return total;
}

/** In-memory site search over the catalogue, parts, posts and static pages. Data is small, so no index is needed. */
export function searchSite(content: SiteContent, query: string, perGroup = 8): { groups: SearchGroup[]; total: number } {
  const q = norm(query);
  if (q.length < 2) return { groups: [], total: 0 };
  const tokens = q.split(/\s+/).filter((t) => t.length > 1);
  const hits: SearchHit[] = [];
  const { machines, attachments } = content.catalogue;

  for (const m of machines) {
    const s = score([{ text: m.modelName, weight: 10 }, { text: `${m.brand} ${m.modelName}`, weight: 8 }, { text: m.series, weight: 3 }, { text: m.shortDescription, weight: 2 }, { text: m.applications.join(" "), weight: 1 }, { text: m.engine, weight: 2 }], q, tokens);
    if (s > 0) hits.push({ type: "machine", title: `${m.brand} ${m.modelName}`, href: `/inventory/${m.category}/${m.slug}`, subtitle: m.shortDescription, image: m.images[0], score: s });
  }
  for (const a of attachments) {
    const variantText = a.variants.map((v) => `${v.label} ${v.sku ?? ""} ${v.widthOrSize ?? ""}`).join(" ");
    const s = score([{ text: a.name, weight: 9 }, { text: a.attachmentType, weight: 4 }, { text: variantText, weight: 5 }, { text: a.description, weight: 2 }], q, tokens);
    if (s > 0) hits.push({ type: "attachment", title: a.name, href: `/attachments/${a.attachmentCategory}/${a.slug}`, subtitle: `${a.variants.length} size${a.variants.length === 1 ? "" : "s"} · ${a.attachmentType}`, image: a.images[0], score: s });
  }
  for (const p of content.parts) {
    const sku = norm(p.sku);
    let s = score([{ text: p.name, weight: 8 }, { text: p.sku, weight: 6 }, { text: p.system, weight: 3 }, { text: p.description, weight: 2 }, { text: p.engineBrand, weight: 2 }], q, tokens);
    if (sku && sku === q.replace(/\s+/g, "")) s += 60;
    if (s > 0) hits.push({ type: "part", title: p.name, href: `/parts/item/${p.slug}`, subtitle: `Part ${p.sku} · ${p.system}`, image: p.image, score: s });
  }
  for (const p of content.posts) {
    const s = score([{ text: p.title, weight: 7 }, { text: p.excerpt, weight: 3 }, { text: p.tags.join(" "), weight: 3 }, { text: p.contentText.slice(0, 2000), weight: 1 }], q, tokens);
    if (s > 0) hits.push({ type: "post", title: p.title, href: `/blog/${p.slug}`, subtitle: p.excerpt, image: p.cover, score: s });
  }
  for (const l of content.lubricants) {
    const s = score([{ text: l.name, weight: 7 }, { text: l.brand, weight: 3 }, { text: l.category, weight: 3 }, { text: l.description, weight: 2 }, { text: l.rippaUse, weight: 2 }], q, tokens);
    if (s > 0) hits.push({ type: "lubricant", title: l.name, href: "/lubricants", subtitle: l.tagline ?? l.description, image: l.images[0], score: s });
  }
  for (const p of PAGES) {
    const s = score([{ text: p.title, weight: 6 }, { text: p.keywords, weight: 3 }], q, tokens);
    if (s > 0) hits.push({ type: "page", title: p.title, href: p.href, score: s });
  }

  const groups = ORDER.map((type) => ({ type, label: LABELS[type], hits: hits.filter((h) => h.type === type).sort((a, b) => b.score - a.score).slice(0, perGroup) })).filter((g) => g.hits.length);
  return { groups, total: groups.reduce((n, g) => n + g.hits.length, 0) };
}
