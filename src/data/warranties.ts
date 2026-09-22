import type { WarrantyOption } from "@/lib/types";

/** PLACEHOLDER — confirm tiers, eligibility and pricing with RIPPA / dealer. */
export const warranties: WarrantyOption[] = [
  { id: "wty-ext-48", name: "Extended Warranty (4 Year)", termMonths: 48, coverageSummary: "Up to 4 years of extended coverage for added peace of mind.", eligibleModelIds: "all", price: 1295, financeEligible: true, sortOrder: 1 },
];
