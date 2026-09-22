import type { CollectionConfig } from "payload";
import { uploadDir } from "@/lib/upload-dir";

export const Documents: CollectionConfig = {
  slug: "documents",
  admin: { group: "Files", description: "Downloadable spec sheets, brochures and manuals (PDF)." },
  access: { read: () => true },
  upload: { staticDir: uploadDir("documents"), mimeTypes: ["application/pdf"] },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "kind", type: "select", defaultValue: "spec-sheet", options: [
      { label: "Spec sheet", value: "spec-sheet" }, { label: "Brochure", value: "brochure" }, { label: "Manual", value: "manual" }, { label: "Other", value: "other" },
    ] },
  ],
};
