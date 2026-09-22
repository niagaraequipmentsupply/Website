import type { CollectionConfig } from "payload";
import { attachmentCategoryOptions, machineCategoryOptions } from "./shared";
import { revalidateAfterChange, revalidateAfterDelete } from "./revalidate";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: { useAsTitle: "name", group: "Catalogue", defaultColumns: ["name", "kind", "slug", "sortOrder"], description: "Names, descriptions and images for the category pages and menus." },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: "kind", type: "select", required: true, defaultValue: "machine", options: [{ label: "Equipment", value: "machine" }, { label: "Attachments", value: "attachment" }] },
    { name: "slug", type: "select", required: true, unique: true, options: [...machineCategoryOptions, ...attachmentCategoryOptions] },
    { type: "row", fields: [
      { name: "name", type: "text", required: true, admin: { width: "60%" } },
      { name: "shortName", type: "text", admin: { width: "40%", description: "Used on tiles and menus." } },
    ] },
    { name: "description", type: "textarea", required: true },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "sortOrder", type: "number", defaultValue: 100 },
    {
      type: "collapsible", label: "Category page content", admin: { initCollapsed: true },
      fields: [
        { name: "intro", type: "textarea", admin: { description: "Longer introduction shown under the model grid." } },
        { name: "buyingGuide", type: "array", label: "Which model is right for you", fields: [
          { name: "title", type: "text", required: true, admin: { description: "e.g. Homeowners & backyard projects" } },
          { name: "text", type: "textarea", required: true },
          { name: "models", type: "relationship", relationTo: "machines", hasMany: true },
        ] },
        { name: "highlights", type: "array", label: "Why RIPPA (category highlights)", fields: [
          { name: "title", type: "text", required: true },
          { name: "text", type: "textarea", required: true },
        ] },
        { name: "faqs", type: "array", label: "FAQs", fields: [
          { name: "question", type: "text", required: true },
          { name: "answer", type: "textarea", required: true },
        ] },
      ],
    },
  ],
};
