/**
 * Seed the Payload database from the typed seed data in src/data.
 * Run once:  npm run seed   (safe to re-run: skips collections that already have documents)
 */
import { getPayload } from "payload";
import config from "@payload-config";
import { machines } from "./data/machines";
import { attachments } from "./data/attachments";
import { addons } from "./data/addons";
import { warranties } from "./data/warranties";
import { categories, attachmentCategories } from "./data/categories";
import { site } from "./data/site";
import { financing, financePromos } from "./data/financing";

const payload = await getPayload({ config });
const log = (m: string) => payload.logger.info(m);

const count = async (collection: "machines" | "attachments" | "addons" | "warranties" | "categories" | "finance-promos") => (await payload.count({ collection })).totalDocs;

// Categories
if ((await count("categories")) === 0) {
  for (const c of categories) await payload.create({ collection: "categories", data: { kind: "machine", slug: c.slug, name: c.name, shortName: c.shortName, description: c.description, sortOrder: c.sortOrder } });
  for (const c of attachmentCategories) await payload.create({ collection: "categories", data: { kind: "attachment", slug: c.slug, name: c.name, shortName: c.name.replace(" Attachments", ""), description: c.description, sortOrder: c.sortOrder } });
  log(`Seeded ${categories.length + attachmentCategories.length} categories`);
} else log("Categories exist, skipping");

// Machines (remember seed id → db id for relationships)
const machineIds = new Map<string, number>();
if ((await count("machines")) === 0) {
  for (const m of machines) {
    const doc = await payload.create({
      collection: "machines",
      data: {
        modelName: m.modelName, brand: m.brand, series: m.series, category: m.category, badge: m.badge, shortDescription: m.shortDescription, warranty: m.warranty,
        specs: m.specs.filter((s) => s.value).map((s) => ({ label: s.label, value: s.value, icon: s.icon ?? "generic", highlight: !!s.highlight })),
        showPrice: m.showPrice, configurations: m.configurations.map((c) => ({ label: c.label, engine: c.engine, horsepower: c.horsepower, operatingWeight: c.operatingWeight, price: c.price, sku: c.sku, inStock: c.inStock })),
        basePrice: m.basePrice, promoPrice: m.promoPrice, builderEnabled: m.builderEnabled, slug: m.slug, featured: m.featured,
        inStock: m.inStock === undefined ? "unknown" : m.inStock ? "in-stock" : "order", sortOrder: m.sortOrder, _status: "published",
      },
    });
    machineIds.set(m.id, doc.id);
  }
  log(`Seeded ${machines.length} machines`);
} else {
  const existing = await payload.find({ collection: "machines", limit: 500, depth: 0 });
  for (const d of existing.docs) { const s = machines.find((m) => m.slug === d.slug); if (s) machineIds.set(s.id, d.id); }
  log("Machines exist, skipping");
}
const ids = (seedIds: string[]) => seedIds.map((id) => machineIds.get(id)).filter((x): x is number => typeof x === "number");

if ((await count("attachments")) === 0) {
  for (const a of attachments) {
    await payload.create({
      collection: "attachments",
      data: {
        name: a.name, attachmentType: a.attachmentType, attachmentCategory: a.attachmentCategory, description: a.description, slug: a.slug,
        compatibleCategories: a.compatibleCategories, compatibleModels: ids(a.compatibleModelIds),
        showPrice: a.showPrice, basePrice: a.basePrice, supportsQuantity: a.supportsQuantity,
        variants: a.variants.map((v) => ({ label: v.label, widthOrSize: v.widthOrSize, sku: v.sku, price: v.price, compatibleModels: ids(v.compatibleModelIds ?? []) })),
        featured: a.featured, inStock: a.inStock === undefined ? "unknown" : a.inStock ? "in-stock" : "order", sortOrder: a.sortOrder, _status: "published",
      },
    });
  }
  log(`Seeded ${attachments.length} attachments`);
} else log("Attachments exist, skipping");

if ((await count("addons")) === 0) {
  for (const a of addons) await payload.create({ collection: "addons", data: { name: a.name, type: a.type, icon: a.icon, shortDescription: a.shortDescription, fullDescription: a.fullDescription, price: a.price, quoteRequired: !!a.quoteRequired, allModels: a.compatibleModelIds === "all", compatibleModels: a.compatibleModelIds === "all" ? [] : ids(a.compatibleModelIds), selectable: a.selectable, defaultSelected: a.defaultSelected, sortOrder: a.sortOrder } });
  log(`Seeded ${addons.length} add-ons`);
} else log("Add-ons exist, skipping");

if ((await count("warranties")) === 0) {
  for (const w of warranties) await payload.create({ collection: "warranties", data: { name: w.name, termMonths: w.termMonths, price: w.price, financeEligible: w.financeEligible, coverageSummary: w.coverageSummary, allModels: w.eligibleModelIds === "all", eligibleModels: w.eligibleModelIds === "all" ? [] : ids(w.eligibleModelIds), sortOrder: w.sortOrder } });
  log(`Seeded ${warranties.length} warranties`);
} else log("Warranties exist, skipping");

if (process.env.SEED_SAMPLE_PROMOS && (await count("finance-promos")) === 0) {
  for (const p of financePromos) {
    await payload.create({ collection: "finance-promos", data: {
      title: p.title, kind: p.kind, badge: p.badge, summary: p.summary, highlights: p.highlights.map((text) => ({ text })), terms: p.terms,
      startDate: p.startDate, endDate: p.endDate, allModels: p.eligibleModelIds === "all", eligibleModels: p.eligibleModelIds === "all" ? [] : ids(p.eligibleModelIds),
      ctaLabel: p.ctaLabel, ctaHref: p.ctaHref, active: p.badge !== "0% APR", featured: p.badge !== "0% APR" && p.featured, sortOrder: p.sortOrder,
    } });
  }
  log(`Seeded ${financePromos.length} financing promos/programs (SAMPLES — edit in /admin)`);
} else log("Financing promos exist, skipping");

const fin = await payload.findGlobal({ slug: "financing" });
if (!fin.partnerBlurb && financing.partner) {
  await payload.updateGlobal({ slug: "financing", data: { partnerName: financing.partner.name, partnerUrl: financing.partner.url, partnerApplyUrl: financing.partner.applyUrl, partnerBlurb: financing.partner.blurb } });
  log("Seeded financing partner details");
}

const settings = await payload.findGlobal({ slug: "site-settings" });
if (!settings.phone) {
  await payload.updateGlobal({ slug: "site-settings", data: { phone: site.phone, email: site.email, city: site.address.city, serviceArea: site.serviceArea, hours: site.hours.map((h) => ({ day: h.day, time: h.time })), announcementLeft: site.announcement.left, announcementRight: site.announcement.right, taxRate: site.tax.rate ? site.tax.rate * 100 : undefined } });
  await payload.updateGlobal({ slug: "financing", data: { showEstimates: financing.showEstimates, termMonths: financing.termMonths, downPaymentPercent: financing.downPaymentPercent, disclaimer: financing.disclaimer } });
  log("Seeded site settings + financing");
}

log("Seed complete. Open /admin to create your first admin user.");
process.exit(0);
