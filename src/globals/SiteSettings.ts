import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "@/collections/revalidate";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: { group: "Settings" },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { type: "row", fields: [
      { name: "phone", type: "text", admin: { width: "50%", description: "Display format, e.g. (905) 555-0123" } },
      { name: "email", type: "email", admin: { width: "50%" } },
    ] },
    { type: "row", fields: [
      { name: "street", type: "text", admin: { width: "40%" } },
      { name: "city", type: "text", admin: { width: "30%" } },
      { name: "postal", type: "text", admin: { width: "30%" } },
    ] },
    { name: "serviceArea", type: "text", defaultValue: "Serving all of Ontario" },
    { name: "hours", type: "array", fields: [{ type: "row", fields: [{ name: "day", type: "text", required: true }, { name: "time", type: "text", required: true }] }] },
    { name: "announcementLeft", type: "text", label: "Announcement bar (left)" },
    { name: "announcementRight", type: "text", label: "Announcement bar (right)" },
    { name: "social", type: "group", admin: { description: "Full profile URLs. Handles are shown on the blog and footer." }, fields: [
      { name: "facebook", type: "text" }, { name: "instagram", type: "text" }, { name: "youtube", type: "text" }, { name: "linkedin", type: "text" }, { name: "tiktok", type: "text" },
      { name: "instagramHandle", type: "text", admin: { description: "e.g. @niagaraequipment" } }, { name: "youtubeHandle", type: "text" }, { name: "facebookHandle", type: "text" }, { name: "tiktokHandle", type: "text" },
    ] },
    { name: "mapEmbedUrl", type: "text", admin: { description: "Google Maps embed URL (Share → Embed a map → copy the src)." } },
    { name: "taxRate", type: "number", admin: { description: "Builder estimate tax, e.g. 13 for 13% HST. Leave blank to hide the tax line." } },
  ],
};
