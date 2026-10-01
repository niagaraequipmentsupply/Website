import type { CollectionConfig } from "payload";
import { revalidateAfterChange, revalidateAfterDelete } from "./revalidate";

/**
 * Customer testimonials. Nothing renders until at least one is published, so only real, permission-given quotes go here.
 * Shown on the home page (featured first) and on the matching machine page.
 */
export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: { singular: "Testimonial", plural: "Testimonials" },
  admin: { useAsTitle: "name", group: "Marketing", defaultColumns: ["name", "location", "rating", "machine", "featured", "_status"], description: "Real customer quotes only, with their permission. Published entries appear on the home page and the related machine page." },
  versions: { drafts: true },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: "quote", type: "textarea", required: true, admin: { description: "In the customer's words. Two to four sentences reads best." } },
    { type: "row", fields: [
      { name: "name", type: "text", required: true, admin: { width: "34%", description: "First name and last initial is fine, e.g. Mike D." } },
      { name: "location", type: "text", admin: { width: "33%", description: "Town, e.g. Welland, ON" } },
      { name: "company", type: "text", admin: { width: "33%" } },
    ] },
    { type: "row", fields: [
      { name: "machine", type: "relationship", relationTo: "machines", admin: { width: "50%", description: "Optional: shows the quote on that model's page." } },
      { name: "rating", type: "number", min: 1, max: 5, defaultValue: 5, admin: { width: "25%", description: "1 to 5 stars" } },
      { name: "source", type: "select", defaultValue: "in-person", options: [{ label: "In person / phone", value: "in-person" }, { label: "Email", value: "email" }, { label: "Google review", value: "google" }, { label: "Facebook", value: "facebook" }], admin: { width: "25%" } },
    ] },
    { type: "row", fields: [
      { name: "date", type: "date", admin: { width: "34%", date: { pickerAppearance: "dayOnly" } } },
      { name: "featured", type: "checkbox", defaultValue: false, admin: { width: "33%", description: "Show on the home page." } },
      { name: "sortOrder", type: "number", defaultValue: 100, admin: { width: "33%" } },
    ] },
  ],
};
