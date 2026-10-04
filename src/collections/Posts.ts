import type { CollectionConfig } from "payload";
import { slugField } from "./shared";
import { revalidateAfterChange, revalidateAfterDelete } from "./revalidate";

export const postCategories = [
  { label: "How-to guide", value: "guide" }, { label: "Field call", value: "field-call" }, { label: "Maintenance", value: "maintenance" },
  { label: "Buying advice", value: "buying" }, { label: "Attachments", value: "attachments" }, { label: "Parts", value: "parts" }, { label: "Lubricants", value: "lubricants" }, { label: "News", value: "news" },
];

/** Blog: guides, field-call write-ups, maintenance how-tos, news. Video-first posts can carry a YouTube URL. */
export const Posts: CollectionConfig = {
  slug: "posts",
  admin: { useAsTitle: "title", group: "Content", defaultColumns: ["title", "category", "publishedAt", "_status"], listSearchableFields: ["title", "excerpt"] },
  versions: { drafts: true },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: "title", type: "text", required: true },
    { type: "row", fields: [
      { name: "category", type: "select", required: true, defaultValue: "guide", options: postCategories, admin: { width: "50%" } },
      { name: "publishedAt", type: "date", required: true, defaultValue: () => new Date().toISOString(), admin: { width: "50%", date: { pickerAppearance: "dayOnly" } } },
    ] },
    { name: "excerpt", type: "textarea", required: true, admin: { description: "1–2 sentences shown on cards and in search results." } },
    { name: "cover", type: "upload", relationTo: "media" },
    { name: "videoUrl", type: "text", admin: { description: "YouTube watch/short URL. Embedded at the top of the post." } },
    { name: "content", type: "richText", required: true },
    { name: "relatedMachines", type: "relationship", relationTo: "machines", hasMany: true, admin: { description: "Shown as 'Applies to' chips and links the post from those product pages." } },
    { name: "relatedAttachments", type: "relationship", relationTo: "attachments", hasMany: true },
    { name: "tags", type: "array", fields: [{ name: "tag", type: "text", required: true }] },
    { name: "readMinutes", type: "number", admin: { position: "sidebar", description: "Estimated reading time." } },
    { name: "featured", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    { name: "writer", type: "relationship", relationTo: "authors", admin: { position: "sidebar", description: "Who wrote this. Their bio appears under the post and in the structured data." } },
    { name: "author", type: "text", defaultValue: "Niagara Equipment Supply service team", admin: { position: "sidebar", hidden: true, description: "Legacy free-text byline; shown only when no writer is linked." } },
    slugField("title"),
  ],
};
