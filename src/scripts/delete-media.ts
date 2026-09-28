/**
 * Delete specific media records (and their files) by filename, but only when nothing references them.
 * Use before re-seeding a replaced image so the seed uploads the new file under the same name.
 *   FILES="r10-eco-render.jpg r10-eco-cover.jpg" npx payload run src/scripts/delete-media.ts
 *   FORCE=1 … deletes even if referenced (the reference is re-pointed by the following seed).
 */
import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });
const files = (process.env.FILES ?? "").split(/\s+/).filter(Boolean);
if (files.length === 0) { payload.logger.error("FILES env var is empty"); process.exit(1); }

const used = new Set<number>();
const add = (v: unknown) => { const id = typeof v === "object" && v ? (v as { id?: number }).id : v; if (typeof id === "number") used.add(id); };
const all = async <T,>(collection: string) => (await payload.find({ collection: collection as never, limit: 0, pagination: false, depth: 0, draft: true })).docs as T[];
for (const a of await all<{ images?: { image: unknown }[]; variants?: { images?: { image: unknown }[] }[] }>("attachments")) { a.images?.forEach((i) => add(i.image)); a.variants?.forEach((v) => v.images?.forEach((i) => add(i.image))); }
for (const m of await all<{ images?: { image: unknown }[]; features?: { image?: unknown }[] }>("machines")) { m.images?.forEach((i) => add(i.image)); m.features?.forEach((f) => add(f.image)); }
for (const p of await all<{ heroImage?: unknown }>("posts")) add(p.heroImage);
for (const l of await all<{ image?: unknown }>("lubricants")) add(l.image);
for (const c of await all<{ image?: unknown }>("categories")) add(c.image);
for (const p of await all<{ image?: unknown }>("parts")) add(p.image);

for (const filename of files) {
  const found = await payload.find({ collection: "media", where: { filename: { equals: filename } }, limit: 5, depth: 0 });
  if (found.docs.length === 0) { payload.logger.info(`not found: ${filename}`); continue; }
  for (const m of found.docs) {
    if (used.has(m.id) && !process.env.FORCE) { payload.logger.info(`kept ${filename} (#${m.id}) — still referenced; set FORCE=1 to replace`); continue; }
    await payload.delete({ collection: "media", id: m.id });
    payload.logger.info(`deleted ${filename} (#${m.id})${used.has(m.id) ? " [was referenced]" : ""}`);
  }
}
process.exit(0);
