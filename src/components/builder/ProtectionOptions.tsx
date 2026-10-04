"use client";
import { Check, ShieldCheck, Wrench, Truck, FileText, Package } from "lucide-react";
import type { Addon, WarrantyOption } from "@/lib/types";
import { Toggle } from "@/components/ui/Toggle";
import { formatPrice } from "@/lib/format";
import { PRICES_ENABLED } from "@/lib/pricing";
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

/**
 * Step 3: the 50-hour service package (one of two, or none) plus protection and delivery add-ons.
 * Service options are mutually exclusive; everything else toggles independently.
 */
export function ProtectionOptions({ addons, warranties, selectedAddons, warrantyId, onToggleAddon, onWarranty, disabled }: Props) {
  const service = addons.filter((a) => a.type === "service");
  const others = addons.filter((a) => a.type !== "service");
  const currentService = service.find((a) => selectedAddons.includes(a.id));
  const pickService = (id?: string) => {
    if (currentService && currentService.id !== id) onToggleAddon(currentService.id);
    if (id && !selectedAddons.includes(id)) onToggleAddon(id);
  };
  const price = (p?: number) => (PRICES_ENABLED && p !== undefined ? `+ ${formatPrice(p)}` : "Quoted with your build");

  type Option = { id: string; name: string; text: string; price?: number; on: boolean; Icon: typeof ShieldCheck; toggle: () => void; order: number };
  const options: Option[] = [
    ...others.map((a) => ({ id: `addon:${a.id}`, name: a.name, text: a.shortDescription, price: a.price, on: selectedAddons.includes(a.id), Icon: icons[a.icon], toggle: () => onToggleAddon(a.id), order: a.sortOrder })),
    ...warranties.map((w) => ({ id: `warranty:${w.id}`, name: w.name, text: w.coverageSummary, price: w.price, on: warrantyId === w.id, Icon: ShieldCheck, toggle: () => onWarranty(warrantyId === w.id ? undefined : w.id), order: 50 })),
  ].sort((a, b) => a.order - b.order);

  return (
    <BuilderSection id="protection" step={3} title="Service & Protection" text="Pre-pay your first 50-hour service at package pricing, then add protection and delivery.">
      {disabled ? <p className="rounded-card bg-light p-6 text-center text-sm text-grey">Choose a model above to see the 50-hour service package, protection and delivery options.</p> : (
      <div>
        {service.length > 0 && (
          <fieldset className="mb-6 rounded-card border border-line bg-light/50 p-4 md:p-5">
            <legend className="sr-only">50-hour service package</legend>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Package className="size-5 text-navy" aria-hidden />
              <h3 className="text-[15px] font-bold text-charcoal">50-Hour Service Package</h3>
              <span className="chamfer bg-navy px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">Package savings with a machine</span>
            </div>
            <p className="mb-3 text-[13px] text-grey">The first service sets up the engine and hydraulics for a long life. Choose how you want it done; either way it is priced lower bundled with your machine than booked later.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {service.map((a) => {
                const on = selectedAddons.includes(a.id);
                return (
                  <label key={a.id} className={`flex cursor-pointer gap-3 rounded-card border-2 bg-white p-4 transition-colors ${on ? "border-navy bg-tint/30" : "border-line hover:border-electric"}`}>
                    <input type="radio" name="service-package" value={a.id} checked={on} onChange={() => pickService(a.id)} className="mt-1 size-5 shrink-0 accent-navy" />
                    <span className="min-w-0">
                      <span className="block text-[15px] font-bold text-charcoal">{a.name}</span>
                      <span className="mt-1 block text-[13px] leading-snug text-grey">{a.shortDescription}</span>
                      <span className="mt-2 block text-[13px] font-bold text-navy">{price(a.price)}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            <button type="button" onClick={() => pickService(undefined)} className={`mt-3 text-[12px] font-semibold ${currentService ? "text-grey hover:text-navy" : "text-navy"}`} aria-pressed={!currentService}>
              {currentService ? "Skip the service package for now" : "No service package selected"}
            </button>
          </fieldset>
        )}

        {options.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {options.map(({ id, name, text, price: p, on, Icon, toggle }) => (
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
                    <p className="font-bold text-navy">{price(p)}</p>
                    <Toggle checked={on} onChange={toggle} label={`${on ? "Remove" : "Add"} ${name}`} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      )}
    </BuilderSection>
  );
}
