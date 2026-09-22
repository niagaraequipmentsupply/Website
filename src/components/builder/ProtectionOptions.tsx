"use client";
import { Check, ShieldCheck, Wrench, Truck, FileText } from "lucide-react";
import type { Addon, WarrantyOption } from "@/lib/types";
import { Toggle } from "@/components/ui/Toggle";
import { formatPrice } from "@/lib/format";
import { BuilderSection } from "./BuilderSection";

const icons = { shield: ShieldCheck, wrench: Wrench, truck: Truck, file: FileText };

interface Props {
  addons: Addon[];
  warranties: WarrantyOption[];
  selectedAddons: string[];
  warrantyId?: string;
  onToggleAddon: (id: string) => void;
  onWarranty: (id?: string) => void;
  disabled: boolean;
}

export function ProtectionOptions({ addons, warranties, selectedAddons, warrantyId, onToggleAddon, onWarranty, disabled }: Props) {
  type Option = { id: string; name: string; text: string; price?: number; on: boolean; Icon: typeof ShieldCheck; toggle: () => void; order: number };
  const options: Option[] = [
    ...addons.map((a) => ({ id: `addon:${a.id}`, name: a.name, text: a.shortDescription, price: a.price, on: selectedAddons.includes(a.id), Icon: icons[a.icon], toggle: () => onToggleAddon(a.id), order: a.sortOrder })),
    ...warranties.map((w) => ({ id: `warranty:${w.id}`, name: w.name, text: w.coverageSummary, price: w.price, on: warrantyId === w.id, Icon: ShieldCheck, toggle: () => onWarranty(warrantyId === w.id ? undefined : w.id), order: 2 })),
  ].sort((a, b) => a.order - b.order);

  return (
    <BuilderSection id="protection" step={3} title="Protection Packages" text="Add extra protection and peace of mind.">
      {disabled && <p className="mb-4 rounded-card bg-light p-4 text-center text-sm text-grey">Choose a model to see eligible packages.</p>}
      <ul className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-4 ${disabled ? "pointer-events-none opacity-50" : ""}`}>
        {options.map(({ id, name, text, price, on, Icon, toggle }) => (
          <li key={id}>
            <div className={`relative flex h-full flex-col rounded-card border-2 bg-white p-4 transition-all duration-200 ${on ? "border-navy bg-tint/30" : "border-line hover:border-electric"}`}>
              {on && <span className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-navy text-white"><Check className="size-3.5" aria-hidden /></span>}
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md text-navy"><Icon className="size-8" strokeWidth={1.6} aria-hidden /></span>
                <div>
                  <h3 className="text-[15px] font-bold text-charcoal">{name}</h3>
                  <p className="mt-1 text-[13px] leading-snug text-grey">{text}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                <p className="font-bold text-navy">{price !== undefined ? `+ ${formatPrice(price)}` : "Quote required"}</p>
                <Toggle checked={on} onChange={toggle} label={`${on ? "Remove" : "Add"} ${name}`} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </BuilderSection>
  );
}
