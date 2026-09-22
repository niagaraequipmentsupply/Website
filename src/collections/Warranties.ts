import type { CollectionConfig } from "payload";
import { revalidateAfterChange, revalidateAfterDelete } from "./revalidate";

export const Warranties: CollectionConfig = {
  slug: "warranties",
  labels: { singular: "Warranty option", plural: "Warranty options" },
  admin: { useAsTitle: "name", group: "Builder", defaultColumns: ["name", "termMonths", "price"] },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: "name", type: "text", required: true },
    { type: "row", fields: [
      { name: "termMonths", type: "number", required: true, admin: { width: "33%" } },
      { name: "price", type: "number", admin: { width: "33%", description: "CAD" } },
      { name: "financeEligible", type: "checkbox", defaultValue: true, admin: { width: "33%" } },
    ] },
    { name: "coverageSummary", type: "textarea", required: true },
    { name: "allModels", type: "checkbox", defaultValue: true },
    { name: "eligibleModels", type: "relationship", relationTo: "machines", hasMany: true, admin: { condition: (data) => !data?.allModels } },
    { name: "sortOrder", type: "number", defaultValue: 100 },
  ],
};
