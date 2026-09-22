import type { CollectionConfig } from "payload";
import { documentsField, imagesField, machineCategoryOptions, merchandisingFields, slugField, specGroupOptions, specIconOptions } from "./shared";
import { revalidateAfterChange, revalidateAfterDelete } from "./revalidate";
import { plateOptions } from "@/lib/plates";

export const Machines: CollectionConfig = {
  slug: "machines",
  admin: { useAsTitle: "modelName", defaultColumns: ["modelName", "category", "featured", "sortOrder", "_status"], group: "Catalogue", listSearchableFields: ["modelName", "slug", "series"] },
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
              { name: "modelName", type: "text", required: true, admin: { width: "50%" } },
              { name: "brand", type: "text", defaultValue: "RIPPA", required: true, admin: { width: "25%" } },
              { name: "series", type: "text", admin: { width: "25%", description: "e.g. PRO Series" } },
            ] },
            { name: "category", type: "select", required: true, options: machineCategoryOptions },
            { name: "badge", type: "text", admin: { description: "Short label like 'Most Popular' or 'New'." } },
            { name: "shortDescription", type: "textarea", required: true, admin: { description: "1–2 sentences for cards." } },
            { name: "longDescription", type: "richText" },
            { name: "warranty", type: "text", admin: { description: "e.g. 2 year warranty" } },
            { name: "certifications", type: "array", admin: { description: "Badges shown in the hero, e.g. EPA Tier 4 Final, CE." }, fields: [{ name: "text", type: "text", required: true }] },
            imagesField,
            documentsField,
          ],
        },
        {
          label: "Page content",
          description: "Landing-page sections. Empty sections are hidden on the site.",
          fields: [
            { name: "features", type: "array", label: "Feature highlights", admin: { description: "Big image + headline blocks, e.g. 'Powerful Performance' / 'Explosion-proof valve'." }, fields: [
              { type: "row", fields: [
                { name: "eyebrow", type: "text", admin: { width: "30%", description: "Small label, e.g. 'Engineered performance'" } },
                { name: "title", type: "text", required: true, admin: { width: "70%" } },
              ] },
              { name: "text", type: "textarea", required: true },
              { name: "image", type: "upload", relationTo: "media" },
            ] },
            { name: "standardEquipment", type: "array", label: "Standard equipment (included)", fields: [{ name: "text", type: "text", required: true }] },
            { name: "applications", type: "array", label: "Best-fit applications", fields: [{ name: "text", type: "text", required: true }] },
            { name: "faqs", type: "array", label: "FAQs", fields: [
              { name: "question", type: "text", required: true },
              { name: "answer", type: "textarea", required: true },
            ] },
          ],
        },
        {
          label: "Comparison chart",
          description: "Feeds the comparison chart on the category page (like the RIPPA buying guides).",
          fields: [
            { type: "row", fields: [
              { name: "targetUsers", type: "text", admin: { width: "60%", description: "e.g. Homeowners and small farm owners" } },
              { name: "noiseLevel", type: "text", admin: { width: "40%", description: "e.g. Ultra-quiet" } },
            ] },
            { name: "indoorUse", type: "checkbox", defaultValue: false, admin: { description: "Suitable for indoor use." } },
            { name: "plateType", type: "select", options: plateOptions, admin: { description: "Attachment mounting standard (skid steers / loaders)." } },
            { name: "plateNote", type: "textarea", admin: { description: "Shown under the attachments list, e.g. plate conversion offer. Leave blank for the default wording." } },
            { name: "applicationFit", type: "array", label: "Application fit", admin: { description: "Rate how well this model handles each job and which attachments it needs." }, fields: [
              { type: "row", fields: [
                { name: "application", type: "text", required: true, admin: { width: "35%" } },
                { name: "rating", type: "select", required: true, defaultValue: "2", admin: { width: "25%" }, options: [
                  { label: "Highly suited (★★★)", value: "4" }, { label: "Well suited (★★)", value: "3" }, { label: "Compatible (★)", value: "2" }, { label: "Usable, not optimal (☆)", value: "1" }, { label: "Not compatible (✕)", value: "0" },
                ] },
                { name: "attachments", type: "text", admin: { width: "40%", description: "Required attachments" } },
              ] },
            ] },
            { name: "checklist", type: "array", label: "Safety & comfort checklist", fields: [
              { type: "row", fields: [
                { name: "group", type: "select", required: true, defaultValue: "safety", options: [{ label: "Safety", value: "safety" }, { label: "Comfort", value: "comfort" }, { label: "Other", value: "other" }], admin: { width: "20%" } },
                { name: "feature", type: "text", required: true, admin: { width: "35%" } },
                { name: "status", type: "select", required: true, defaultValue: "standard", options: [{ label: "Standard", value: "standard" }, { label: "Optional", value: "optional" }, { label: "Not available", value: "na" }], admin: { width: "20%" } },
                { name: "note", type: "text", admin: { width: "25%", description: "e.g. Heating & cooling" } },
              ] },
            ] },
          ],
        },
        {
          label: "Specs",
          fields: [
            { name: "specs", type: "array", admin: { description: "Full spec table. Mark 3–5 as highlights to show on cards and in the hero stats. Add an imperial value to enable the metric / imperial toggle." }, fields: [
              { type: "row", fields: [
                { name: "label", type: "text", required: true, admin: { width: "30%" } },
                { name: "value", type: "text", required: true, admin: { width: "25%", description: "Metric" } },
                { name: "imperial", type: "text", admin: { width: "20%" } },
                { name: "group", type: "select", options: specGroupOptions, defaultValue: "general", admin: { width: "25%" } },
              ] },
              { type: "row", fields: [
                { name: "icon", type: "select", options: specIconOptions, defaultValue: "generic", admin: { width: "50%" } },
                { name: "highlight", type: "checkbox", admin: { width: "50%" } },
              ] },
            ] },
          ],
        },
        {
          label: "Pricing & configurations",
          fields: [
            { name: "showPrice", type: "checkbox", defaultValue: true, admin: { description: "Untick to show 'Request pricing' everywhere." } },
            { name: "configurations", type: "array", admin: { description: "Engine / cab / undercarriage options. The lowest price becomes the 'Starting from' price." }, fields: [
              { name: "label", type: "text", required: true },
              { type: "row", fields: [
                { name: "engine", type: "text", admin: { width: "40%" } },
                { name: "horsepower", type: "text", admin: { width: "20%" } },
                { name: "operatingWeight", type: "text", admin: { width: "20%" } },
                { name: "price", type: "number", admin: { width: "20%", description: "CAD" } },
              ] },
              { type: "row", fields: [
                { name: "sku", type: "text", admin: { width: "50%" } },
                { name: "inStock", type: "checkbox", admin: { width: "50%" } },
              ] },
            ] },
            { type: "row", fields: [
              { name: "basePrice", type: "number", admin: { width: "50%", description: "CAD. Used only when there are no configurations." } },
              { name: "promoPrice", type: "number", admin: { width: "50%", description: "CAD. Overrides base price when set." } },
            ] },
            { name: "builderEnabled", type: "checkbox", defaultValue: false, admin: { description: "Show in the Excavator Builder (excavators only)." } },
          ],
        },
      ],
    },
    slugField("modelName"),
    ...merchandisingFields,
  ],
};
