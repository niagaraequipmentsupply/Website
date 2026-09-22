/**
 * Upsert the full RIPPA lineup (excavators R06–R230, skid steers RS03–RS20) from src/data/lineup.ts:
 * renames legacy slugs, uploads renders + spec-sheet PDFs from seed-assets/lineup, and writes all page content.
 * Re-runnable.   npm run seed:lineup
 */
import path from "path";
import fs from "fs";
import { getPayload } from "payload";
import config from "@payload-config";
import { lineup, skidSteers } from "../data/lineup";

const ASSETS = path.resolve("seed-assets/lineup");
const SLUG_MAP: Record<string, string> = { "r10-6-eco": "r10-eco", "r13-4-pro": "r13-pro", "r15-5-eco": "r15-eco", "r18-5-pro": "r18-pro", "r22-3-pro": "r22-pro", "r32-5-pro": "r32-pro", "rs03-2": "rs03", "rs04-2": "rs04", "rs06-3": "rs06", "rs07-2": "rs07", "rs20-2": "rs20" };

const payload = await getPayload({ config });
const log = (m: string) => payload.logger.info(m);

async function media(key: string, alt: string): Promise<number | undefined> {
  const filename = `${key}.jpg`;
  const ex = await payload.find({ collection: "media", where: { filename: { equals: filename } }, limit: 1 });
  if (ex.docs[0]) { if (ex.docs[0].alt !== alt) await payload.update({ collection: "media", id: ex.docs[0].id, data: { alt } }); return ex.docs[0].id; }
  const filePath = path.join(ASSETS, filename);
  if (!fs.existsSync(filePath)) { log(`  missing image ${filename}`); return undefined; }
  return (await payload.create({ collection: "media", data: { alt }, filePath })).id;
}
async function doc(file: string, title: string): Promise<number | undefined> {
  const ex = await payload.find({ collection: "documents", where: { filename: { equals: file } }, limit: 1 });
  if (ex.docs[0]) return ex.docs[0].id;
  const filePath = path.join(ASSETS, file);
  if (!fs.existsSync(filePath)) { log(`  missing brochure ${file}`); return undefined; }
  return (await payload.create({ collection: "documents", data: { title, kind: "spec-sheet" }, filePath })).id;
}
const rich = (text: string) => ({ root: { type: "root", format: "" as const, indent: 0, version: 1, direction: "ltr" as const, children: text.split("\n\n").map((t) => ({ type: "paragraph", format: "" as const, indent: 0, version: 1, direction: "ltr" as const, textFormat: 0, children: [{ type: "text", text: t, format: 0, detail: 0, mode: "normal", style: "", version: 1 }] })) } });

// 1. Rename legacy slugs first (also covers R32, which keeps its own content script)
const all = await payload.find({ collection: "machines", limit: 500, depth: 0, draft: true });
for (const d of all.docs) {
  const next = SLUG_MAP[d.slug];
  if (next && !all.docs.some((x) => x.slug === next)) { await payload.update({ collection: "machines", id: d.id, data: { slug: next, modelName: d.modelName.replace(/^(R\d+|RS\d+)-\d+ /, "$1 ") } }); log(`renamed ${d.slug} → ${next}`); }
}

// 2. Upsert each lineup model
const ids = new Map<string, number>();
for (const m of [...lineup, ...skidSteers]) {
  const ex = await payload.find({ collection: "machines", where: { slug: { equals: m.slug } }, limit: 1, draft: true });
  const images = (await Promise.all(m.images.map(async (i) => ({ image: await media(i.key, i.alt) })))).filter((x): x is { image: number } => typeof x.image === "number");
  const features = await Promise.all(m.features.map(async (f) => ({ eyebrow: f.eyebrow, title: f.title, text: f.text, image: f.image ? await media(f.image, `${m.modelName}: ${f.title}`) : undefined })));
  const brochureId = await doc(m.brochure, `RIPPA ${m.modelName} Spec Sheet`);
  const existingCfg = ex.docs[0]?.configurations ?? [];
  const data = {
    modelName: m.modelName, brand: "RIPPA", series: m.series, category: m.category, badge: m.badge, shortDescription: m.shortDescription, longDescription: rich(m.longDescription),
    warranty: m.warranty, certifications: m.certifications.map((text) => ({ text })), images, features,
    documents: brochureId ? [{ label: `${m.modelName} Spec Sheet & Brochure (PDF)`, file: brochureId }] : ex.docs[0]?.documents ?? [],
    specs: m.specs.map((s) => ({ label: s.label, value: s.value, imperial: s.imperial, group: s.group ?? "general", icon: s.icon ?? "generic", highlight: !!s.highlight })),
    showPrice: true,
    configurations: m.configurations.map((c) => ({ label: c.label, engine: c.engine, horsepower: c.horsepower, operatingWeight: c.operatingWeight, price: c.price ?? existingCfg.find((e) => e.label === c.label)?.price ?? undefined })),
    builderEnabled: m.builderEnabled, standardEquipment: m.standardEquipment.map((text) => ({ text })), applications: m.applications.map((text) => ({ text })), faqs: m.faqs,
    targetUsers: m.targetUsers, noiseLevel: m.noiseLevel, indoorUse: !!m.indoorUse, slug: m.slug, featured: m.featured, sortOrder: m.sortOrder, _status: "published" as const,
  };
  const saved = ex.docs[0] ? await payload.update({ collection: "machines", id: ex.docs[0].id, data }) : await payload.create({ collection: "machines", data });
  ids.set(m.slug, saved.id);
  log(`${ex.docs[0] ? "updated" : "created"} ${m.modelName} (#${saved.id}) · ${images.length} photos · ${m.specs.length} specs · ${m.configurations.length} configs`);
}

// 3. R06 ECO shares the compact attachment set with the R10 ECO
const r06 = ids.get("r06-eco"), r10 = ids.get("r10-eco");
if (r06 && r10) {
  const atts = await payload.find({ collection: "attachments", limit: 500, depth: 0, draft: true });
  let n = 0;
  for (const a of atts.docs) {
    const models = (a.compatibleModels ?? []).map((x) => (typeof x === "number" ? x : x.id));
    if (models.includes(r10) && !models.includes(r06)) { await payload.update({ collection: "attachments", id: a.id, data: { compatibleModels: [...models, r06] } }); n++; }
  }
  log(`linked ${n} attachments to the R06 ECO`);
}
log("Lineup seed complete");
process.exit(0);
