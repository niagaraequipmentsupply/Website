/**
 * Upsert the RIPPA R32 PRO landing-page content: uploads brochure photos + PDF, fills specs/features/FAQs,
 * and links the attachments that fit it. Safe to re-run (matches media by filename, records by slug).
 *   npx payload run src/scripts/seed-r32.ts
 */
import path from "path";
import fs from "fs";
import { getPayload } from "payload";
import config from "@payload-config";
import { r32 } from "../data/r32-pro";

const CROPS = process.env.R32_CROPS_DIR || path.resolve("seed-assets/r32");
const BROCHURE = process.env.R32_BROCHURE || path.resolve("seed-assets/r32/RIPPA_Product-Brochure_Mini-excavator-_R32.pdf");

const payload = await getPayload({ config });
const log = (m: string) => payload.logger.info(m);

async function media(key: string, alt: string): Promise<number> {
  const filename = `${key}.jpg`;
  const existing = await payload.find({ collection: "media", where: { filename: { equals: filename } }, limit: 1 });
  if (existing.docs[0]) return existing.docs[0].id;
  const filePath = path.join(CROPS, filename);
  if (!fs.existsSync(filePath)) throw new Error(`Missing crop ${filePath}`);
  const doc = await payload.create({ collection: "media", data: { alt }, filePath });
  return doc.id;
}

// 0. Allow re-cropped files to replace earlier uploads: R32_REPLACE=r32-pro-render,feat-cab
for (const key of (process.env.R32_REPLACE || "").split(",").filter(Boolean)) {
  await payload.delete({ collection: "media", where: { filename: { equals: `${key}.jpg` } } });
  log(`Removed old media ${key}.jpg`);
}

// 1. Machine
const found = await payload.find({ collection: "machines", where: { slug: { equals: r32.slug } }, limit: 1, draft: true });
if (!found.docs[0]) throw new Error(`Machine ${r32.slug} not found — run npm run seed and seed:lineup first`);
const machine = found.docs[0];

const images = [];
for (const img of r32.images) images.push({ image: await media(img.key, img.alt) });
const features = [];
for (const f of r32.features) features.push({ eyebrow: f.eyebrow, title: f.title, text: f.text, image: f.image ? await media(f.image, `${r32.modelName}: ${f.title}`) : undefined });

let brochureId: number | undefined;
if (fs.existsSync(BROCHURE)) {
  const name = path.basename(BROCHURE);
  const ex = await payload.find({ collection: "documents", where: { filename: { equals: name } }, limit: 1 });
  brochureId = ex.docs[0]?.id ?? (await payload.create({ collection: "documents", data: { title: `${r32.modelName} Product Brochure`, kind: "brochure" }, filePath: BROCHURE })).id;
} else log(`Brochure not found at ${BROCHURE}; skipping download`);

await payload.update({
  collection: "machines", id: machine.id,
  data: {
    modelName: r32.modelName, series: r32.series, badge: r32.badge, shortDescription: r32.shortDescription, warranty: r32.warranty,
    longDescription: { root: { type: "root", format: "", indent: 0, version: 1, direction: "ltr", children: [{ type: "paragraph", format: "", indent: 0, version: 1, direction: "ltr", textFormat: 0, children: [{ type: "text", text: r32.longDescription, format: 0, detail: 0, mode: "normal", style: "", version: 1 }] }] } },
    certifications: r32.certifications.map((text) => ({ text })),
    images, features,
    documents: brochureId ? [{ label: `${r32.modelName} Product Brochure & Specifications (PDF)`, file: brochureId }] : [],
    specs: r32.specs.map((s) => ({ label: s.label, value: s.value, imperial: s.imperial, group: s.group ?? "general", icon: s.icon ?? "generic", highlight: !!s.highlight })),
    configurations: r32.configurations.map((c) => ({ label: c.label, engine: c.engine, horsepower: c.horsepower, operatingWeight: c.operatingWeight, price: c.price })),
    standardEquipment: r32.standardEquipment.map((text) => ({ text })), applications: r32.applications.map((text) => ({ text })), faqs: r32.faqs,
    featured: true, builderEnabled: true, sortOrder: 7, _status: "published",
  },
});
log(`Updated machine ${r32.modelName} (#${machine.id}) with ${images.length} photos, ${features.length} features, ${r32.specs.length} specs`);

// 2. Attachments now come from the manufacturer catalogue (npm run import:attachments); the brochure list is no longer seeded.

// 3. Category hero image
const cat = await payload.find({ collection: "categories", where: { slug: { equals: "excavators" } }, limit: 1 });
if (cat.docs[0]) {
  await payload.update({ collection: "categories", id: cat.docs[0].id, data: { image: await media("r32-pro-render", "RIPPA R32 PRO mini excavator") } });
  log("Set Mini Excavators category image");
}
log("R32 PRO content complete");
process.exit(0);
