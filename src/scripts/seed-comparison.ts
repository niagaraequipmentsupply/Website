/**
 * Seed comparison-chart data (application fit, safety/comfort checklists, target users) for excavators from the
 * RIPPA buying guide, plus category landing-page content for excavators and skid steers. Re-runnable.
 *   npx payload run src/scripts/seed-comparison.ts
 */
import { getPayload } from "payload";
import config from "@payload-config";
import { excavatorComparison, excavatorGuideSpecs, categoryContent } from "../data/excavator-comparison";
import { skidSteerComparison } from "../data/skid-steer-comparison";

const payload = await getPayload({ config });
const log = (m: string) => payload.logger.info(m);

const all = await payload.find({ collection: "machines", limit: 500, depth: 0, draft: true });
const bySlug = new Map(all.docs.map((d) => [d.slug, d]));

let n = 0;
for (const [slug, c] of Object.entries(excavatorComparison)) {
  const doc = bySlug.get(slug);
  if (!doc) { log(`skip ${slug}: not found`); continue; }
  const specs = [...(doc.specs ?? [])];
  for (const s of excavatorGuideSpecs[slug] ?? []) {
    if (!specs.some((x) => x.label.toLowerCase() === s.label.toLowerCase())) specs.push({ label: s.label, value: s.value, imperial: s.imperial, group: s.group, icon: s.label.includes("depth") ? "depth" : "width", highlight: false });
  }
  // Keep the warranty spec row consistent with the guide.
  const w = c.warranty.replace(" warranty", "");
  for (const s of specs) if (s.label === "Warranty") s.value = w;
  await payload.update({ collection: "machines", id: doc.id, data: {
    targetUsers: c.targetUsers, noiseLevel: c.noiseLevel, indoorUse: c.indoorUse, warranty: c.warranty, specs,
    applicationFit: c.applicationFit.map((a) => ({ application: a.application, rating: String(a.rating) as "0" | "1" | "2" | "3" | "4", attachments: a.attachments || undefined })),
    checklist: c.checklist,
  } });
  n++;
}
log(`Updated comparison data on ${n} excavators`);

let k = 0;
for (const [slug, c] of Object.entries(skidSteerComparison)) {
  const doc = bySlug.get(slug);
  if (!doc) { log(`skip ${slug}: not found`); continue; }
  // Replace the thin seed specs (weight/engine/hp/warranty) with the full guide table; keep engine + warranty rows.
  const keep = (doc.specs ?? []).filter((x) => ["Engine", "Warranty"].includes(x.label)).map((x) => ({ ...x, highlight: true }));
  const specs = [...keep, ...c.specs.map((x) => ({ label: x.label, value: x.value, imperial: x.imperial, group: x.group ?? "general", icon: x.icon ?? "generic", highlight: !!x.highlight }))];
  await payload.update({ collection: "machines", id: doc.id, data: { targetUsers: c.targetUsers, specs, checklist: c.checklist } });
  k++;
}
log(`Updated comparison data on ${k} skid steers`);

for (const [slug, content] of Object.entries(categoryContent)) {
  const cat = await payload.find({ collection: "categories", where: { slug: { equals: slug } }, limit: 1 });
  if (!cat.docs[0]) continue;
  await payload.update({ collection: "categories", id: cat.docs[0].id, data: {
    intro: content.intro,
    buyingGuide: content.buyingGuide.map((b) => ({ title: b.title, text: b.text, models: b.slugs.map((s) => bySlug.get(s)?.id).filter((x): x is number => typeof x === "number") })),
    highlights: [...content.highlights], faqs: [...content.faqs],
  } });
  log(`Updated category content: ${slug}`);
}
process.exit(0);
