import type { CollectionConfig } from "payload";
import { attachmentCategoryOptions, documentsField, imagesField, machineCategoryOptions, merchandisingFields, slugField } from "./shared";
import { revalidateAfterChange, revalidateAfterDelete } from "./revalidate";
import { plateOptions } from "@/lib/plates";

export const Attachments: CollectionConfig = {
  slug: "attachments",
  admin: { useAsTitle: "name", defaultColumns: ["name", "attachmentCategory", "attachmentType", "featured", "_status"], group: "Catalogue", listSearchableFields: ["name", "slug", "attachmentType"] },
  versions: { drafts: true },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Details",
          fields: [
            { type: "row", fields: [
              { name: "name", type: "text", required: true, admin: { width: "50%" } },
              { name: "attachmentType", type: "text", required: true, admin: { width: "50%", description: "Grouping label: Bucket, Thumb, Auger, Forks…" } },
            ] },
            { name: "attachmentCategory", type: "select", required: true, options: attachmentCategoryOptions },
            { name: "description", type: "text", required: true, admin: { description: "Short line for cards, e.g. '12\" – 24\" options'." } },
            { name: "longDescription", type: "richText" },
            imagesField,
            documentsField,
          ],
        },
        {
          label: "Compatibility",
          fields: [
            { name: "compatibleCategories", type: "select", hasMany: true, options: machineCategoryOptions, admin: { description: "Fits every machine in these categories (used when no specific models are listed)." } },
            { name: "compatibleModels", type: "relationship", relationTo: "machines", hasMany: true, admin: { description: "Fits only these models. Leave empty to use categories." } },
            { name: "plateType", type: "select", options: plateOptions, admin: { description: "Mounting standard this attachment ships with. -1 mini loader attachments = Toro Dingo style; -2 / -3 = RIPPA proprietary plate." } },
            { name: "sourceUrl", type: "text", admin: { description: "Manufacturer catalogue page." } },
          ],
        },
        {
          label: "Pricing & variants",
          fields: [
            { name: "showPrice", type: "checkbox", defaultValue: true },
            { name: "basePrice", type: "number", admin: { description: "CAD. Used when there are no variants." } },
            { name: "supportsQuantity", type: "checkbox", defaultValue: false, admin: { description: "Allow quantity > 1 (teeth, tracks, etc.)." } },
            { name: "variants", type: "array", admin: { description: "Sizes / widths with their own price. Optionally restrict a variant to specific models." }, fields: [
              { type: "row", fields: [
                { name: "label", type: "text", required: true, admin: { width: "40%" } },
                { name: "widthOrSize", type: "text", admin: { width: "20%" } },
                { name: "sku", type: "text", admin: { width: "20%" } },
                { name: "price", type: "number", admin: { width: "20%" } },
              ] },
              { name: "compatibleModels", type: "relationship", relationTo: "machines", hasMany: true },
            ] },
          ],
        },
      ],
    },
    slugField("name"),
    ...merchandisingFields,
  ],
};
