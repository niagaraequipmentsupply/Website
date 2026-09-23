/**
 * Delete media records (and their files) that nothing references any more. Safe to re-run.
 * Scope: catalogue images uploaded by the importers (filenames starting with "rippa-att-"), which past
 * re-imports duplicated. Anything referenced by an attachment, variant, machine, post or lubricant is kept.
 *   npx payload run src/scripts/purge-orphan-media.ts
 */
import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });
const used = new Set<number>();
const add = (v: unknown) => { const id = typeof v === "object" && v ? (v as { id?: number }).id : v; if (typeof id === "number") used.add(id); };
const all = async <T,>(collection: string) => (await payload.find({ collection: collection as never, limit: 0, pagination: false, depth: 0, draft: true })).docs as T[];

for (const a of await all<{ images?: { image: unknown }[]; variants?: { images?: { image: unknown }[] }[] }>("attachments")) {
  a.images?.forEach((i) => add(i.image)); a.variants?.forEach((v) => v.images?.forEach((i) => add(i.image)));
}
for (const m of await all<{ images?: { image: unknown }[]; configurations?: { image?: unknown }[] }>("machines")) { m.images?.forEach((i) => add(i.image)); m.configurations?.forEach((c) => add(c.image)); }
for (const p of await all<{ heroImage?: unknown }>("posts")) add(p.heroImage);
for (const l of await all<{ image?: unknown }>("lubricants")) add(l.image);
for (const c of await all<{ image?: unknown }>("categories")) add(c.image);

const media = await all<{ id: number; filename?: string }>("media");
const orphans = media.filter((m) => m.filename?.startsWith("rippa-att-") && !used.has(m.id));
payload.logger.info(`${media.length} media records, ${used.size} referenced, ${orphans.length} orphaned catalogue images to delete`);
let n = 0;
for (const m of orphans) { await payload.delete({ collection: "media", id: m.id }); if (++n % 100 === 0) payload.logger.info(`deleted ${n}`); }
payload.logger.info(`Deleted ${n} orphaned media records`);
process.exit(0);
