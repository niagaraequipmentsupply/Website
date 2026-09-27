/**
 * Import the rippagroup.ca parts catalogue (seed-assets/parts/rippagroup-parts.json + images/) into the Parts collection.
 * Each product becomes one Part with a system, the machines it is listed for, and its photo (Odoo placeholders skipped).
 * Idempotent: keyed by SKU (falls back to source id).   npm run import:parts
 */
import fs from "fs";
import path from "path";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Part as PPart } from "../payload-types";

interface Row { id: string; slug: string; name: string; url: string; imageUrl: string; categories: string[]; sku: string | null; hasImage?: boolean }
const rows: Row[] = JSON.parse(fs.readFileSync(path.resolve("seed-assets/parts/rippagroup-parts.json"), "utf8"));
const IMG = path.resolve("seed-assets/parts/images");
if (!process.env.DATABASE_URI || process.env.DATABASE_URI.startsWith("file:")) {
  const busy = (await import("node:child_process")).spawnSync("lsof", ["-iTCP:3000", "-sTCP:LISTEN", "-t"], { encoding: "utf8" }).stdout.trim();
  if (busy) { console.error("Stop the dev server first (SQLite is single-writer)."); process.exit(1); }
}
const payload = await getPayload({ config });
const log = (m: string) => payload.logger.info(m);
const machines = (await payload.find({ collection: "machines", limit: 500, depth: 0, draft: true })).docs;
const MODEL: Record<string, string> = { r06: "r06-eco", r10: "r10-eco", r13: "r13-pro", r15: "r15-eco", r18: "r18-pro", r22: "r22-pro", r32: "r32-pro", r57: "r57-pro", r82: "r82-pro", r230: "r230-pro", rs03: "rs03", rs04: "rs04", rs06: "rs06", rs07: "rs07", rs10: "rs10", rs20: "rs20", rl06: "rl06", rb06: "rb06", rd06: "rd06" };
const idOf = (slug: string) => machines.find((m) => m.slug === slug)?.id;
const SYSTEM: [RegExp, string][] = [
  [/filter/, "filters"], [/engine/, "engine"], [/fuel/, "fuel-system"], [/hydraulic-cylinder/, "hydraulic-cylinders"], [/hydraulic-component/, "hydraulic-components"], [/hydraulic/, "hydraulic-system"],
  [/electric/, "electrical"], [/undercarriage/, "undercarriage"], [/traction/, "traction"], [/upper-frame|body/, "body"], [/work-equipment/, "work-equipment"], [/canopy|cab$/, "canopy"], [/controls/, "controls"], [/decals/, "decals"], [/accessories/, "accessories"],
];
/** Fallback when RIPPA files a part only under a model (no system category): classify by the part name. */
const NAME_RULES: [RegExp, string][] = [
  [/STICKER|LABEL|LOGO|DECAL/i, "decals"],
  [/SEAT|JOYSTICK|LEVER|HANDLE|ROCKER|ROCKET|PEDAL|ARMREST|HANDRAIL|CONSOLE|THROTTLE|TROTTLE/i, "controls"],
  [/SWITCH|RELAY|LIGHT|LAMP|WIRE|HARNESS|BATTERY|FUSE|SENSOR|ALTERNATOR|STARTER|DISPLAY|HORN|BEACON|SOLENOID|GAUGE|METER/i, "electrical"],
  [/CONNECTING ROD|PISTON|CRANK|GASKET|CYLINDER BLOCK|BELL COVER|OIL PUMP|REGULATOR|INJECT|GLOW|RADIATOR|THERMOSTAT|SPARK PLUG|MUFFLER|EXHAUST|CARBURET|WATER PUMP|VALVE COVER|CAMSHAFT|ENGINE|BELT|FAN\b|FLYWHEEL|HEAD ?REST/i, "engine"],
  [/FUEL|DIESEL TANK|GAS TANK/i, "fuel-system"],
  [/TRACK|ROLLER|SPROCKET|IDLER|TENSION|UNDERCARRIAGE/i, "undercarriage"],
  [/CYLINDER/i, "hydraulic-cylinders"],
  [/PUMP|VALVE|HOSE|SWIVEL|JOINT|SEAL|O-RING|COUPLING|FITTING|MOTOR|DISTRIBUTOR|ACCUMULATOR|HYDRAULIC|OIL COOLER/i, "hydraulic-system"],
  [/BOOM|\bARM\b|BUCKET|TOOTH|TEETH|\bPIN\b|BUSHING|BLADE|THUMB|COUPLER|LINKAGE|DOZER/i, "work-equipment"],
  [/CANOPY|\bCAB\b|WINDOW|GLASS|DOOR|WIPER|MIRROR|GUARD|GAS SUPPORT|ROOF|ROPS/i, "canopy"],
  [/COVER|HOOD|PANEL|FRAME|COUNTERWEIGHT|BONNET|FENDER|BODY/i, "body"],
  [/KEY|TOOL|KIT/i, "accessories"],
];
const systemFromName = (name: string): string | undefined => NAME_RULES.find(([re]) => re.test(name))?.[1];
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const titleCase = (s: string) => s.toLowerCase().replace(/(^|[\s(/-])([a-z])/g, (m) => m.toUpperCase()).replace(/\b(R\d{2,3}|Rs\d{2}|Rl06|Rb06|Rd06)\b/gi, (m) => m.toUpperCase()).replace(/\bMm\b/g, "mm").replace(/\bKubota\b/i, "Kubota").replace(/\bBriggs\b/i, "Briggs");

async function media(row: Row): Promise<number | undefined> {
  if (row.hasImage === false) return undefined;
  const filename = `rippa-part-${row.id}.webp`;
  const ex = await payload.find({ collection: "media", where: { filename: { in: [filename, `rippa-part-${row.id}.jpg`, `rippa-part-${row.id}.png`] } }, limit: 1 });
  if (ex.docs[0]) return ex.docs[0].id;
  const src = path.join(IMG, `${row.id}.img`); if (!fs.existsSync(src)) return undefined;
  const head = fs.readFileSync(src).subarray(0, 12).toString("binary");
  const ext = head.includes("WEBP") ? "webp" : head.startsWith("\x89PNG") ? "png" : "jpg";
  const tmp = path.join(IMG, `rippa-part-${row.id}.${ext}`); fs.copyFileSync(src, tmp);
  try { return (await payload.create({ collection: "media", data: { alt: `RIPPA part ${row.sku ?? row.id}: ${titleCase(row.name)}` }, filePath: tmp })).id; } catch { return undefined; } finally { fs.rmSync(tmp, { force: true }); }
}

let created = 0, updated = 0, skipped = 0;
const seenSlugs = new Set<string>();
for (const row of rows) {
  const leaves = row.categories.map((c) => c.split("/").pop()!.replace(/-\d+$/, ""));
  const models = new Set<string>(); let system = "other"; let engineBrand: string | undefined;
  for (const l of leaves) {
    const m = l.match(/^parts(?:-body|-chassis)?-(r\d{2,3}|rs\d{2}|rl06|rb06|rd06)(?:-|$)/); if (m && MODEL[m[1]]) models.add(MODEL[m[1]]);
    const tail = l.replace(/^parts(?:-body|-chassis)?(?:-(?:r\d{2,3}|rs\d{2}|rl06|rb06|rd06))?-?/, "");
    for (const [re, sys] of SYSTEM) if (re.test(tail)) { system = sys === "engine" && system !== "other" && system !== "engine" ? system : sys; break; }
    if (/briggs/.test(tail)) engineBrand = "briggs-stratton"; else if (/kubota/.test(tail)) engineBrand = "kubota";
    if (/^r\d{2,3}$|^rs\d{2}$/.test(tail) === false && /^(body|chassis)$/.test(tail)) system = system === "other" ? "body" : system;
  }
  const nameM = row.name.match(/^(R\d{2,3}|RS\d{2}|RL06|RB06|RD06)\b/i); if (nameM && MODEL[nameM[1].toLowerCase()]) models.add(MODEL[nameM[1].toLowerCase()]);
  if (system === "other") system = systemFromName(row.name) ?? (leaves.some((l) => l.startsWith("parts-body")) ? "body" : "other");
  const compatibleModels = Array.from(models).map(idOf).filter((x): x is number => typeof x === "number");
  const sku = row.sku ?? `RG-${row.id}`;
  let slug = slugify(`${row.sku ? row.sku + " " : ""}${row.name}`).slice(0, 90); if (seenSlugs.has(slug)) slug = `${slug}-${row.id}`; seenSlugs.add(slug);
  const image = await media(row);
  const data = { name: titleCase(row.name), sku, slug, system: system as PPart["system"], engineBrand: engineBrand as PPart["engineBrand"], compatibleModels, image, sourceUrl: row.url, featured: false, sortOrder: 100 };
  const ex = (await payload.find({ collection: "parts", where: { or: [{ sku: { equals: sku } }, { sourceUrl: { equals: row.url } }] }, limit: 1, depth: 0 })).docs[0];
  try {
    if (ex) { await payload.update({ collection: "parts", id: ex.id, data }); updated++; } else { await payload.create({ collection: "parts", data }); created++; }
  } catch (e) { skipped++; log(`skip ${sku} ${row.name}: ${(e as Error).message.slice(0, 120)}`); }
  if ((created + updated) % 100 === 0) log(`… ${created + updated}`);
}
log(`Parts import: ${created} created, ${updated} updated, ${skipped} skipped of ${rows.length}`);
process.exit(0);
