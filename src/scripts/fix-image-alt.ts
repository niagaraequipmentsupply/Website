/**
 * Rewrite product-photo alt text in buyers' words and unlink the attachment photos that show a different product.
 *   npm run fix:image-alt                               apply to the local database
 *   FIX_ALT_DRY=1 npm run fix:image-alt                 report only
 *   FIX_ALT_SQL=out.sql npm run fix:image-alt           also write the full target state as idempotent SQL (patch production in place, no DB upload)
 *   FIX_ALT_SEED=out.json npm run fix:image-alt         also write { "<image key>": "<alt>" } for patching src/data/lineup.ts
 *
 * Deterministic: gallery alts are derived from the seed data in src/data/lineup.ts / loaders.ts (not from whatever the
 * database holds now), feature alts from the feature title, attachment alts from the family and its compatible models.
 *   Gallery photos:    "RIPPA R10 ECO 1-ton mini excavator with open canopy, right side view"
 *   Feature photos:    "RIPPA R10 ECO 1-ton mini excavator: Retractable tracks 900 – 1,200 mm"  (units humanised at render)
 *   Attachment photos: "RIPPA Tilt Bucket attachment for mini excavators (R06 ECO to R82 PRO)"
 * A photo used by both a gallery and a feature keeps the descriptive gallery alt. Machine type and weight class come
 * from src/data/machine-kinds.ts. Everything is fetched at depth 0 with one media index (depth-1 takes minutes on SQLite).
 */
import fs from "fs";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Attachment, Machine, Media } from "../payload-types";
import { MACHINE_KINDS } from "../data/machine-kinds";
import { lineup, skidSteers } from "../data/lineup";
import { loaders } from "../data/loaders";
import { r32 } from "../data/r32-pro";

// `payload run` keeps only positional arguments (minimist swallows --flags), so options come from the environment.
const DRY = !!process.env.FIX_ALT_DRY;
const SQL_OUT = process.env.FIX_ALT_SQL;
const SEED_OUT = process.env.FIX_ALT_SEED;

/** rippagroup.ca shows these products with another product's photo (a rake on the mixer, a dozer blade on the stump bucket…). */
const WRONG_ATTACHMENT_PHOTOS = new Set(["rippa-att-2928.webp", "rippa-att-2905.webp", "rippa-att-2909.webp", "rippa-att-2934.webp"]);
const NOUN_BY_CATEGORY: Record<string, string> = { "excavator-attachments": "mini excavators", "skid-steer-attachments": "skid steers", "loader-attachments": "compact loaders" };
/** Type words a seed alt may already carry; the machine noun supplies them now. */
const STRIP = ["stand-on mini track loader", "tracked stand-on mini loader", "stand-on track loader", "stand-on loader", "compact track loader", "compact wheel loader", "compact backhoe loader", "backhoe loader", "wheel loader", "tracked mini dumper", "mini dumper", "mini excavator", "micro excavator", "excavator", "skid steer"];

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const sqlStr = (s: string) => `'${s.replace(/'/g, "''")}'`;
const idOf = (v: number | { id: number } | null | undefined): number | undefined => (typeof v === "number" ? v : v?.id);
const keyOf = (filename: string | null | undefined) => (filename ?? "").replace(/\.\w+$/, "");

/** "RIPPA R10 ECO 1-ton mini excavator: Retractable tracks 900 – 1,200 mm" (a title with its own colon becomes a comma). */
const featureAlt = (title: string, model: string, noun: string) => `RIPPA ${model} ${noun}: ${title.trim().replace(/:\s/, ", ")}`;

/** "RIPPA R10 ECO from the front right" → "RIPPA R10 ECO 1-ton mini excavator, from the front right"; "RIPPA R10 ECO with enclosed cab" → "… 1-ton mini excavator with enclosed cab". */
function galleryAlt(seed: string, model: string, noun: string): string {
  if ([`RIPPA ${model} ${noun}`, `RIPPA ${model} tracked ${noun}`, `RIPPA ${model} wheeled ${noun}`].some((h) => seed.startsWith(h))) return seed; // already in the target form
  const base = model.split(" ")[0];
  let rest = seed.replace(/^RIPPA\s+/i, "").replace(new RegExp(`^${esc(base)}(\\s+(ECO|PRO))?\\b`, "i"), "").replace(/^[\s,:–-]+/, "").trim();
  for (const w of STRIP) rest = rest.replace(new RegExp(`\\b${esc(w)}\\b,?\\s*`, "i"), "");
  rest = rest.replace(/\s+/g, " ").replace(/^[,\s]+|[,\s]+$/g, "").replace(/\s+version$/i, "").trim();
  let head = `RIPPA ${model} ${noun}`;
  const lead = rest.match(/^(tracked|wheeled)\b,?\s*/i);
  if (lead) {
    rest = rest.slice(lead[0].length).trim();
    if (!noun.includes(lead[1].toLowerCase())) head = `RIPPA ${model} ${lead[1].toLowerCase()} ${noun}`;
  }
  rest = rest.replace(/^(open canopy|enclosed cab|heated)/i, "with $1");
  if (!rest) return head;
  const spaceJoin = /^(with|carrying|dumping|loading|grading|lifting|digging|drilling|levelling|sweeping|at work|on\b|in\b)/i.test(rest);
  return spaceJoin ? `${head} ${rest}` : `${head}, ${rest}`;
}

function attachmentAlt(name: string, category: string, models: { modelName: string; sortOrder: number }[]): string {
  const names = [...new Map(models.map((m) => [m.modelName, m])).values()].sort((a, b) => a.sortOrder - b.sortOrder).map((m) => m.modelName);
  const range = names.length === 0 ? "" : names.length === 1 ? ` (${names[0]})` : names.length === 2 ? ` (${names[0]} and ${names[1]})` : ` (${names[0]} to ${names[names.length - 1]})`;
  const word = /s$/i.test(name.trim()) ? "" : " attachment"; // "Pallet Forks for…", "Tilt Bucket attachment for…"
  return `RIPPA ${name}${word} for ${NOUN_BY_CATEGORY[category] ?? "RIPPA machines"}${range}`;
}

const seedAltByKey = new Map<string, string>();
for (const m of [...lineup, ...skidSteers, ...loaders, r32]) for (const i of m.images) seedAltByKey.set(i.key, i.alt);

const payload = await getPayload({ config });
const mediaById = new Map<number, Media>();
for (const m of (await payload.find({ collection: "media", depth: 0, limit: 5000, pagination: false })).docs as Media[]) mediaById.set(m.id, m);
const machines = (await payload.find({ collection: "machines", depth: 0, limit: 200, pagination: false, sort: "sortOrder", where: { _status: { equals: "published" } } })).docs as Machine[];
const machineById = new Map(machines.map((m) => [m.id, m]));
const attachments = (await payload.find({ collection: "attachments", depth: 0, limit: 500, pagination: false, sort: "sortOrder" })).docs as Attachment[];

/** media id → target alt; later writes win, so galleries are processed after features. */
const targets = new Map<number, string>();
const seedAlts: Record<string, string> = {};

for (const m of machines) {
  const noun = MACHINE_KINDS[m.slug]?.noun ?? (m.series && !/series$/i.test(m.series) ? m.series.toLowerCase() : "machine");
  for (const f of m.features ?? []) {
    const id = idOf(f.image);
    if (id !== undefined && mediaById.has(id)) targets.set(id, featureAlt(f.title, m.modelName, noun));
  }
  for (const row of m.images ?? []) {
    const media = mediaById.get(idOf(row.image) ?? -1);
    if (!media) continue;
    const seed = seedAltByKey.get(keyOf(media.filename)) ?? media.alt;
    const to = galleryAlt(seed, m.modelName, noun);
    seedAlts[keyOf(media.filename)] = to;
    targets.set(media.id, to);
  }
}

const unlink: { attachment: Attachment; keep: { image: number }[]; files: string[] }[] = [];
for (const a of attachments) {
  const models = (a.compatibleModels ?? []).map((v) => machineById.get(idOf(v) ?? -1)).filter((m): m is Machine => !!m).map((m) => ({ modelName: m.modelName, sortOrder: m.sortOrder ?? 100 }));
  const rows = a.images ?? [];
  const wrong = rows.filter((r) => WRONG_ATTACHMENT_PHOTOS.has(mediaById.get(idOf(r.image) ?? -1)?.filename ?? ""));
  if (wrong.length) unlink.push({ attachment: a, keep: rows.filter((r) => !wrong.includes(r)).map((r) => ({ image: idOf(r.image)! })), files: wrong.map((r) => mediaById.get(idOf(r.image) ?? -1)?.filename ?? "") });
  for (const r of rows) {
    const id = idOf(r.image);
    if (wrong.includes(r) || id === undefined || !mediaById.has(id)) continue;
    targets.set(id, attachmentAlt(a.name, a.attachmentCategory, models));
  }
}

const sql: string[] = [];
const changes: string[] = [];
for (const [id, to] of targets) {
  const media = mediaById.get(id)!;
  if (!media.filename) continue;
  sql.push(`UPDATE media SET alt = ${sqlStr(to)} WHERE filename = ${sqlStr(media.filename)} AND alt <> ${sqlStr(to)};`);
  if (media.alt === to) continue;
  changes.push(`${media.filename}\n    - ${media.alt}\n    + ${to}`);
  if (!DRY) await payload.update({ collection: "media", id, data: { alt: to } });
}
for (const u of unlink) {
  changes.push(`${u.attachment.slug}: unlink ${u.files.join(", ")} (photo shows a different product)`);
  if (!DRY) await payload.update({ collection: "attachments", id: u.attachment.id, data: { images: u.keep } });
}
const wrongList = [...WRONG_ATTACHMENT_PHOTOS].map(sqlStr).join(", ");
sql.push(`DELETE FROM attachments_images WHERE image_id IN (SELECT id FROM media WHERE filename IN (${wrongList}));`);
sql.push(`DELETE FROM _attachments_v_version_images WHERE image_id IN (SELECT id FROM media WHERE filename IN (${wrongList}));`);

for (const c of changes) console.log(c);
console.log(`${DRY ? "[dry run] " : ""}${changes.length} changes; ${targets.size} photos across ${machines.length} machines and ${attachments.length} attachment families`);
if (SQL_OUT) { fs.writeFileSync(SQL_OUT, sql.join("\n") + "\n"); console.log(`SQL written to ${SQL_OUT} (${sql.length} statements)`); }
if (SEED_OUT) { fs.writeFileSync(SEED_OUT, JSON.stringify(seedAlts, null, 2)); console.log(`seed alts written to ${SEED_OUT} (${Object.keys(seedAlts).length} keys)`); }
await new Promise((r) => setTimeout(r, 200)); // let stdout drain before exiting
process.exit(0);
