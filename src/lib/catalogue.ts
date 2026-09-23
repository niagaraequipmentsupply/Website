import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Attachment as PAttachment, Machine as PMachine, Media, Document as PDocument, Addon as PAddon, Warranty as PWarranty, Category as PCategory, FinancePromo as PPromo, Post as PPost, Lubricant as PLubricant } from "@/payload-types";
import type { Attachment, AttachmentCategory, Category, DocumentAsset, FinancingConfig, ImageAsset, Machine, Addon, WarrantyOption, NavGroup, FinancePromo, ApplicationFit, Post, Lubricant } from "@/lib/types";
import type { Catalogue } from "@/lib/pricing";
import { slugify } from "@/lib/format";
import { presentMachine, presentAttachment, humanizeUnits } from "@/lib/units";
import { site as siteDefaults } from "@/data/site";
import * as seed from "@/data";
import { categories as seedCategories, attachmentCategories as seedAttachmentCategories } from "@/data/categories";
import { financing as seedFinancing, financePromos as seedPromos } from "@/data/financing";

/**
 * Catalogue data access. Reads from Payload (SQLite/Postgres) and maps to the site's typed models
 * so components never see CMS shapes. Falls back to the seed data in `src/data` while the
 * database is empty so the site always renders. Swap this file to change the data source.
 */

export const getPayloadClient = cache(async () => getPayload({ config }));

const relId = (v: number | { id: number } | null | undefined) => (v == null ? undefined : String(typeof v === "number" ? v : v.id));
const relIds = (v: (number | { id: number })[] | null | undefined) => (v ?? []).map(relId).filter((x): x is string => !!x);

function mapImage(m: number | Media | null | undefined, alt: string): ImageAsset | undefined {
  if (!m || typeof m === "number" || !m.url) return undefined;
  const best = m.sizes?.card?.url ?? m.url;
  return { src: best, alt: m.alt || alt, width: m.sizes?.card?.width ?? m.width ?? undefined, height: m.sizes?.card?.height ?? m.height ?? undefined };
}
function mapImages(arr: { image: number | Media }[] | null | undefined, alt: string): ImageAsset[] {
  return (arr ?? []).map((i) => mapImage(i.image, alt)).filter((x): x is ImageAsset => !!x);
}
function mapDocs(arr: { label: string; file: number | PDocument }[] | null | undefined): DocumentAsset[] {
  return (arr ?? []).flatMap((d) => (typeof d.file === "number" || !d.file?.url ? [] : [{ label: d.label, url: d.file.url, kind: d.file.kind ?? "other" }]));
}
const stock = (v: PMachine["inStock"]) => (v === "in-stock" ? true : v === "order" ? false : undefined);

function richTextToPlain(rt: PMachine["longDescription"]): string | undefined {
  if (!rt?.root?.children) return undefined;
  const walk = (nodes: unknown[]): string =>
    nodes.map((n) => { const node = n as { text?: string; children?: unknown[] }; return node.text ?? (node.children ? walk(node.children) : ""); }).join("");
  const paras = rt.root.children.map((c) => walk((c as { children?: unknown[] }).children ?? [])).filter(Boolean);
  return paras.length ? paras.join("\n\n") : undefined;
}

export function mapMachine(d: PMachine): Machine {
  const name = `${d.brand} ${d.modelName}`;
  const configurations = (d.configurations ?? []).map((c, i) => ({ id: c.id ?? `${d.id}-cfg-${i}`, label: c.label, engine: c.engine ?? undefined, horsepower: c.horsepower ?? undefined, operatingWeight: c.operatingWeight ?? undefined, price: c.price ?? undefined, sku: c.sku ?? undefined, inStock: c.inStock ?? undefined }));
  return {
    id: String(d.id), slug: d.slug, category: d.category, modelName: d.modelName, series: d.series ?? undefined, brand: d.brand,
    shortDescription: d.shortDescription, longDescription: richTextToPlain(d.longDescription), images: mapImages(d.images, name), documents: mapDocs(d.documents),
    specs: (d.specs ?? []).map((s) => ({ label: s.label, value: s.value, imperial: s.imperial ?? undefined, group: s.group ?? "general", icon: s.icon ?? "generic", highlight: !!s.highlight })),
    features: (d.features ?? []).map((f) => ({ eyebrow: f.eyebrow ?? undefined, title: f.title, text: f.text, image: mapImage(f.image, f.title) })),
    standardEquipment: (d.standardEquipment ?? []).map((x) => x.text), applications: (d.applications ?? []).map((x) => x.text),
    faqs: (d.faqs ?? []).map((f) => ({ question: f.question, answer: f.answer })), certifications: (d.certifications ?? []).map((x) => x.text),
    targetUsers: d.targetUsers ?? undefined, noiseLevel: d.noiseLevel ?? undefined, indoorUse: !!d.indoorUse, plateType: d.plateType ?? undefined, plateNote: d.plateNote ?? undefined,
    applicationFit: (d.applicationFit ?? []).map((a) => ({ application: a.application, rating: Number(a.rating) as ApplicationFit["rating"], attachments: a.attachments ?? undefined })),
    checklist: (d.checklist ?? []).map((c) => ({ group: c.group, feature: c.feature, status: c.status, note: c.note ?? undefined })),
    configurations, basePrice: d.basePrice ?? undefined, promoPrice: d.promoPrice ?? undefined, showPrice: d.showPrice ?? true,
    warranty: d.warranty ?? undefined, engine: configurations[0]?.engine, operatingWeight: configurations[0]?.operatingWeight,
    featured: !!d.featured, inStock: stock(d.inStock), builderEnabled: !!d.builderEnabled, badge: d.badge ?? undefined, sortOrder: d.sortOrder ?? 100,
  };
}

export function mapAttachment(d: PAttachment): Attachment {
  return {
    id: String(d.id), slug: d.slug, attachmentCategory: d.attachmentCategory, attachmentType: d.attachmentType, name: d.name, description: d.description,
    longDescription: richTextToPlain(d.longDescription), images: mapImages(d.images, d.name), documents: mapDocs(d.documents),
    compatibleModelIds: relIds(d.compatibleModels), compatibleCategories: d.compatibleCategories ?? [], plateType: d.plateType ?? undefined, sourceUrl: d.sourceUrl ?? undefined,
    variants: (d.variants ?? []).map((v, i) => ({ id: v.id ?? `${d.id}-v-${i}`, label: v.label, widthOrSize: v.widthOrSize ?? undefined, sku: v.sku ?? undefined, price: v.price ?? undefined, compatibleModelIds: relIds(v.compatibleModels), plateType: v.plateType ?? undefined })),
    basePrice: d.basePrice ?? undefined, showPrice: d.showPrice ?? true, supportsQuantity: !!d.supportsQuantity, featured: !!d.featured, inStock: stock(d.inStock), sortOrder: d.sortOrder ?? 100,
  };
}

export function mapAddon(d: PAddon): Addon {
  return {
    id: String(d.id), name: d.name, type: d.type, shortDescription: d.shortDescription, fullDescription: d.fullDescription ?? undefined, price: d.price ?? undefined, quoteRequired: !!d.quoteRequired,
    compatibleModelIds: d.allModels ? "all" : relIds(d.compatibleModels), selectable: d.selectable ?? true, defaultSelected: !!d.defaultSelected, icon: d.icon ?? "shield", sortOrder: d.sortOrder ?? 100,
  };
}
export function mapWarranty(d: PWarranty): WarrantyOption {
  return { id: String(d.id), name: d.name, termMonths: d.termMonths, coverageSummary: d.coverageSummary, eligibleModelIds: d.allModels ? "all" : relIds(d.eligibleModels), price: d.price ?? undefined, financeEligible: d.financeEligible ?? true, sortOrder: d.sortOrder ?? 100 };
}

export function mapPromo(d: PPromo): FinancePromo {
  return {
    id: String(d.id), title: d.title, kind: d.kind, badge: d.badge ?? undefined, summary: d.summary, highlights: (d.highlights ?? []).map((h) => h.text), terms: d.terms ?? undefined,
    startDate: d.startDate ?? undefined, endDate: d.endDate ?? undefined, eligibleModelIds: d.allModels ? "all" : relIds(d.eligibleModels),
    ctaLabel: d.ctaLabel || "Get pre-approved", ctaHref: d.ctaHref || "#apply", featured: !!d.featured, sortOrder: d.sortOrder ?? 100,
  };
}

/** Lexical rich text → HTML (paragraphs, headings, lists, bold/italic, links). Enough for blog posts. */
export function richTextToHtml(rt: PMachine["longDescription"]): string {
  if (!rt?.root?.children) return "";
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const inline = (nodes: unknown[]): string => nodes.map((n) => {
    const node = n as { type?: string; text?: string; format?: number; children?: unknown[]; fields?: { url?: string }; url?: string };
    if (node.type === "text") { let t = esc(node.text ?? ""); const f = node.format ?? 0; if (f & 1) t = `<strong>${t}</strong>`; if (f & 2) t = `<em>${t}</em>`; if (f & 16) t = `<code>${t}</code>`; return t; }
    if (node.type === "linebreak") return "<br />";
    if (node.type === "link" || node.type === "autolink") { const url = node.fields?.url ?? node.url ?? "#"; return `<a href="${esc(url)}">${inline(node.children ?? [])}</a>`; }
    return inline(node.children ?? []);
  }).join("");
  const block = (n: unknown): string => {
    const node = n as { type?: string; tag?: string; listType?: string; children?: unknown[] };
    switch (node.type) {
      case "heading": { const tag = ["h2", "h3", "h4"].includes(node.tag ?? "") ? node.tag : "h2"; return `<${tag}>${inline(node.children ?? [])}</${tag}>`; }
      case "list": { const tag = node.listType === "number" ? "ol" : "ul"; return `<${tag}>${(node.children ?? []).map((li) => `<li>${inline((li as { children?: unknown[] }).children ?? [])}</li>`).join("")}</${tag}>`; }
      case "quote": return `<blockquote>${inline(node.children ?? [])}</blockquote>`;
      case "horizontalrule": return "<hr />";
      default: { const html = inline(node.children ?? []); return html.trim() ? `<p>${html}</p>` : ""; }
    }
  };
  return rt.root.children.map(block).join("\n");
}

export function mapPost(d: PPost): Post {
  return {
    id: String(d.id), slug: d.slug, title: d.title, category: d.category, excerpt: d.excerpt, publishedAt: d.publishedAt, cover: mapImage(d.cover, d.title), videoUrl: d.videoUrl ?? undefined,
    contentText: richTextToPlain(d.content) ?? "", contentHtml: richTextToHtml(d.content), relatedMachineIds: relIds(d.relatedMachines), tags: (d.tags ?? []).map((t) => t.tag),
    readMinutes: d.readMinutes ?? undefined, featured: !!d.featured, author: d.author ?? undefined,
  };
}
export function mapLubricant(d: PLubricant): Lubricant {
  return {
    id: String(d.id), slug: d.slug, name: d.name, brand: d.brand || "Chevron", category: d.category, tagline: d.tagline ?? undefined, description: d.description, grades: d.grades ?? undefined,
    applications: (d.applications ?? []).map((a) => a.text), packaging: d.packaging ?? [], approvals: d.approvals ?? undefined, rippaUse: d.rippaUse ?? undefined,
    images: mapImages(d.images, d.name), documents: mapDocs(d.documents), featured: !!d.featured, sortOrder: d.sortOrder ?? 100,
  };
}

/** Promo is live today (inclusive of start/end dates). */
export const promoIsLive = (p: FinancePromo, now = new Date()) =>
  (!p.startDate || new Date(p.startDate) <= now) && (!p.endDate || new Date(p.endDate).getTime() + 86_400_000 > now.getTime());

const bySort = <T extends { sortOrder: number }>(a: T, b: T) => a.sortOrder - b.sortOrder;

export interface SiteContent {
  catalogue: Catalogue;
  categories: Category[];
  attachmentCategories: AttachmentCategory[];
  financing: FinancingConfig;
  /** Live financing promotions and programs. */
  financePromos: FinancePromo[];
  posts: Post[];
  lubricants: Lubricant[];
  site: typeof siteDefaults & { hoursList: { day: string; time: string }[] };
  nav: NavGroup[];
  /** True while rendering from seed data (database empty). */
  usingSeed: boolean;
}

/** Load everything the site needs, once per request. */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  let catalogue: Catalogue = seed.catalogue;
  let categories = seedCategories;
  let attachmentCategories = seedAttachmentCategories;
  let financing = seedFinancing;
  let financePromos: FinancePromo[] = seedPromos;
  let posts: Post[] = [];
  let lubricants: Lubricant[] = [];
  let site: SiteContent["site"] = { ...siteDefaults, hoursList: [...siteDefaults.hours] };
  let usingSeed = true;

  try {
    const payload = await getPayloadClient();
    const [machines, attachments, addons, warranties, cats, settings, fin, promos, postDocs, lubeDocs] = await Promise.all([
      payload.find({ collection: "machines", limit: 500, depth: 1, sort: "sortOrder" }),
      payload.find({ collection: "attachments", limit: 500, depth: 1, sort: "sortOrder" }),
      payload.find({ collection: "addons", limit: 100, depth: 0, sort: "sortOrder" }),
      payload.find({ collection: "warranties", limit: 100, depth: 0, sort: "sortOrder" }),
      payload.find({ collection: "categories", limit: 50, depth: 1, sort: "sortOrder" }),
      payload.findGlobal({ slug: "site-settings" }),
      payload.findGlobal({ slug: "financing" }),
      payload.find({ collection: "finance-promos", limit: 100, depth: 0, sort: "sortOrder", where: { active: { equals: true } } }),
      payload.find({ collection: "posts", limit: 200, depth: 1, sort: "-publishedAt" }),
      payload.find({ collection: "lubricants", limit: 300, depth: 1, sort: "sortOrder" }),
    ]);
    posts = postDocs.docs.map(mapPost);
    lubricants = lubeDocs.docs.map(mapLubricant).sort(bySort);
    if (machines.totalDocs > 0) {
      usingSeed = false;
      financePromos = promos.docs.map(mapPromo);
      catalogue = {
        machines: machines.docs.map(mapMachine).sort(bySort),
        attachments: attachments.docs.map(mapAttachment).sort(bySort),
        addons: addons.docs.map(mapAddon).sort(bySort),
        warranties: warranties.docs.map(mapWarranty).sort(bySort),
      };
      const mapCat = (c: PCategory) => ({
        name: c.name, shortName: c.shortName || c.name, description: c.description, image: mapImage(c.image, c.name), sortOrder: c.sortOrder ?? 100,
        intro: c.intro ?? undefined,
        buyingGuide: (c.buyingGuide ?? []).map((b) => ({ title: b.title, text: b.text, modelIds: relIds(b.models) })),
        highlights: (c.highlights ?? []).map((h) => ({ title: h.title, text: h.text })),
        faqs: (c.faqs ?? []).map((f) => ({ question: f.question, answer: f.answer })),
      });
      const machineCats = cats.docs.filter((c) => c.kind === "machine");
      const attCats = cats.docs.filter((c) => c.kind === "attachment");
      if (machineCats.length) categories = machineCats.map((c) => ({ slug: c.slug as Category["slug"], ...mapCat(c) })).sort(bySort);
      if (attCats.length) attachmentCategories = attCats.map((c) => ({ slug: c.slug as AttachmentCategory["slug"], ...mapCat(c), machineCategories: seedAttachmentCategories.find((s) => s.slug === c.slug)?.machineCategories ?? [] })).sort(bySort);
    }
    if (settings?.phone || settings?.email) {
      const phoneDigits = (settings.phone ?? "").replace(/\D/g, "");
      site = {
        ...site,
        phone: settings.phone ?? site.phone,
        phoneHref: phoneDigits ? `tel:+${phoneDigits.length === 10 ? "1" + phoneDigits : phoneDigits}` : site.phoneHref,
        email: settings.email ?? site.email,
        address: { ...site.address, street: settings.street ?? "", city: settings.city ?? site.address.city, postal: settings.postal ?? "" },
        serviceArea: settings.serviceArea ?? site.serviceArea,
        hoursList: settings.hours?.length ? settings.hours.map((h) => ({ day: h.day, time: h.time })) : site.hoursList,
        announcement: { left: settings.announcementLeft ?? site.announcement.left, right: settings.announcementRight ?? site.announcement.right },
        social: { facebook: settings.social?.facebook || "#", instagram: settings.social?.instagram || "#", youtube: settings.social?.youtube || "#", linkedin: settings.social?.linkedin || "#", tiktok: settings.social?.tiktok || undefined, instagramHandle: settings.social?.instagramHandle || undefined, youtubeHandle: settings.social?.youtubeHandle || undefined, facebookHandle: settings.social?.facebookHandle || undefined, tiktokHandle: settings.social?.tiktokHandle || undefined },
        mapEmbedUrl: settings.mapEmbedUrl ?? undefined,
        tax: settings.taxRate != null ? { label: `Estimated HST (${settings.taxRate}%)`, rate: settings.taxRate / 100 } : { label: site.tax.label, rate: undefined },
      };
    }
    if (fin && (fin.updatedAt || fin.showEstimates)) {
      financing = {
        showEstimates: !!fin.showEstimates, annualRate: fin.annualRate ?? undefined, termMonths: fin.termMonths ?? undefined, downPaymentPercent: fin.downPaymentPercent ?? undefined, disclaimer: fin.disclaimer || seedFinancing.disclaimer,
        partner: fin.partnerName ? { name: fin.partnerName, url: fin.partnerUrl || "https://www.leaselink.ca/", applyUrl: fin.partnerApplyUrl ?? undefined, blurb: fin.partnerBlurb ?? seedFinancing.partner?.blurb } : seedFinancing.partner,
      };
    }
  } catch (err) {
    console.error("[catalogue] Payload unavailable, using seed data:", err instanceof Error ? err.message : err);
  }

  // Website units (kg / lb, ft / in) on everything customer-facing.
  catalogue = { ...catalogue, machines: catalogue.machines.map(presentMachine), attachments: catalogue.attachments.map(presentAttachment) };
  categories = categories.map((c) => ({ ...c, intro: c.intro ? humanizeUnits(c.intro) : undefined, buyingGuide: c.buyingGuide.map((b) => ({ ...b, text: humanizeUnits(b.text) })), faqs: c.faqs.map((f) => ({ ...f, answer: humanizeUnits(f.answer) })) }));

  // Live promos only (shown on the Financing page).
  financePromos = financePromos.filter((p) => promoIsLive(p)).sort(bySort);

  const nav: NavGroup[] = [
    { label: "Home", href: "/" },
    {
      label: "Equipment", href: "/inventory",
      children: categories.map((c) => ({ label: c.name, href: `/inventory/${c.slug}`, description: c.description.split(".")[0], image: c.image, artKind: c.slug })),
    },
    {
      label: "Attachments", href: "/attachments",
      children: attachmentCategories.map((c) => {
        const types = Array.from(new Set(catalogue.attachments.filter((a) => a.attachmentCategory === c.slug).map((a) => a.attachmentType))).sort();
        return {
          label: c.name, href: `/attachments/${c.slug}`, description: c.description.split(".")[0], image: c.image, artKind: "attachment" as const,
          children: types.map((t) => ({ label: t, href: `/attachments/${c.slug}#${slugify(t)}` })),
        };
      }),
    },
    {
      label: "Parts & Service", href: "/service",
      children: [
        { label: "Service & Repairs", href: "/service", description: "Certified RIPPA technicians, in-shop and field service", artKind: "generic" },
        { label: "RIPPA Parts", href: "/service/parts", description: "Genuine parts shipped across Canada", artKind: "attachment" },
        { label: "Oil & Lubricants", href: "/lubricants", description: "Chevron and Catalys oils, greases and fluids", artKind: "generic" },
      ],
    },
    { label: "Blog", href: "/blog" },
    { label: "Financing", href: "/financing" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return { catalogue, categories, attachmentCategories, financing, financePromos, posts, lubricants, site, nav, usingSeed };
});

// ---------- Convenience selectors (server components) ----------
export async function getMachines(category?: string) {
  const { catalogue } = await getSiteContent();
  return category ? catalogue.machines.filter((m) => m.category === category) : catalogue.machines;
}
export async function getMachine(slug: string) {
  const { catalogue } = await getSiteContent();
  return catalogue.machines.find((m) => m.slug === slug || m.id === slug);
}
export async function getAttachments(category?: string) {
  const { catalogue } = await getSiteContent();
  return category ? catalogue.attachments.filter((a) => a.attachmentCategory === category) : catalogue.attachments;
}
export async function getAttachment(slug: string) {
  const { catalogue } = await getSiteContent();
  return catalogue.attachments.find((a) => a.slug === slug || a.id === slug);
}
export async function getCategory(slug: string) {
  const { categories } = await getSiteContent();
  return categories.find((c) => c.slug === slug);
}
export async function getAttachmentCategory(slug: string) {
  const { attachmentCategories } = await getSiteContent();
  return attachmentCategories.find((c) => c.slug === slug);
}
