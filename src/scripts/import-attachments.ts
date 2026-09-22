/**
 * Consolidating import of the rippagroup.ca attachment catalogue (seed-assets/attachments/rippagroup.json + images/).
 * 363 manufacturer SKUs collapse into product families (one "4-in-1 Bucket", one "Digging Bucket" …); every SKU
 * becomes a variant carrying its size, part number, image and the exact models it fits. Descriptions and brochure
 * dimensions come from src/data/attachment-families.ts. Plate generations (RS -1 vs -2/-3) are tagged per variant.
 * Re-runnable: rebuilds all manufacturer families (records with a sourceUrl) each run.
 *   npm run import:attachments
 */
import fs from "fs";
import path from "path";
import { getPayload } from "payload";
import config from "@payload-config";
import { families, classOf } from "../data/attachment-families";

interface Row { id: string; slug: string; url: string; imageUrl: string; categories: string[]; sku: string | null; name: string }
const rows: Row[] = JSON.parse(fs.readFileSync(path.resolve("seed-assets/attachments/rippagroup.json"), "utf8"));
const IMG = path.resolve("seed-assets/attachments/images");
const payload = await getPayload({ config });
const log = (m: string) => payload.logger.info(m);
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const machines = (await payload.find({ collection: "machines", limit: 500, depth: 0, draft: true })).docs;
const idOf = (slug: string) => machines.find((m) => m.slug === slug)?.id;
const nameOf = (slug: string) => machines.find((m) => m.slug === slug)?.modelName ?? slug;
const EXC: Record<string, string> = { r06: "r06-eco", r10: "r10-eco", r13: "r13-pro", r15: "r15-eco", r18: "r18-pro", r22: "r22-pro", r32: "r32-pro", r57: "r57-pro", r82: "r82-pro", r230: "r230-pro" };
const SS: Record<string, string> = { rs03: "rs03", rs04: "rs04", rs06: "rs06", rs07: "rs07", rs10: "rs10", rs20: "rs20" };
const LD: Record<string, string> = { rb06: "rb06-backhoe", rl06: "compact-wheel-loader" };
const ORDER = ["r06-eco", "r10-eco", "r13-pro", "r15-eco", "r18-pro", "r22-pro", "r32-pro", "r57-pro", "r82-pro", "r230-pro", "rs03", "rs04", "rs06", "rs07", "rs10", "rs20", "rb06-backhoe", "compact-wheel-loader"];

// ---- name normalisation → family key + size label
const MODEL_PREFIX = /^(\[\s*[A-Z0-9]+\]\s*)?(R135|R\d{2,3}(?:-\d+)?(?:-\d+)?|R57-82|RS-?\d{2}(?:-\d{2})?(?:\/\d{2})?(?:-\d)?|RS0\d\/0\d-\d|RS057|RB-?RL06(?:\s*CHARGEUR)?\s*-?|RB06|RL06)\s*/i;
const SIZE = /(\d{2,4}\s?(?:MM|CM)(?:\s?X\s?\d{2,4}\s?(?:MM|CM))?(?:\s*-\s*[\d.]+\s?(?:''|"|”)(?:\s?X\s?[\d.]+\s?(?:''|"|”))?)?|\(\d+\s?INCH\)|-\s?\d+(?:\.\d+)?\s?(?:''|"|”)(?:\s?X\s?\d+(?:\.\d+)?\s?(?:''|"|”))?|\b\d{2,3}\s?X\s?\d{2,3}\b|\d+(?:\.\d+)?\s?(?:''|"|”))/gi;
const SYN: [RegExp, string][] = [[/MECANICAL/g, "MECHANICAL"], [/REAPER/g, "RIPPER"], [/SKELTON/g, "SKELETON"], [/CYLINDRE/g, "CYLINDER"], [/SIMPLE CYLINDER/g, "SIMPLE CYLINDER"], [/TARIÈRE|TARIERE/g, "AUGER"], [/FOURCHES/g, "FORKS"], [/LAME BULLDOZER/g, "BULLDOZER BLADE"], [/4 IN 1 BUCKET|FOUR IN ONE BUCKET/g, "FOUR-IN-ONE BUCKET"], [/EAGLE BECK/g, "EAGLE BECK"], [/QUICK CONNECT/g, "QUICK ATTACH"], [/ROTARY BRILL/g, "ROTARY DRILL"], [/LAND CLEARING RAKE/g, "LAND CLEARING RAKE"], [/\(REDUCER\)|- REDUCER|WITH REDUCER/g, "WITH REDUCER"], [/TRANCHER/g, "TRENCHER"], [/WOOD SPLITTER/g, "LOG SPLITTER"], [/BUSH CUTTER/g, "BRUSH CUTTER"], [/STUMP BREAKER/g, "STUMP GRINDER"], [/SNOWPLOW|SNOW PLOW BLADE|SNOW PLOW/g, "SNOW PLOW"], [/\s+/g, " "]];
function normalize(raw: string) {
  let n = raw.toUpperCase().replace(/["“”]([A-Z ]+)["“”]/g, "$1").replace(/[’']'|''/g, "''");
  n = n.replace(MODEL_PREFIX, "");
  const sizes = Array.from(n.matchAll(SIZE)).map((m) => m[0].trim()).filter((s) => !/^-?\s?\d(?:\.\d+)?"?$/.test(s) || /MM|CM/.test(s));
  let key = n.replace(SIZE, " ");
  for (const [re, to] of SYN) key = key.replace(re, to);
  key = key.replace(/\bX\b/g, " ").replace(/[-–]\s*$/g, "").replace(/\s*-\s*/g, " ").replace(/\s{2,}/g, " ").trim();
  return { key, size: sizes.join(" ").replace(/\s{2,}/g, " ").trim() };
}
const flat = (k: string) => k.replace(/[-–]/g, " ").replace(/\s{2,}/g, " ").trim();
const famKeys = Object.keys(families).map((k) => [flat(k), k] as const);
const familyFor = (key: string, cat: string): keyof typeof families | undefined => {
  const fk = flat(key);
  const exact = (k: string) => famKeys.find(([f]) => f === k)?.[1];
  if (cat === "skid-steer-attachments" && exact(fk + " SS")) return exact(fk + " SS");
  if (exact(fk)) return exact(fk);
  return famKeys.filter(([f]) => fk.includes(f) || f.includes(fk)).sort((a, b) => b[0].length - a[0].length)[0]?.[1];
};
const prettySize = (s: string) => s.replace(/MM/g, " mm").replace(/CM/g, " cm").replace(/\s?X\s?/g, " × ").replace(/''/g, '"').replace(/\s{2,}/g, " ").replace(/\(/g, "(").trim();

async function media(id: string, alt: string): Promise<number | undefined> {
  const filename = `rippa-att-${id}.jpg`;
  const ex = await payload.find({ collection: "media", where: { filename: { equals: filename } }, limit: 1 });
  if (ex.docs[0]) return ex.docs[0].id;
  const src = path.join(IMG, `${id}.jpg`); if (!fs.existsSync(src)) return undefined;
  const tmp = path.join(IMG, filename); fs.copyFileSync(src, tmp);
  try { return (await payload.create({ collection: "media", data: { alt }, filePath: tmp })).id; } finally { fs.rmSync(tmp, { force: true }); }
}

// ---- group SKUs into families
interface Sku { row: Row; size: string; models: string[]; gen1: boolean; gen2: boolean; cat: "excavator-attachments" | "skid-steer-attachments" | "loader-attachments" }
const groups = new Map<string, { fam: string; cat: Sku["cat"]; skus: Sku[] }>();
let unmatched: string[] = [];
for (const row of rows) {
  const leaves = row.categories.map((c) => c.split("/").pop()!.replace(/-\d+$/, ""));
  const models = new Set<string>(); let gen1 = false, gen2 = false; let cat: Sku["cat"] = "excavator-attachments";
  for (const l of leaves) {
    let m: RegExpMatchArray | null;
    if ((m = l.match(/^attachment-excavator-(r\d+)/))) { cat = "excavator-attachments"; if (EXC[m[1]]) models.add(EXC[m[1]]); }
    else if ((m = l.match(/^attachment-skid-steer-loader-(rs\d+)(?:-(\d))?$/))) { cat = "skid-steer-attachments"; if (SS[m[1]]) models.add(SS[m[1]]); if (m[2]) gen2 = true; else gen1 = true; }
    else if ((m = l.match(/^attachment-loader-(r[bl]\d+)$/))) { cat = "loader-attachments"; if (LD[m[1]]) models.add(LD[m[1]]); }
    else if (l === "attachment-skid-steer-loader") cat = "skid-steer-attachments"; else if (l === "attachment-loader") cat = "loader-attachments";
  }
  const { key, size } = normalize(row.name);
  const fam = familyFor(key, cat);
  if (!fam) { unmatched.push(`${row.name} → ${key}`); continue; }
  const gk = `${cat}|${families[fam].name}`;
  const g = groups.get(gk) ?? { fam, cat, skus: [] };
  if (!families[g.fam].specs && families[fam].specs) g.fam = fam;
  g.skus.push({ row, size, models: [...models].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b)), gen1, gen2, cat });
  groups.set(gk, g);
}
if (unmatched.length) log(`Unmatched (${unmatched.length}): ${unmatched.slice(0, 20).join(" | ")}`);

// ---- wipe previous manufacturer records and rebuild
const old = await payload.find({ collection: "attachments", limit: 1000, depth: 0, draft: true });
for (const d of old.docs) await payload.delete({ collection: "attachments", id: d.id });
log(`Cleared ${old.docs.length} attachment records`);

let created = 0;
for (const [, g] of groups) {
  const info = families[g.fam];
  const allModels = Array.from(new Set(g.skus.flatMap((s) => s.models))).sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
  const modelIds = allModels.map(idOf).filter((x): x is number => typeof x === "number");
  const gen1 = g.skus.some((s) => s.gen1), gen2 = g.skus.some((s) => s.gen2);
  const plateType = g.cat === "excavator-attachments" ? "excavator-qc" : g.cat === "loader-attachments" ? "pin-on" : allModels.every((m) => m === "rs10" || m === "rs20") ? "universal-ssl" : gen2 && !gen1 ? "rippa-mini" : gen1 && !gen2 ? "toro-dingo" : undefined;
  const variants = [];
  for (const s of g.skus.sort((a, b) => ORDER.indexOf(a.models[0]) - ORDER.indexOf(b.models[0]) || a.size.localeCompare(b.size, undefined, { numeric: true }))) {
    const plate = g.cat === "skid-steer-attachments" ? (s.gen2 && !s.gen1 ? "RIPPA plate" : s.gen1 && !s.gen2 ? "Toro Dingo plate" : "either plate") : "";
    const modelLabel = s.models.map(nameOf).join(" / ") || "RIPPA";
    const label = [modelLabel, prettySize(s.size) || info.name, plate].filter(Boolean).join(" · ");
    const imgId = await media(s.row.id, `RIPPA ${info.name} for ${modelLabel}`);
    variants.push({ label, widthOrSize: prettySize(s.size) || undefined, sku: s.row.sku ?? undefined, compatibleModels: s.models.map(idOf).filter((x): x is number => typeof x === "number"), images: imgId ? [{ image: imgId }] : [] });
  }
  const images = variants.flatMap((v) => v.images).slice(0, 1);
  const cls = g.cat === "skid-steer-attachments" ? classOf(allModels) : undefined;
  const specLines = info.specs ? (cls && info.specs[cls] ? info.specs[cls] : info.specs.default) : undefined;
  const fitsText = allModels.length ? allModels.map(nameOf).join(", ") : "RIPPA machines";
  const sizes = Array.from(new Set(variants.map((v) => v.widthOrSize).filter(Boolean)));
  const paras = [
    `${info.description} Genuine RIPPA attachment, sold and supported by Niagara Equipment Supply with fitment confirmed against your machine's serial number before it ships.`,
    `Fits: ${fitsText}.${sizes.length > 1 ? ` Available in ${sizes.length} sizes / versions; see the compatibility guide for the exact part number for your model.` : ""}`,
    specLines ? `Brochure specifications${cls ? ` (${{ mini: "RS03 / RS04 class", compact: "RS06 / RS07 class", full: "RS10 / RS20 class" }[cls]})` : ""}: ${specLines.join("; ")}.` : "",
    g.cat === "skid-steer-attachments" ? (gen1 && gen2 ? "Listed by RIPPA for both first-generation loaders (Toro Dingo-style mini plate) and -2 / -3 loaders (RIPPA proprietary plate). Each version below states its plate." : gen2 ? "For -2 / -3 generation loaders with the RIPPA proprietary plate." : gen1 ? "For first-generation (-1) loaders with the Toro Dingo-style mini plate." : "") + " We convert plates and fit adapters if you run a different standard." : "",
    "Pricing is quoted on request; add it to your quote list with your machine selected and we reply with price and availability.",
  ].filter(Boolean);
  const rich = { root: { type: "root", format: "" as const, indent: 0, version: 1, direction: "ltr" as const, children: paras.map((t) => ({ type: "paragraph", format: "" as const, indent: 0, version: 1, direction: "ltr" as const, textFormat: 0, children: [{ type: "text", text: t, format: 0, detail: 0, mode: "normal", style: "", version: 1 }] })) } };
  const short = `${sizes.length > 1 ? `${sizes.length} sizes · ` : ""}Fits ${allModels.length > 4 ? `${nameOf(allModels[0])} – ${nameOf(allModels[allModels.length - 1])}` : fitsText}`;
  const featured = ["4-in-1 Bucket", "Digging Bucket", "Hydraulic Thumb", "Auger", "Auger (Rotary Drill)", "Rake", "Hydraulic Breaker", "Log Grapple", "Pallet Forks", "Tilt Bucket (double cylinder)", "Angle Sweeper", "Brush Cutter", "Snow Blower", "Dozer Blade", "Grapple Bucket", "Trencher"].includes(info.name);
  await payload.create({ collection: "attachments", data: {
    name: info.name, attachmentType: info.type, attachmentCategory: g.cat, description: short.slice(0, 180), slug: slugify(`${info.name}-${g.cat.replace("-attachments", "")}`), longDescription: rich,
    images, documents: [], compatibleCategories: [], compatibleModels: modelIds, plateType, sourceUrl: g.skus[0].row.url, showPrice: false, supportsQuantity: false, variants,
    featured, sortOrder: 100, _status: "published",
  } as never });
  created++;
}
log(`Created ${created} attachment families from ${rows.length} SKUs`);
process.exit(0);
