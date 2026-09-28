"use client";
import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import type { Machine, MachineConfiguration } from "@/lib/types";
import { AddToQuoteButton } from "./AddToQuoteButton";

/**
 * Turns the flat configuration list ("Kubota Z482 diesel · Enclosed cab") into pickers per axis:
 * Engine, Cab, Undercarriage. Options that no configuration offers with the current picks are disabled,
 * so the R10 shows gas/diesel × canopy/cab while the R13 shows nothing to pick.
 */
type Axis = "Engine" | "Cab" | "Undercarriage" | "Boom" | "Body" | "Option";
const axisOf = (part: string): Axis => /canopy|cab\b|stand-on|stand on/i.test(part) ? "Cab" : /gas|diesel|kubota|briggs|yanmar|honda|engine|kohler/i.test(part) ? "Engine" : /track|wheel/i.test(part) ? "Undercarriage" : /boom/i.test(part) ? "Boom" : /body/i.test(part) ? "Body" : "Option";
const ORDER: Axis[] = ["Engine", "Cab", "Undercarriage", "Boom", "Body", "Option"];
const short = (part: string) => part.replace(/\s*\((.*?)\)/g, "").replace(/^Briggs & Stratton( \w+)? gasoline$/i, "Gas (Briggs & Stratton)").replace(/^Kubota (\S+) diesel$/i, "Diesel (Kubota $1)").replace(/^Kubota (\S+)$/i, "Kubota $1");

function parse(c: MachineConfiguration): Partial<Record<Axis, string>> {
  const out: Partial<Record<Axis, string>> = {};
  for (const part of c.label.split(/\s*·\s*/)) { const a = axisOf(part); if (!out[a]) out[a] = part.trim(); }
  return out;
}

/** Controlled axis buttons: pick engine / cab / undercarriage and get the matching configuration id back. */
export function ConfigurationAxes({ machine, value, onChange, compact = false }: { machine: Machine; value?: string; onChange: (configurationId: string) => void; compact?: boolean }) {
  const cfgs = machine.configurations;
  const parsed = useMemo(() => new Map(cfgs.map((c) => [c.id, parse(c)])), [cfgs]);
  const axes = useMemo(() => ORDER.map((axis) => ({ axis, options: Array.from(new Set(cfgs.map((c) => parsed.get(c.id)?.[axis]).filter((x): x is string => !!x))) })).filter((a) => a.options.length > 1), [cfgs, parsed]);
  const current = cfgs.find((c) => c.id === value) ?? cfgs[0];
  const picks = current ? parsed.get(current.id) ?? {} : {};
  const matches = (p: Partial<Record<Axis, string>>) => cfgs.filter((c) => axes.every((a) => !p[a.axis] || parsed.get(c.id)?.[a.axis] === p[a.axis]));
  const pick = (axis: Axis, val: string) => {
    const exact = matches({ ...picks, [axis]: val })[0];
    // If the combination is not offered, keep the chosen option and take the first configuration that has it.
    const next = exact ?? cfgs.find((c) => parsed.get(c.id)?.[axis] === val);
    if (next) onChange(next.id);
  };
  const available = (axis: Axis, val: string) => matches({ ...picks, [axis]: val }).length > 0;
  if (axes.length === 0) return null;
  const btn = compact ? "h-8 px-2.5 text-[12px]" : "h-10 px-3 text-sm";
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {axes.map((a) => (
        <fieldset key={a.axis}>
          <legend className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-grey">{a.axis}</legend>
          <div className="flex flex-wrap gap-1.5">
            {a.options.map((o) => {
              const on = picks[a.axis] === o; const ok = available(a.axis, o);
              return (
                <button key={o} type="button" onClick={() => pick(a.axis, o)} aria-pressed={on} title={ok ? o : `${o}: not offered with the other options selected`}
                  className={`chamfer inline-flex items-center gap-1 border-2 font-bold uppercase tracking-[0.08em] transition-colors ${btn} ${on ? "border-navy bg-navy text-white" : ok ? "border-charcoal/70 bg-white text-charcoal hover:border-navy hover:text-navy" : "border-dashed border-line bg-light text-grey"}`}>
                  {on && <Check className="size-3.5" aria-hidden />}{short(o)}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

/** Product-page picker: axes + selected configuration summary + Add to Quote. */
export function ConfigurationPicker({ machine, size = "lg" }: { machine: Machine; size?: "md" | "lg" }) {
  const cfgs = machine.configurations;
  const [id, setId] = useState<string | undefined>(cfgs[0]?.id);
  const current = cfgs.find((c) => c.id === id) ?? cfgs[0];
  if (cfgs.length === 0) return <AddToQuoteButton kind="machine" id={machine.id} size={size} />;
  return (
    <div className="rounded-card border border-line bg-white p-4">
      <ConfigurationAxes machine={machine} value={id} onChange={setId} />
      {current && (
        <dl className={`grid grid-cols-3 gap-2 text-[13px] ${cfgs.length > 1 ? "mt-3 border-t border-line pt-3" : ""}`}>
          <div><dt className="text-[11px] uppercase tracking-wide text-grey">Engine</dt><dd className="font-semibold text-charcoal">{current.engine ?? "—"}</dd></div>
          <div><dt className="text-[11px] uppercase tracking-wide text-grey">Power</dt><dd className="font-semibold text-charcoal">{current.horsepower ?? "—"}</dd></div>
          <div><dt className="text-[11px] uppercase tracking-wide text-grey">Weight</dt><dd className="font-semibold text-charcoal">{current.operatingWeight ?? "—"}</dd></div>
        </dl>
      )}
      <p className="mt-3 text-[13px] text-grey">Selected: <span className="font-semibold text-charcoal">{machine.modelName} · {current?.label}</span></p>
      <AddToQuoteButton kind="machine" id={machine.id} configurationId={current?.id} size={size} className="mt-3 w-full" />
    </div>
  );
}
