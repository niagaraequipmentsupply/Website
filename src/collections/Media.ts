import type { CollectionConfig } from "payload";
import { uploadDir } from "@/lib/upload-dir";

export const Media: CollectionConfig = {
  slug: "media",
  admin: { group: "Files", description: "Product photos and site images. Use cut-outs on white/transparent backgrounds so buckets and attachments are never cropped." },
  access: { read: () => true },
  upload: {
    staticDir: uploadDir("media"),
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, fit: "inside", withoutEnlargement: true },
      { name: "card", width: 800, height: 600, fit: "inside", withoutEnlargement: true },
      { name: "large", width: 1600, height: 1200, fit: "inside", withoutEnlargement: true },
    ],
    adminThumbnail: "thumbnail",
  },
  fields: [{ name: "alt", type: "text", required: true, admin: { description: "Alt text = what is in the photo, in buyers' words: brand, model, machine type and what the shot shows, e.g. 'RIPPA R15 ECO 1.5-ton mini excavator with enclosed cab, front right view'. It is also shown as the photo caption. Name files descriptively before uploading (rippa-r15-eco-mini-excavator-cab-front.jpg), never IMG_1234.jpg." } }],
};
