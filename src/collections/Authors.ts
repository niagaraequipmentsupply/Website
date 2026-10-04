import type { CollectionConfig } from "payload";
import { slugField } from "./shared";
import { revalidateAfterChange, revalidateAfterDelete } from "./revalidate";

/**
 * Real people who write for the site. Each blog post links to one author; the bio and photo render under the post
 * (with Person structured data) and in the team section of the About page. Nothing renders until an author exists.
 */
export const Authors: CollectionConfig = {
  slug: "authors",
  labels: { singular: "Author", plural: "Authors" },
  admin: {
    useAsTitle: "name", group: "Content", defaultColumns: ["name", "role", "updatedAt"],
    description: "Real team members only. Each blog post links to one author; the bio and photo appear under the post and on the About page.",
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { type: "row", fields: [
      { name: "name", type: "text", required: true, admin: { width: "50%" } },
      { name: "role", type: "text", admin: { width: "50%", description: "e.g. Owner, Service Manager, Lead Technician" } },
    ] },
    { name: "bio", type: "textarea", required: true, admin: { description: "Two to four sentences in the third person: background, years with the equipment, what they do at the dealership." } },
    { name: "photo", type: "upload", relationTo: "media", admin: { description: "Square headshot or a photo at work. Optional but recommended; search engines and readers trust a face." } },
    { name: "credentials", type: "array", fields: [{ name: "text", type: "text", required: true }], admin: { description: "Certifications or training, e.g. 'RIPPA factory service training'. Only list what is real." } },
    { type: "row", fields: [
      { name: "email", type: "email", admin: { width: "34%" } },
      { name: "linkedin", type: "text", admin: { width: "33%", description: "Profile URL" } },
      { name: "website", type: "text", admin: { width: "33%", description: "e.g. https://gjequip.ca" } },
    ] },
    { name: "sortOrder", type: "number", defaultValue: 100, admin: { position: "sidebar" } },
    slugField("name"),
  ],
};
