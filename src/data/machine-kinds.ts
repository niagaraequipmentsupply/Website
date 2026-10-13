/**
 * What each model is, in the words buyers search with. `kind` is the Title-Case machine type for H1s, page titles and
 * schema ("RIPPA R10 ECO Mini Excavator"); `noun` is the lower-case phrase with the weight class used in every image
 * alt and caption ("RIPPA R10 ECO 1-ton mini excavator with open canopy"). Weight classes follow the brochure
 * operating weights (R18 PRO 1,933 kg → 2-ton class, R32 PRO 3,623 kg → 3.5-ton, R57 PRO 5,792 kg → 5.8-ton midi).
 */
export const MACHINE_KINDS: Record<string, { kind: string; noun: string }> = {
  "r06-eco": { kind: "Micro Excavator", noun: "micro excavator" },
  "r10-eco": { kind: "Mini Excavator", noun: "1-ton mini excavator" },
  "r13-pro": { kind: "Mini Excavator", noun: "1.3-ton mini excavator" },
  "r15-eco": { kind: "Mini Excavator", noun: "1.5-ton mini excavator" },
  "r18-pro": { kind: "Mini Excavator", noun: "2-ton mini excavator" },
  "r22-pro": { kind: "Mini Excavator", noun: "2.5-ton mini excavator" },
  "r32-pro": { kind: "Mini Excavator", noun: "3.5-ton mini excavator" },
  "r57-pro": { kind: "Midi Excavator", noun: "5.8-ton midi excavator" },
  "r82-pro": { kind: "Excavator", noun: "8-ton excavator" },
  "r230-pro": { kind: "Excavator", noun: "21.5-ton excavator" },
  rs03: { kind: "Mini Skid Steer", noun: "stand-on mini skid steer" },
  rs04: { kind: "Mini Skid Steer", noun: "stand-on mini skid steer" },
  rs06: { kind: "Mini Skid Steer", noun: "stand-on mini skid steer" },
  rs07: { kind: "Skid Steer", noun: "compact skid steer loader" },
  rs10: { kind: "Skid Steer", noun: "wheeled skid steer loader" },
  rs20: { kind: "Compact Track Loader", noun: "compact track loader" },
  rl06: { kind: "Compact Wheel Loader", noun: "compact wheel loader" },
  rb06: { kind: "Backhoe Loader", noun: "compact backhoe loader" },
  rd06: { kind: "Track Dumper", noun: "tracked mini dumper" },
};

/** "Mini Excavator" for the R10 ECO; falls back to the series name ("Backhoe Loader") or the category singular. */
export function machineKind(slug: string, series: string | undefined, categoryShortName: string | undefined): string {
  return MACHINE_KINDS[slug]?.kind ?? (series && !/series$/i.test(series) ? series : (categoryShortName ?? "").replace(/s$/, ""));
}

/** "1-ton mini excavator" for alt text and captions; falls back to the lower-cased kind. */
export function machineNoun(slug: string, series?: string, categoryShortName?: string): string {
  return MACHINE_KINDS[slug]?.noun ?? machineKind(slug, series, categoryShortName).toLowerCase();
}
