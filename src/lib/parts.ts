import type { Part } from "@/lib/types";
/** Part systems (shared by the CMS select and the site). */
export const partSystems = [
  { label: "Filters & service", value: "filters" }, { label: "Engine", value: "engine" }, { label: "Fuel system", value: "fuel-system" },
  { label: "Hydraulic system", value: "hydraulic-system" }, { label: "Hydraulic cylinders", value: "hydraulic-cylinders" }, { label: "Hydraulic components", value: "hydraulic-components" },
  { label: "Electrical system", value: "electrical" }, { label: "Undercarriage & tracks", value: "undercarriage" }, { label: "Traction & drive", value: "traction" },
  { label: "Upper frame & body", value: "body" }, { label: "Work equipment (boom, arm, bucket)", value: "work-equipment" }, { label: "Canopy & cab", value: "canopy" },
  { label: "Controls & seat", value: "controls" }, { label: "Decals", value: "decals" }, { label: "Accessories", value: "accessories" }, { label: "Other", value: "other" },
];

export const systemLabel = (value: string) => partSystems.find((s) => s.value === value)?.label ?? "Other";
export const systemOrder = partSystems.map((s) => s.value);
/** Parts listed for a machine, grouped by system in catalogue order. */
export function partsForMachine(parts: Part[], machineId: string): [string, Part[]][] {
  const m = new Map<string, Part[]>();
  for (const p of parts) if (p.compatibleModelIds.includes(machineId)) m.set(p.system, [...(m.get(p.system) ?? []), p]);
  return Array.from(m.entries()).sort((a, b) => systemOrder.indexOf(a[0]) - systemOrder.indexOf(b[0]));
}
