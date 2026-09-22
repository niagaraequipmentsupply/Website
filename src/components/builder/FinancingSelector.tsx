"use client";
import { Percent } from "lucide-react";
import Link from "next/link";
import type { FinanceSelection, FinancingConfig } from "@/lib/types";
import { BuilderSection } from "./BuilderSection";
import { track } from "@/lib/analytics";

const options: { id: FinanceSelection; label: string; text: string }[] = [
  { id: "cash", label: "Cash", text: "Pay in full" },
  { id: "finance", label: "Finance", text: "Low monthly payments" },
  { id: "lease", label: "Lease", text: "Flexible terms" },
];

export function FinancingSelector({ value, onChange, config }: { value: FinanceSelection; onChange: (v: FinanceSelection) => void; config: FinancingConfig }) {
  return (
    <BuilderSection id="financing" step={4} title="Financing Options" text="Choose a financing solution that works for your business.">
      <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
        <fieldset>
          <legend className="sr-only">Payment preference</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {options.map((o) => {
              const on = value === o.id;
              return (
                <label key={o.id} className={`flex cursor-pointer items-center gap-3 rounded-card border-2 p-4 transition-colors ${on ? "border-navy bg-tint/40" : "border-line hover:border-electric"}`}>
                  <input type="radio" name="finance" value={o.id} checked={on} onChange={() => onChange(o.id)} className="size-5 accent-navy" />
                  <span>
                    <span className="block font-bold text-charcoal">{o.label}</span>
                    <span className="block text-[12px] text-grey">{o.text}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <div className="flex items-center gap-4 rounded-card bg-tint p-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-navy"><Percent className="size-6" aria-hidden /></span>
          <div className="text-sm">
            <p className="font-semibold text-charcoal">Flexible financing available.</p>
            <p className="text-grey">Get pre-approved in minutes.</p>
            <Link href="/financing" onClick={() => track({ name: "financing_click", location: "builder" })} className="font-semibold text-navy underline-offset-2 hover:underline">Financing options →</Link>
          </div>
        </div>
      </div>
      <p className="mt-3 text-[12px] text-grey">{config.disclaimer}</p>
    </BuilderSection>
  );
}
