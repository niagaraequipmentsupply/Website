"use client";
import { Percent, Banknote, CreditCard } from "lucide-react";
import Link from "next/link";
import type { FinanceSelection, FinancingConfig } from "@/lib/types";
import { BuilderSection } from "./BuilderSection";
import { track } from "@/lib/analytics";

const options: { id: FinanceSelection; label: string; text: string; Icon: typeof Banknote }[] = [
  { id: "cash", label: "Pay in Full", text: "Cheque, EFT or card. Delivered price confirmed on your written quote.", Icon: Banknote },
  { id: "finance", label: "Finance / Leasing", text: "Monthly payments or lease-to-own through our financing partner, on approved credit.", Icon: CreditCard },
];

/** Step 4: how the customer plans to pay. Older saved builds with "lease" count as financing. */
export function FinancingSelector({ value, onChange, config }: { value: FinanceSelection; onChange: (v: FinanceSelection) => void; config: FinancingConfig }) {
  const current: FinanceSelection = value === "lease" ? "finance" : value;
  return (
    <BuilderSection id="financing" step={4} title="Payment Method" text="Tell us how you plan to pay and we will quote it that way.">
      <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
        <fieldset>
          <legend className="sr-only">Payment method</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {options.map((o) => {
              const on = current === o.id;
              return (
                <label key={o.id} className={`flex cursor-pointer items-start gap-3 rounded-card border-2 p-4 transition-colors ${on ? "border-navy bg-tint/40" : "border-line hover:border-electric"}`}>
                  <input type="radio" name="finance" value={o.id} checked={on} onChange={() => onChange(o.id)} className="mt-1 size-5 accent-navy" />
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 font-bold text-charcoal"><o.Icon className="size-4 text-navy" aria-hidden />{o.label}</span>
                    <span className="mt-1 block text-[12px] leading-snug text-grey">{o.text}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <div className="flex items-center gap-4 rounded-card bg-tint p-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-navy"><Percent className="size-6" aria-hidden /></span>
          <div className="text-sm">
            <p className="font-semibold text-charcoal">Financing and leasing available.</p>
            <p className="text-grey">Pre-approval in minutes, on approved credit.</p>
            <Link href="/financing" onClick={() => track({ name: "financing_click", location: "builder" })} className="font-semibold text-navy underline-offset-2 hover:underline">Financing options →</Link>
          </div>
        </div>
      </div>
      <p className="mt-3 text-[12px] text-grey">{config.disclaimer}</p>
    </BuilderSection>
  );
}
