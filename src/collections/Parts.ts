import type { CollectionConfig } from "payload";
import { slugField } from "./shared";
import { revalidateAfterChange, revalidateAfterDelete } from "./revalidate";
import { partSystems } from "@/lib/parts";


/** Genuine RIPPA parts catalogue (imported from rippagroup.ca). Quote-only; parts are assigned to the machines they fit. */
export const Parts: CollectionConfig = {
  slug: "parts",
  labels: { singular: "Part", plural: "Parts" },
  admin: { useAsTitle: "name", group: "Catalogue", defaultColumns: ["name", "sku", "system", "compatibleModels", "_status"], listSearchableFields: ["name", "sku", "slug"], pagination: { defaultLimit: 50 } },
  versions: { drafts: false },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { type: "row", fields: [
      { name: "name", type: "text", required: true, admin: { width: "60%" } },
      { name: "sku", type: "text", required: true, index: true, admin: { width: "40%", description: "RIPPA part number, e.g. LP0101010001" } },
    ] },
    { name: "system", type: "select", required: true, options: partSystems, defaultValue: "other" },
    { name: "engineBrand", type: "select", options: [{ label: "Kubota", value: "kubota" }, { label: "Briggs & Stratton", value: "briggs-stratton" }], admin: { description: "For engine parts only." } },
    { name: "compatibleModels", type: "relationship", relationTo: "machines", hasMany: true, admin: { description: "Machines this part is listed for." } },
    { name: "description", type: "textarea" },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "sourceUrl", type: "text", admin: { description: "rippagroup.ca product page" } },
    { type: "row", fields: [
      { name: "featured", type: "checkbox", defaultValue: false, admin: { width: "50%" } },
      { name: "sortOrder", type: "number", defaultValue: 100, admin: { width: "50%" } },
    ] },
    slugField("name"),
  ],
};
