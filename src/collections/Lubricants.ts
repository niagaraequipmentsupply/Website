import type { CollectionConfig } from "payload";
import { slugField, imagesField, documentsField } from "./shared";
import { revalidateAfterChange, revalidateAfterDelete } from "./revalidate";

export const lubricantCategories = [
  { label: "Engine oil", value: "engine-oil" }, { label: "Hydraulic fluid", value: "hydraulic" }, { label: "Gear & axle oil", value: "gear" }, { label: "Transmission fluid", value: "transmission" },
  { label: "Grease", value: "grease" }, { label: "Coolant / antifreeze", value: "coolant" }, { label: "Diesel exhaust fluid (DEF)", value: "def" }, { label: "Food-grade", value: "food-grade" }, { label: "Other", value: "other" },
];

/** Oil & lubricant products (Catalys / Petro-Canada Lubricants range). Over-the-counter and B2B. */
export const Lubricants: CollectionConfig = {
  slug: "lubricants",
  labels: { singular: "Lubricant product", plural: "Lubricant products" },
  admin: { useAsTitle: "name", group: "Catalogue", defaultColumns: ["name", "brand", "category", "featured", "_status"], listSearchableFields: ["name", "brand", "grades"] },
  versions: { drafts: true },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { type: "row", fields: [
      { name: "name", type: "text", required: true, admin: { width: "50%", description: "e.g. DURON UHP" } },
      { name: "brand", type: "text", defaultValue: "Petro-Canada Lubricants", admin: { width: "50%" } },
    ] },
    { name: "category", type: "select", required: true, options: lubricantCategories },
    { name: "tagline", type: "text", admin: { description: "One line, e.g. 'Heavy-duty diesel engine oil for extended drains'." } },
    { name: "description", type: "textarea", required: true },
    { name: "grades", type: "text", admin: { description: "Viscosity grades / variants, e.g. 5W-40, 10W-30, 15W-40" } },
    { name: "applications", type: "array", label: "Best for", fields: [{ name: "text", type: "text", required: true }] },
    { name: "packaging", type: "select", hasMany: true, options: [{ label: "1 L", value: "1l" }, { label: "4 L jug", value: "4l" }, { label: "20 L pail", value: "20l" }, { label: "205 L drum", value: "drum" }, { label: "1,000 L tote", value: "tote" }, { label: "Bulk delivery", value: "bulk" }, { label: "Cartridge / tube", value: "cartridge" }] },
    { name: "approvals", type: "text", admin: { description: "OEM / API approvals to list, e.g. API CK-4, Kubota approved" } },
    { name: "rippaUse", type: "text", admin: { description: "Where it's used on RIPPA machines, e.g. 'Engine oil for Kubota D722 / D902 / V1505'." } },
    imagesField, documentsField,
    { type: "row", fields: [
      { name: "featured", type: "checkbox", defaultValue: false, admin: { width: "50%" } },
      { name: "sortOrder", type: "number", defaultValue: 100, admin: { width: "50%" } },
    ] },
    slugField("name"),
  ],
};
