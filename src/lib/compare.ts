import type { Machine, SpecGroup } from "@/lib/types";

export const DEFAULT_COMPARE = ["r10-eco", "r13-pro", "r15-eco"];
export const MAX_COMPARE = 4;

/** `?models=r10-eco,r13-pro` → clean slug list (deduped, lower-case, max 4). */
export function parseModelsParam(param?: string | string[]): string[] {
  const raw = Array.isArray(param) ? param.join(",") : param ?? "";
  const out: string[] = [];
  for (const s of raw.split(",").map((x) => x.trim().toLowerCase()).filter(Boolean)) if (!out.includes(s)) out.push(s);
  return out.slice(0, MAX_COMPARE);
}

export function resolveCompareModels(machines: Machine[], slugs: string[]): Machine[] {
  return slugs.map((s) => machines.find((m) => m.slug === s || m.id === s)).filter((m): m is Machine => !!m);
}

export const compareHref = (slugs: string[]) => (slugs.length ? `/compare?models=${slugs.join(",")}` : "/compare");

/** Canonical column order for a comparison: catalogue sort order, then model name. Links and canonicals must agree. */
export function sortForCompare<T extends Pick<Machine, "sortOrder" | "modelName">>(machines: T[]): T[] {
  return [...machines].sort((a, b) => a.sortOrder - b.sortOrder || a.modelName.localeCompare(b.modelName));
}

export const isDefaultCompare = (slugs: string[]) => slugs.length === DEFAULT_COMPARE.length && DEFAULT_COMPARE.every((s) => slugs.includes(s));

/** The one URL a comparison of these machines should be linked and canonicalised to; the default trio lives at /compare itself. */
export function canonicalCompareHref(machines: Pick<Machine, "slug" | "sortOrder" | "modelName">[]): string {
  const slugs = sortForCompare(machines).map((m) => m.slug);
  return isDefaultCompare(slugs) ? "/compare" : compareHref(slugs);
}

type CompareKey = Pick<Machine, "id" | "slug" | "sortOrder" | "modelName" | "category">;
/** The "compare side by side" link on a machine page: the machine plus the next two in its category. The sitemap lists the same URLs. */
export function relatedCompareHref(m: CompareKey, machines: CompareKey[]): string {
  const related = machines.filter((x) => x.category === m.category && x.id !== m.id).slice(0, 2);
  return canonicalCompareHref([m, ...related]);
}

export interface CompareRow { label: string; values: (string | undefined)[]; imperial: (string | undefined)[]; differs: boolean }
export interface CompareGroup { group: SpecGroup; label: string; rows: CompareRow[] }

const GROUP_LABELS: Record<SpecGroup, string> = { general: "General", performance: "Performance", engine: "Engine & hydraulics", dimensions: "Dimensions" };
const GROUP_ORDER: SpecGroup[] = ["general", "performance", "engine", "dimensions"];

/** Union of every spec label across the compared machines, grouped like the spec table, differences flagged. */
export function buildCompareRows(machines: Machine[]): CompareGroup[] {
  const labels: { label: string; group: SpecGroup }[] = [];
  for (const m of machines) for (const s of m.specs) if (!labels.some((l) => l.label === s.label)) labels.push({ label: s.label, group: s.group ?? "general" });
  return GROUP_ORDER.map((group) => ({
    group,
    label: GROUP_LABELS[group],
    rows: labels.filter((l) => l.group === group).map(({ label }) => {
      const specs = machines.map((m) => m.specs.find((s) => s.label === label));
      const values = specs.map((s) => s?.value);
      const present = values.filter((v): v is string => !!v);
      return { label, values, imperial: specs.map((s) => s?.imperial), differs: present.length > 1 && new Set(present).size > 1 };
    }),
  })).filter((g) => g.rows.length);
}

/** Highlight specs (the ones flagged on cards) across the compared machines, for the summary strip. */
export function highlightLabels(machines: Machine[]): string[] {
  const out: string[] = [];
  for (const m of machines) for (const s of m.specs) if (s.highlight && !out.includes(s.label)) out.push(s.label);
  return out.slice(0, 5);
}
