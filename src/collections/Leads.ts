import type { CollectionConfig } from "payload";

/** Every website submission, stored before it is forwarded to GoHighLevel / webhooks. Read-only in practice. */
export const Leads: CollectionConfig = {
  slug: "leads",
  labels: { singular: "Lead", plural: "Leads" },
  admin: { useAsTitle: "title", group: "Sales", defaultColumns: ["title", "source", "status", "createdAt"], listSearchableFields: ["title", "email", "phone", "company"], pagination: { defaultLimit: 50 } },
  access: { read: ({ req }) => !!req.user, create: () => false, update: ({ req }) => !!req.user, delete: ({ req }) => !!req.user },
  fields: [
    { name: "title", type: "text", required: true },
    { type: "row", fields: [
      { name: "source", type: "select", required: true, options: ["quote", "builder", "contact", "financing", "service", "parts", "lubricants", "content-request"].map((v) => ({ label: v, value: v })), admin: { width: "50%" } },
      { name: "status", type: "select", defaultValue: "new", options: [{ label: "New", value: "new" }, { label: "Synced to CRM", value: "synced" }, { label: "CRM sync failed", value: "failed" }, { label: "Handled", value: "handled" }], admin: { width: "50%" } },
    ] },
    { type: "row", fields: [
      { name: "name", type: "text", required: true, admin: { width: "34%" } }, { name: "email", type: "email", required: true, admin: { width: "33%" } }, { name: "phone", type: "text", required: true, admin: { width: "33%" } },
    ] },
    { type: "row", fields: [{ name: "company", type: "text", admin: { width: "50%" } }, { name: "location", type: "text", admin: { width: "50%" } }] },
    { name: "message", type: "textarea" },
    { name: "lines", type: "array", label: "Requested items", fields: [{ name: "text", type: "text", required: true }] },
    { name: "page", type: "text", admin: { description: "Page the form was sent from." } },
    { type: "row", fields: [
      { name: "marketingConsent", type: "checkbox", defaultValue: false, admin: { width: "50%", description: "CASL express consent to marketing email, as ticked on the form." } },
      { name: "consentAt", type: "date", admin: { width: "50%", readOnly: true } },
    ] },
    { type: "row", fields: [{ name: "ghlContactId", type: "text", admin: { width: "50%", readOnly: true } }, { name: "ghlOpportunityId", type: "text", admin: { width: "50%", readOnly: true } }] },
    { name: "error", type: "textarea", admin: { readOnly: true } },
    { name: "payload", type: "json", admin: { readOnly: true, description: "Raw submission." } },
  ],
};
