import type { CollectionConfig } from "payload";
import { revalidateAfterChange, revalidateAfterDelete } from "./revalidate";

export const Addons: CollectionConfig = {
  slug: "addons",
  labels: { singular: "Protection / Delivery package", plural: "Protection & Delivery packages" },
  admin: { useAsTitle: "name", group: "Builder", defaultColumns: ["name", "type", "price", "selectable"] },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: "name", type: "text", required: true },
    { type: "row", fields: [
      { name: "type", type: "select", required: true, defaultValue: "protection", options: [
        { label: "Protection", value: "protection" }, { label: "Dealer PDI / Setup", value: "pdi" }, { label: "Delivery", value: "delivery" }, { label: "Service bundle", value: "service" },
      ], admin: { width: "50%" } },
      { name: "icon", type: "select", defaultValue: "shield", options: ["shield", "wrench", "truck", "file"].map((v) => ({ label: v, value: v })), admin: { width: "50%" } },
    ] },
    { name: "shortDescription", type: "textarea", required: true },
    { name: "fullDescription", type: "textarea" },
    { type: "row", fields: [
      { name: "price", type: "number", admin: { width: "50%", description: "CAD. Leave blank if quoted." } },
      { name: "quoteRequired", type: "checkbox", admin: { width: "50%" } },
    ] },
    { name: "allModels", type: "checkbox", defaultValue: true, admin: { description: "Eligible for every builder model." } },
    { name: "compatibleModels", type: "relationship", relationTo: "machines", hasMany: true, admin: { condition: (data) => !data?.allModels } },
    { type: "row", fields: [
      { name: "selectable", type: "checkbox", defaultValue: true, admin: { width: "33%" } },
      { name: "defaultSelected", type: "checkbox", defaultValue: false, admin: { width: "33%" } },
      { name: "sortOrder", type: "number", defaultValue: 100, admin: { width: "33%" } },
    ] },
  ],
};
