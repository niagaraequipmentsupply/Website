import type { Addon, Attachment, BuilderConfiguration, BuildTotals, FinancingConfig, Machine, PricedLine, WarrantyOption } from "@/lib/types";

export interface Catalogue {
  machines: Machine[];
  attachments: Attachment[];
  addons: Addon[];
  warranties: WarrantyOption[];
}

export function attachmentUnitPrice(att: Attachment, variantId?: string): number | undefined {
  if (!att.showPrice) return undefined;
  if (att.variants.length > 0) {
    const v = att.variants.find((x) => x.id === variantId) ?? att.variants[0];
    return v?.price;
  }
  return att.basePrice;
}

/** Lowest published price across configurations ("Starting from"), else base/promo price. */
export function machinePrice(m: Machine): number | undefined {
  if (!m.showPrice) return undefined;
  const cfgPrices = (m.configurations ?? []).map((c) => c.price).filter((p): p is number => typeof p === "number");
  if (cfgPrices.length) return Math.min(...cfgPrices);
  return m.promoPrice ?? m.basePrice;
}

/** Price for a specific configuration, falling back to the machine's starting price. */
export function machineConfigPrice(m: Machine, configurationId?: string): number | undefined {
  if (!m.showPrice) return undefined;
  const c = m.configurations?.find((x) => x.id === configurationId);
  return c?.price ?? machinePrice(m);
}

export const machineHasMultiplePrices = (m: Machine) => new Set((m.configurations ?? []).map((c) => c.price).filter((p) => p !== undefined)).size > 1;

export function buildLines(config: BuilderConfiguration, cat: Catalogue): PricedLine[] {
  const lines: PricedLine[] = [];
  const machine = cat.machines.find((m) => m.id === config.selectedModelId);
  if (machine) {
    const cfg = machine.configurations?.find((c) => c.id === config.selectedConfigurationId);
    const price = machineConfigPrice(machine, cfg?.id);
    lines.push({ id: `machine:${machine.id}`, group: "machine", label: `${machine.brand} ${machine.modelName}`, detail: cfg?.label ?? machine.series, quantity: 1, unitPrice: price, lineTotal: price, quoteRequired: price === undefined });
  }
  for (const sel of config.attachmentSelections) {
    const att = cat.attachments.find((a) => a.id === sel.attachmentId);
    if (!att) continue;
    const variant = att.variants.find((v) => v.id === sel.variantId);
    const unit = attachmentUnitPrice(att, sel.variantId);
    lines.push({
      id: `attachment:${att.id}:${sel.variantId ?? "base"}`, group: "attachment", label: att.name, detail: variant?.widthOrSize ? `${variant.widthOrSize}` : undefined,
      quantity: sel.quantity, unitPrice: unit, lineTotal: unit === undefined ? undefined : unit * sel.quantity, quoteRequired: unit === undefined,
    });
  }
  for (const id of config.addonSelections) {
    const addon = cat.addons.find((a) => a.id === id);
    if (!addon) continue;
    const group = addon.type === "delivery" || addon.type === "pdi" ? "delivery" : "protection";
    lines.push({ id: `addon:${addon.id}`, group, label: addon.name, quantity: 1, unitPrice: addon.price, lineTotal: addon.price, quoteRequired: addon.price === undefined || !!addon.quoteRequired });
  }
  if (config.warrantySelectionId) {
    const w = cat.warranties.find((x) => x.id === config.warrantySelectionId);
    if (w) lines.push({ id: `warranty:${w.id}`, group: "warranty", label: w.name, detail: `${w.termMonths} months`, quantity: 1, unitPrice: w.price, lineTotal: w.price, quoteRequired: w.price === undefined });
  }
  return lines;
}

export function calculateTotals(config: BuilderConfiguration, cat: Catalogue, taxRate?: number): BuildTotals {
  const lines = buildLines(config, cat);
  const subtotal = lines.reduce((sum, l) => sum + (l.lineTotal ?? 0), 0);
  const taxEstimate = taxRate === undefined ? undefined : Math.round(subtotal * taxRate);
  const total = subtotal + (taxEstimate ?? 0);
  const unpricedCount = lines.filter((l) => l.quoteRequired).length;
  return { lines, subtotal, taxEstimate, total, unpricedCount };
}

/** Indicative monthly payment. Returns undefined unless the dealer has configured assumptions. */
export function monthlyEstimate(amount: number, fin: FinancingConfig): number | undefined {
  if (!fin.showEstimates || !fin.annualRate || !fin.termMonths || amount <= 0) return undefined;
  const principal = amount * (1 - (fin.downPaymentPercent ?? 0) / 100);
  const r = fin.annualRate / 100 / 12;
  const n = fin.termMonths;
  if (r === 0) return Math.round(principal / n);
  return Math.round((principal * r) / (1 - Math.pow(1 + r, -n)));
}
