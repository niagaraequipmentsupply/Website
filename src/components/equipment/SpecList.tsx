import { Weight, Cog, MoveVertical, ShieldCheck, Zap, Box, Ruler, ArrowRightLeft, Info, ArrowUpFromLine } from "lucide-react";
import type { SpecValue } from "@/lib/types";

const icons = { weight: Weight, engine: Cog, depth: MoveVertical, warranty: ShieldCheck, power: Zap, capacity: Box, width: Ruler, reach: ArrowRightLeft, lift: ArrowUpFromLine, generic: Info };

/**
 * Card / summary rows: a fixed, ordered set of key specs picked by label so every model shows the same five,
 * each with its own icon and a short label. Falls back to highlighted specs if none of the keys match.
 */
const CARD_ROWS: { key: string; match: RegExp; icon: keyof typeof icons; suffix: string }[] = [
  { key: "weight", match: /^operating weight$/i, icon: "weight", suffix: " operating weight" },
  { key: "engine", match: /^engine$/i, icon: "engine", suffix: " engine" },
  { key: "power", match: /^(max power|rated power|horsepower)$/i, icon: "power", suffix: "" },
  { key: "depth", match: /^max dig(ging)? depth$/i, icon: "depth", suffix: " dig depth" },
  { key: "lift", match: /^max lift height$/i, icon: "lift", suffix: " lift height" },
  { key: "load", match: /^rated load$/i, icon: "capacity", suffix: " rated load" },
  { key: "width", match: /^(min )?transport width$/i, icon: "width", suffix: " track width" },
];

export function cardSpecs(specs: SpecValue[]): { label: string; text: string; icon: keyof typeof icons }[] {
  const rows = CARD_ROWS.flatMap((r) => { const s = specs.find((x) => r.match.test(x.label)); return s ? [{ label: s.label, text: `${s.value}${r.suffix}`, icon: r.icon }] : []; });
  // Excavators: weight, engine, hp, dig depth, width. Loaders: weight, engine, hp, lift height, rated load.
  const picked = rows.some((r) => r.icon === "depth") ? rows.filter((r) => r.icon !== "lift" && r.icon !== "capacity") : rows.filter((r) => r.icon !== "width" || rows.length < 5);
  if (picked.length) return picked.slice(0, 5);
  return specs.filter((s) => s.highlight).slice(0, 5).map((s) => ({ label: s.label, text: `${s.label}: ${s.value}`, icon: (s.icon ?? "generic") as keyof typeof icons }));
}

export function SpecList({ specs, compact, className = "" }: { specs: SpecValue[]; compact?: boolean; className?: string }) {
  if (!specs.length) return <p className={`text-sm text-grey ${className}`}>Specifications to be confirmed.</p>;
  const rows = compact ? cardSpecs(specs) : specs.map((s) => ({ label: s.label, text: `${s.label}: ${s.value}`, icon: (s.icon ?? "generic") as keyof typeof icons }));
  return (
    <ul className={`space-y-1.5 ${className}`}>
      {rows.map((r) => {
        const Icon = icons[r.icon];
        return (
          <li key={r.label} className={`flex items-center gap-2 ${compact ? "text-[13px]" : "text-sm"} text-grey`}>
            <Icon className="size-4 shrink-0 text-navy" strokeWidth={1.75} aria-hidden />
            <span><span className="sr-only">{r.label}: </span>{r.text}</span>
          </li>
        );
      })}
    </ul>
  );
}
