import type { Field } from "payload";

export const machineCategoryOptions = [
  { label: "Mini Excavators", value: "excavators" },
  { label: "Skid Steers", value: "skid-steers" },
  { label: "Loaders", value: "loaders" },
  { label: "Track Dumpers", value: "track-dumpers" },
];

export const attachmentCategoryOptions = [
  { label: "Excavator Attachments", value: "excavator-attachments" },
  { label: "Skid Steer Attachments", value: "skid-steer-attachments" },
  { label: "Loader Attachments", value: "loader-attachments" },
];

export const specGroupOptions = [
  { label: "General", value: "general" }, { label: "Performance", value: "performance" }, { label: "Engine", value: "engine" }, { label: "Dimensions & transport", value: "dimensions" },
];

export const specIconOptions = ["weight", "engine", "depth", "warranty", "power", "capacity", "width", "reach", "generic"].map((v) => ({ label: v, value: v }));

export const slugField = (from: string): Field => ({
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  admin: { position: "sidebar", description: "URL path segment, e.g. r15-5-eco. Auto-filled from the name when empty." },
  hooks: {
    beforeValidate: [({ value, data }) => {
      const src = (value as string) || (data?.[from] as string) || "";
      return src.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }],
  },
});

export const imagesField: Field = {
  name: "images",
  type: "array",
  admin: { description: "First image is the main photo." },
  fields: [{ name: "image", type: "upload", relationTo: "media", required: true }],
};

export const documentsField: Field = {
  name: "documents",
  type: "array",
  label: "Downloads (spec sheets, brochures)",
  fields: [
    { name: "label", type: "text", required: true },
    { name: "file", type: "upload", relationTo: "documents", required: true },
  ],
};

export const merchandisingFields: Field[] = [
  { name: "featured", type: "checkbox", defaultValue: false, admin: { position: "sidebar", description: "Show on homepage / featured rows." } },
  { name: "inStock", type: "select", admin: { position: "sidebar" }, options: [
    { label: "Unknown / not shown", value: "unknown" }, { label: "In stock", value: "in-stock" }, { label: "Order", value: "order" },
  ], defaultValue: "unknown" },
  { name: "sortOrder", type: "number", defaultValue: 100, admin: { position: "sidebar", description: "Lower numbers show first." } },
];
