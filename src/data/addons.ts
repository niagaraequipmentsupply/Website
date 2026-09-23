import type { Addon, DeliveryOption } from "@/lib/types";

/** PLACEHOLDER — prices mirror the mockups. Confirm scope + pricing with the dealer. */
export const addons: Addon[] = [
  { id: "addon-rustproof", name: "Rustproof Package", type: "protection", icon: "shield", shortDescription: "Protect your investment with advanced rust inhibitor treatment.", price: 695, compatibleModelIds: "all", selectable: true, defaultSelected: false, sortOrder: 1 },
  { id: "addon-pdi", name: "Dealer PDI / Setup", type: "pdi", icon: "wrench", shortDescription: "Complete inspection, fluid fill, and setup by certified technicians.", price: 395, compatibleModelIds: "all", selectable: true, defaultSelected: false, sortOrder: 3 },
  { id: "addon-delivery", name: "Delivery Package", type: "delivery", icon: "truck", shortDescription: "Convenient delivery to your job site across Ontario.", price: 1250, compatibleModelIds: "all", selectable: true, defaultSelected: false, sortOrder: 4 },
];

export const deliveryOptions: DeliveryOption[] = [
  { id: "del-pickup", name: "Dealer Pickup", regionRule: "any", flatPrice: 0, quoteRequired: false, description: "Pick up at our Thorold location." },
  { id: "del-ontario", name: "Ontario Delivery", regionRule: "ON", quoteRequired: true, description: "Flatbed delivery anywhere in Ontario. Quoted by distance." },
];
