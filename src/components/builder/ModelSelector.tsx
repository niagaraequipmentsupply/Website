"use client";
import { Check } from "lucide-react";
import type { Machine } from "@/lib/types";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { SpecList } from "@/components/equipment/SpecList";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BuilderSection } from "./BuilderSection";
import { formatPrice } from "@/lib/format";
import { machinePrice, machineHasMultiplePrices } from "@/lib/pricing";

interface Props {
  machines: Machine[];
  selectedId?: string;
  configurationId?: string;
  onSelect: (id: string) => void;
  onConfiguration: (id?: string) => void;
}

export function ModelSelector({ machines, selectedId, configurationId, onSelect, onConfiguration }: Props) {
  return (
    <BuilderSection id="choose-model" step={1} title="Choose Your Model" text="Select the excavator that fits your job requirements." link={{ href: "/inventory/excavators#compare", label: "Need help? Compare models" }}>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {machines.map((m) => {
          const selected = m.id === selectedId;
          return (
            <li key={m.id}>
              <div className={`relative flex h-full flex-col rounded-card border-2 bg-white p-4 transition-all duration-200 ${selected ? "border-navy bg-tint/30 shadow-card" : "border-line hover:border-electric"}`}>
                {m.badge && <Badge className="absolute left-3 top-3 z-[1]">{m.badge}</Badge>}
                {selected && <span className="absolute right-3 top-3 z-[1] flex size-7 items-center justify-center rounded-full bg-navy text-white"><Check className="size-4" aria-hidden /></span>}
                <EquipmentImage image={m.images[0]} kind="excavators" alt={`${m.brand} ${m.modelName}`} />
                <h3 className="display mt-3 text-2xl text-charcoal">{m.modelName}</h3>
                <SpecList specs={m.specs.filter((s) => s.highlight)} compact className="mt-2 flex-1" />
                {selected && m.configurations.length > 1 ? (
                  <label className="mt-3 block text-[12px] font-semibold text-grey">
                    Configuration
                    <select value={configurationId ?? ""} onChange={(e) => onConfiguration(e.target.value || undefined)} className="mt-1 h-10 w-full rounded-btn border border-navy bg-white px-2 text-sm font-medium text-charcoal">
                      <option value="">Choose configuration…</option>
                      {m.configurations.map((c) => <option key={c.id} value={c.id}>{c.label}{c.price !== undefined ? ` — ${formatPrice(c.price)}` : ""}</option>)}
                    </select>
                  </label>
                ) : (
                  <p className="mt-3 text-sm font-bold text-navy">{machinePrice(m) !== undefined ? `${machineHasMultiplePrices(m) ? "From " : ""}${formatPrice(machinePrice(m))}` : "Request pricing"}</p>
                )}
                <Button onClick={() => onSelect(m.id)} variant={selected ? "primary" : "secondary"} size="sm" className="mt-4 w-full" aria-pressed={selected} icon={selected ? <Check className="size-4" aria-hidden /> : undefined}>
                  {selected ? "Selected" : "Select"}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </BuilderSection>
  );
}
