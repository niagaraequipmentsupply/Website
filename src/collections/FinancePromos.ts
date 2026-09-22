import type { CollectionConfig } from "payload";
import { revalidateAfterChange, revalidateAfterDelete } from "./revalidate";

/**
 * Financing promotions (time-boxed, e.g. "0% for 36 months on R15-5") and evergreen programs
 * (seasonal lease, deferred first payment). Both render on /financing; promos also badge eligible models.
 */
export const FinancePromos: CollectionConfig = {
  slug: "finance-promos",
  labels: { singular: "Financing promo / program", plural: "Financing promos & programs" },
  admin: { useAsTitle: "title", group: "Financing", defaultColumns: ["title", "kind", "badge", "active", "startDate", "endDate"] },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: "title", type: "text", required: true, admin: { description: "e.g. 0% financing on R15-5 ECO" } },
    { type: "row", fields: [
      { name: "kind", type: "select", required: true, defaultValue: "promo", options: [{ label: "Limited-time promotion", value: "promo" }, { label: "Ongoing program", value: "program" }], admin: { width: "50%" } },
      { name: "badge", type: "text", admin: { width: "50%", description: "Short label shown on cards and product pages, e.g. '0% APR' or 'No payments 90 days'." } },
    ] },
    { name: "summary", type: "textarea", required: true, admin: { description: "One or two sentences." } },
    { name: "highlights", type: "array", label: "Key points", fields: [{ name: "text", type: "text", required: true }] },
    { name: "terms", type: "textarea", label: "Fine print", admin: { description: "OAC wording, term limits, expiry, exclusions." } },
    { type: "row", fields: [
      { name: "startDate", type: "date", admin: { width: "50%", date: { pickerAppearance: "dayOnly" } } },
      { name: "endDate", type: "date", admin: { width: "50%", date: { pickerAppearance: "dayOnly" }, description: "Promo hides automatically after this date." } },
    ] },
    { name: "allModels", type: "checkbox", defaultValue: false, admin: { description: "Applies to every machine." } },
    { name: "eligibleModels", type: "relationship", relationTo: "machines", hasMany: true, admin: { condition: (data) => !data?.allModels, description: "Models this offer applies to (listed on the promo card)." } },
    { type: "row", fields: [
      { name: "ctaLabel", type: "text", defaultValue: "Get pre-approved", admin: { width: "50%" } },
      { name: "ctaHref", type: "text", defaultValue: "#apply", admin: { width: "50%", description: "#apply scrolls to the form; or paste a LeaseLink application URL." } },
    ] },
    { type: "row", fields: [
      { name: "active", type: "checkbox", defaultValue: true, admin: { width: "33%" } },
      { name: "featured", type: "checkbox", defaultValue: false, admin: { width: "33%", description: "Also show as a strip under the homepage hero." } },
      { name: "sortOrder", type: "number", defaultValue: 100, admin: { width: "33%" } },
    ] },
  ],
};
