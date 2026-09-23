import type { Machine, SpecValue, Attachment } from "@/lib/types";

/**
 * Website display units: weight as "kg / lb", lengths in ft / in (never mm/cm/m), volumes ft³, flow gal/min,
 * speed mph, pressure psi, force lbf. Applied once when catalogue data is mapped, so components just print values.
 */
const num = (v: number, d = 0) => v.toLocaleString("en-CA", { maximumFractionDigits: d, minimumFractionDigits: 0 });
const parse = (x: string) => Number(x.replace(/,/g, ""));

export function inchesToFtIn(inches: number): string {
  if (inches < 24) return `${num(inches, inches < 10 ? 1 : 0)} in`;
  let ft = Math.floor(inches / 12);
  let rem = Math.round(inches - ft * 12);
  if (rem === 12) { ft += 1; rem = 0; }
  return rem === 0 ? `${ft} ft` : `${ft} ft ${rem} in`;
}
export const mmToFtIn = (mm: number) => inchesToFtIn(mm / 25.4);
export const kgToLb = (kg: number) => num(kg * 2.20462);

/** Convert every number in a group like "0–3 / 0–6.5" or "18 + 12 + 12" with fn. */
const group = (grp: string, fn: (n: number) => string) => grp.replace(/\d[\d,]*(?:\.\d+)?/g, (x) => fn(parse(x)));
const G = String.raw`((?:\d[\d,]*(?:\.\d+)?)(?:\s*(?:[–-]|\/|\+|to)\s*(?:\d[\d,]*(?:\.\d+)?))*)`;

/** Rewrite metric measurements inside free text to website units. Idempotent on already-imperial text. */
export function humanizeUnits(text: string): string {
  if (!text) return text;
  let t = text;
  // Strip imperial parentheticals that follow a metric value; the metric is converted below.
  t = t.replace(/(\d[\d,]*(?:\.\d+)?\s*(?:mm|cm|kg|L\/min|km\/h|kPa|MPa|kN|m³|m))\s*\(\s*[\d,.]+(?:\s*[–-]\s*[\d,.]+)?\s*(?:in|ft|lb|gal\/min|gpm|mph|psi|lbf|ft³)[^)]*\)/g, "$1");
  // "35 cm (14")" → 14"
  t = t.replace(/\d[\d,]*(?:\.\d+)?\s*cm\s*\((\d[\d,]*(?:\.\d+)?)"\)/g, '$1"');
  t = t.replace(/\d[\d,]*(?:\.\d+)?\s*cm\s*\/\s*(\d[\d,]*(?:\.\d+)?)"/g, '$1"');
  // kg → kg (lb) unless lb already follows
  t = t.replace(/(\d[\d,]*(?:\.\d+)?)\s*kg\b(?!\s*[(/]\s*[\d,]+\s*lb)(?!\s*\/\s*\d)/g, (_, k) => `${num(parse(k))} kg (${kgToLb(parse(k))} lb)`);
  // ranges & singles: mm, cm, m
  t = t.replace(new RegExp(G + String.raw`\s*mm\b`, "g"), (_, grp) => group(grp, (n) => mmToFtIn(n)));
  t = t.replace(new RegExp(G + String.raw`\s*cm\b`, "g"), (_, grp) => group(grp, (n) => mmToFtIn(n * 10)));
  t = t.replace(/(\d[\d,]*(?:\.\d+)?)\s*m³/g, (_, v) => `${num(parse(v) * 35.3147, 1)} ft³`);
  t = t.replace(new RegExp(G + String.raw`\s*m(?=[\s.,;:)]|$)`, "g"), (_, grp) => group(grp, (n) => mmToFtIn(n * 1000)));
  // speed, flow, pressure, force
  t = t.replace(new RegExp(G + String.raw`\s*km\/h`, "g"), (_, grp) => `${group(grp, (n) => num(n * 0.621371, 1))} mph`);
  t = t.replace(new RegExp(G + String.raw`\s*L\/min`, "g"), (_, grp) => `${group(grp, (n) => num(n * 0.264172, 1))} gal/min`);
  t = t.replace(new RegExp(G + String.raw`\s*L\/h`, "g"), (_, grp) => `${group(grp, (n) => num(n * 0.264172, 2))} gal/h`);
  t = t.replace(/(\d[\d,]*(?:\.\d+)?)\s*MPa\b/g, (_, v) => `${num(parse(v) * 145.038)} psi`);
  t = t.replace(/(\d[\d,]*(?:\.\d+)?)\s*kPa\b/gi, (_, v) => `${num(parse(v) * 0.145038, 1)} psi`);
  t = t.replace(/(\d[\d,]*(?:\.\d+)?)\s*kN\b/g, (_, v) => `${num(parse(v) * 224.809)} lbf`);
  // gpm → gal/min for consistency
  t = t.replace(/\bgpm\b/g, "gal/min");
  // imperial "in" values ≥ 24 → ft in (ranges too), but not inside "ft ... in"
  t = t.replace(new RegExp(G + String.raw`\s*in\b(?![a-z])`, "g"), (m, grp) => (/\bft\b/.test(m) ? m : group(grp, (n) => inchesToFtIn(n))));
  // Space out ranges between converted values: "2 ft 11 in–3 ft 11 in" → "2 ft 11 in – 3 ft 11 in"
  t = t.replace(/(?<![-\w])(in|ft|lb|mph|gal\/min|psi|lbf|ft³)\s*[–-]\s*(\d)/g, "$1 – $2"); // (?<!-) keeps "4-in-1" intact
  return t;
}

const isWeight = (label: string) => /weight|load\b|tipping/i.test(label);

/** Display string for one spec row. */
export function formatSpec(s: SpecValue): string {
  const metricKg = s.value.match(/(\d[\d,]*(?:\.\d+)?)\s*kg/);
  if (isWeight(s.label) && metricKg) {
    const kg = parse(metricKg[1]);
    const lb = s.imperial?.match(/(\d[\d,]*)\s*lb/)?.[1] ?? kgToLb(kg);
    return `${num(kg)} kg / ${lb.replace(/^(\d+)(\d{3})$/, "$1,$2")} lb`;
  }
  if (/displacement/i.test(s.label)) return s.value; // engine displacement stays in litres by convention
  if (s.imperial && s.imperial !== s.value) return humanizeUnits(s.imperial);
  return humanizeUnits(s.value);
}

export const formatWeight = (w?: string) => {
  if (!w) return w;
  const m = w.match(/(\d[\d,]*(?:\.\d+)?)\s*kg/);
  return m ? `${num(parse(m[1]))} kg / ${kgToLb(parse(m[1]))} lb` : humanizeUnits(w);
};

/** Apply website units to everything customer-facing on a machine. */
export function presentMachine(m: Machine): Machine {
  return {
    ...m,
    shortDescription: humanizeUnits(m.shortDescription), longDescription: m.longDescription ? humanizeUnits(m.longDescription) : undefined,
    operatingWeight: formatWeight(m.operatingWeight),
    specs: m.specs.map((s) => ({ ...s, value: formatSpec(s), imperial: undefined })),
    configurations: m.configurations.map((c) => ({ ...c, operatingWeight: formatWeight(c.operatingWeight) })),
    images: m.images.map((i) => ({ ...i, alt: humanizeUnits(i.alt) })),
    features: m.features.map((f) => ({ ...f, title: humanizeUnits(f.title), text: humanizeUnits(f.text), image: f.image ? { ...f.image, alt: humanizeUnits(f.image.alt) } : undefined })),
    standardEquipment: m.standardEquipment.map(humanizeUnits), applications: m.applications.map(humanizeUnits),
    faqs: m.faqs.map((f) => ({ question: humanizeUnits(f.question), answer: humanizeUnits(f.answer) })),
    applicationFit: m.applicationFit.map((a) => ({ ...a, attachments: a.attachments ? humanizeUnits(a.attachments) : undefined })),
    targetUsers: m.targetUsers ? humanizeUnits(m.targetUsers) : undefined,
  };
}
export function presentAttachment(a: Attachment): Attachment {
  return { ...a, description: humanizeUnits(a.description), longDescription: a.longDescription ? humanizeUnits(a.longDescription) : undefined,
    variants: a.variants.map((v) => ({ ...v, label: humanizeUnits(v.label), widthOrSize: v.widthOrSize ? humanizeUnits(v.widthOrSize) : undefined })) };
}
