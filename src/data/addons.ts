import type { Addon, DeliveryOption } from "@/lib/types";

/** PLACEHOLDER — prices mirror the mockups. Confirm scope + pricing with the dealer. */
export const addons: Addon[] = [
  { id: "addon-rustproof", name: "Rustproof Package", type: "protection", icon: "shield", shortDescription: "Protect your investment with advanced rust inhibitor treatment.", price: 695, compatibleModelIds: "all", selectable: true, defaultSelected: false, sortOrder: 1 },
  { id: "addon-service-50h-shop", name: "50-Hour Service: Pre-Paid In Shop", type: "service", icon: "wrench", shortDescription: "Book your first 50-hour service at the RIPPA Service Centre now and lock in package pricing: oil, filters, inspection and adjustments by our technicians.", compatibleModelIds: "all", selectable: true, defaultSelected: false, sortOrder: 1 },
  { id: "addon-service-50h-kit", name: "50-Hour Service Kit: Ships With Your Machine", type: "service", icon: "wrench", shortDescription: "Genuine oil and filter kit for the first service, packaged with your machine at a savings so you can do it yourself on your schedule.", compatibleModelIds: "all", selectable: true, defaultSelected: false, sortOrder: 2 },
  { id: "addon-delivery", name: "Delivery Package", type: "delivery", icon: "truck", shortDescription: "Convenient delivery to your job site across Ontario.", price: 1250, compatibleModelIds: "all", selectable: true, defaultSelected: false, sortOrder: 4 },
];

export const deliveryOptions: DeliveryOption[] = [
  { id: "del-pickup", name: "Dealer Pickup", regionRule: "any", flatPrice: 0, quoteRequired: false, description: "Pick up at our Thorold location." },
  { id: "del-ontario", name: "Ontario Delivery", regionRule: "ON", quoteRequired: true, description: "Flatbed delivery anywhere in Ontario. Quoted by distance." },
];
