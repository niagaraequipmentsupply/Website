import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Documents } from "./collections/Documents";
import { Categories } from "./collections/Categories";
import { Machines } from "./collections/Machines";
import { Attachments } from "./collections/Attachments";
import { Addons } from "./collections/Addons";
import { Warranties } from "./collections/Warranties";
import { FinancePromos } from "./collections/FinancePromos";
import { Posts } from "./collections/Posts";
import { Lubricants } from "./collections/Lubricants";
import { Parts } from "./collections/Parts";
import { Leads } from "./collections/Leads";
import { Testimonials } from "./collections/Testimonials";
import { Authors } from "./collections/Authors";
import { resendAdapter } from "@payloadcms/email-resend";
import { SiteSettings } from "./globals/SiteSettings";
import { Financing } from "./globals/Financing";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Payload CMS config — the product admin at /admin.
 * Local dev uses SQLite (DATABASE_URI=file:./payload.db). For production swap the adapter for
 * @payloadcms/db-postgres (Supabase / Neon / Vercel Postgres) and add a storage plugin for uploads.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: " · Niagara Equipment Supply Admin" },
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Machines, Attachments, Lubricants, Parts, Posts, Authors, Testimonials, Addons, Warranties, FinancePromos, Categories, Media, Documents, Leads, Users],
  globals: [SiteSettings, Financing],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "dev-only-secret-change-me",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  // PAYLOAD_PUSH=false skips the dev schema push (scripts against a DB whose schema is managed by hand / already current).
  db: sqliteAdapter({ client: { url: process.env.DATABASE_URI || "file:./payload.db" }, push: process.env.PAYLOAD_PUSH !== "false" }),
  sharp,
  upload: { limits: { fileSize: 25 * 1024 * 1024 } },
  // Outbound email (lead alerts, customer confirmations, admin password resets). Set RESEND_API_KEY + EMAIL_FROM on a verified domain.
  email: process.env.RESEND_API_KEY
    ? resendAdapter({ apiKey: process.env.RESEND_API_KEY, defaultFromAddress: process.env.EMAIL_FROM || "quotes@niagaraequipment.com", defaultFromName: process.env.EMAIL_FROM_NAME || "Niagara Equipment Supply" })
    : undefined,
});
