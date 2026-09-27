/**
 * Customer-facing attachment groups. Attachment records keep RIPPA's fine-grained `attachmentType`
 * ("Tilt Buckets", "Skeleton & Rock Buckets"); the site navigates by these broader groups so a machine page
 * shows Buckets, Grapples, Augers… instead of a dozen one-item sections.
 */
const RULES: [RegExp, string][] = [
  [/bucket/i, "Buckets"],
  [/grapple/i, "Grapples"],
  [/thumb/i, "Thumbs"],
  [/auger|drill/i, "Augers & Drills"],
  [/breaker|hammer/i, "Breakers & Hammers"],
  [/coupler|quick|plate/i, "Couplers & Plates"],
  [/rake|ripper/i, "Rakes & Rippers"],
  [/mower|mulch|cutter|brush|forestry|clearing|stump/i, "Mowing & Clearing"],
  [/blade|grader|leveler|snow|dozer/i, "Blades, Graders & Snow"],
  [/fork/i, "Forks"],
  [/concrete|mix/i, "Concrete & Mixing"],
  [/sweep|broom/i, "Sweepers"],
  [/trench/i, "Trenchers"],
  [/extension/i, "Extension Arms"],
  [/wood|log|chipper|splitter/i, "Wood Processing"],
  [/till|plow|aerat|soil|renovat|roller/i, "Ground Prep"],
];
const ORDER = ["Buckets", "Thumbs", "Couplers & Plates", "Grapples", "Augers & Drills", "Breakers & Hammers", "Rakes & Rippers", "Tilt Buckets", "Forks", "Blades, Graders & Snow", "Mowing & Clearing", "Trenchers", "Sweepers", "Concrete & Mixing", "Wood Processing", "Ground Prep", "Extension Arms", "Specialty"];

export function groupOf(attachmentType: string): string {
  for (const [re, g] of RULES) if (re.test(attachmentType)) return g;
  return "Specialty";
}
export const groupRank = (g: string) => { const i = ORDER.indexOf(g); return i === -1 ? ORDER.length : i; };
/** Group a list by display group, in catalogue order. */
export function groupAttachments<T extends { attachmentType: string }>(items: T[]): [string, T[]][] {
  const m = new Map<string, T[]>();
  for (const a of items) { const g = groupOf(a.attachmentType); m.set(g, [...(m.get(g) ?? []), a]); }
  return Array.from(m.entries()).sort((a, b) => groupRank(a[0]) - groupRank(b[0]));
}
