# Niagara Equipment Supply — Website

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + Payload CMS 3. Quote-first dealership site for an official RIPPA dealer: category browsing, product/attachment templates, an Excavator Builder, a quote list that sends structured leads, and a Shopify-style product admin at `/admin`. No checkout or payment processing in v1.

```bash
cp .env.example .env.local   # set PAYLOAD_SECRET (any long random string)
npm install
npm run seed                 # base catalogue + attachments into the local SQLite database (once)
npm run seed:lineup          # full RIPPA lineup content from the official spec sheets (photos, specs, features, FAQs)
npm run seed:r32             # extended R32 PRO brochure content
npm run seed:comparison      # buying-guide comparison data + category page copy
npm run seed:r32             # example landing page: R32 PRO photos, brochure, specs, features, FAQs, attachments
npm run dev                  # http://localhost:3000  ·  admin: http://localhost:3000/admin
npm run build && npm start
```

## Product admin (`/admin`)

Payload CMS provides the editor. On first visit it asks you to create the first admin user. Collections:

| Group | Collection | What you manage |
| --- | --- | --- |
| Catalogue | **Machines** | Name, category, description (rich text), photos, grouped spec table with metric + imperial values, engine/cab **configurations with prices**, "Starting from" pricing, builder visibility, featured flag, stock, sort order. **Page content** tab: feature highlights (image + copy), standard equipment, best-fit applications, FAQs, certification badges. Draft / Published. |
| Catalogue | **Attachments** | Type, category (excavator / skid steer / loader), description, photos, **compatibility** (by category or specific models), size variants with prices, downloads. Draft / Published. |
| Catalogue | **Categories** | Names, descriptions and hero images for category pages and the Equipment / Attachments menus. |
| Builder | **Protection & Delivery packages**, **Warranty options** | Add-ons shown in the Excavator Builder with prices and model eligibility. |
| Files | **Media** (images), **Documents** (PDF spec sheets, brochures) | Upload once, attach to any product. Documents appear as download buttons on product pages. |
| Financing | **Financing promos & programs** | Limited-time offers (e.g. 0% on select models, first payment deferred) and evergreen programs (seasonal lease, lease-to-own, loan). Eligible models get a financing badge on cards and product pages; featured promos show in the homepage strip. Start/end dates hide expired offers automatically. |
| Settings | **Site settings**, **Financing** | Phone, email, address, hours, announcement bar, socials, map embed, tax rate; financing assumptions for monthly estimates. |

Every save purges the site cache immediately (`src/collections/revalidate.ts`). The site also revalidates every 5 minutes.

**Product landing pages.** `/inventory/[category]/[slug]` is a landing-page template (RIPPA-style): hero with gallery and key stats, sticky in-page nav, feature highlights, standard equipment, grouped specs with a metric/imperial toggle, configurations & pricing, attachments that fit (grouped by type, add to quote), applications, downloads, FAQ (with FAQ schema) and a quote form. Every section hides when its admin field is empty, so thin models still render cleanly. The R32 PRO is the worked example: `src/data/r32-pro.ts` holds its content and `npm run seed:r32` uploads the brochure photos + PDF and links the attachments. Copy that pattern for other models, or enter content directly in the admin.

**Local data:** SQLite at `./payload.db` (git-ignored) with uploads in `./media` and `./documents`. `npm run seed` only fills empty collections, so it is safe to re-run.

**Production:** switch the adapter in `src/payload.config.ts` to `@payloadcms/db-postgres` (Supabase, Neon, Vercel Postgres) and add a storage plugin for uploads (`@payloadcms/storage-vercel-blob` or `@payloadcms/storage-s3`) — filesystem uploads don't persist on serverless hosts. Set `PAYLOAD_SECRET`, `DATABASE_URI` and `NEXT_PUBLIC_SITE_URL`.

## Where things live

| Path | What |
| --- | --- |
| `src/app/globals.css` | Design tokens (colours, fonts, radii, shadows) as Tailwind v4 `@theme` variables |
| `src/app/layout.tsx` | Fonts (Anton / Raleway via `next/font`), announcement bar, header, footer, LocalBusiness schema |
| `src/payload.config.ts`, `src/collections/*`, `src/globals/*` | Payload CMS admin schema (products, attachments, add-ons, files, settings) |
| `src/lib/catalogue.ts` | Data access: Payload → typed models, seed fallback, nav groups |
| `src/data/*.ts` | Seed data + defaults (`npm run seed`) |
| `src/seed.ts` | Seed script |
| `src/lib/types.ts` | Typed models: Machine, Attachment, AttachmentVariant, Addon, WarrantyOption, DeliveryOption, BuilderConfiguration, QuoteItem, LeadPayload |
| `src/lib/compatibility.ts` | Attachment / variant / add-on eligibility rules |
| `src/lib/pricing.ts` | Line items, subtotal, tax estimate, indicative monthly payment |
| `src/lib/analytics.ts` | Vendor-neutral `track()` (pushes to `window.dataLayer`; register other sinks) |
| `src/store/builder.ts` | Zustand builder state (persisted to localStorage, "Save Build") |
| `src/store/quote.ts` | Zustand quote list (machines, attachments, configured builds) |
| `src/components/ui` | Button, Card, Carousel, Stepper, Toggle, Breadcrumbs, EquipmentImage… |
| `src/components/builder` | ModelSelector, AttachmentSelector, ProtectionOptions, FinancingSelector, BuildSummary, MobileBuildBar, ModelChangeDialog |
| `src/app/api/lead/route.ts` | Lead endpoint: validates and forwards JSON to `LEAD_WEBHOOK_URL` |

Routes: `/`, `/inventory`, `/inventory/[category]`, `/inventory/[category]/[slug]`, `/attachments`, `/attachments/[category]`, `/attachments/[category]/[slug]`, `/builder/excavator`, `/financing`, `/service`, `/about`, `/contact`, `/quote`, plus `sitemap.xml` and `robots.txt`.

## Adding product data

Use the admin. `src/data/*.ts` is only the **seed** (the RIPPA R10–R82 excavator and RS03–RS20 skid steer lineups from the dealer's current listings, plus placeholder attachments and add-ons) and is not read once the database has machines. `src/lib/catalogue.ts` maps CMS documents to the typed models in `src/lib/types.ts`, so components never depend on Payload shapes.

Field notes (same meaning in the admin and the seed files):

1. **Dealer info** — `src/data/site.ts`: phone, email, address, hours, socials, announcement bar copy, tax label/rate for builder estimates.
2. **Machines** — `src/data/machines.ts`. One record per model. Key fields:
   - `category`: `excavators | skid-steers | loaders | track-dumpers | backhoes`
   - `specs[]`: label/value pairs; mark 3–5 with `highlight: true` for cards
   - `basePrice` / `promoPrice` in CAD and `showPrice: true` to publish a price. Leave `showPrice: false` to display "Request pricing".
   - `builderEnabled: true` for excavators that should appear in the builder
   - `images[]`: `{ src: "/images/machines/r15-eco.png", alt: "RIPPA R15 ECO mini excavator" }` — put files under `public/images/…`. Images render with `object-contain` inside a fixed aspect ratio so buckets/attachments are never cropped. Use cut-outs on transparent/white backgrounds.
3. **Attachments** — `src/data/attachments.ts`.
   - `attachmentCategory`: `excavator-attachments | skid-steer-attachments`
   - Compatibility: set `compatibleModelIds` (explicit) **or** leave it empty and use `compatibleCategories` (category-wide). A variant can narrow this further with its own `compatibleModelIds`.
   - Sizes/widths are `variants[]` with their own `price`. No variants → use `basePrice`.
   - `supportsQuantity: true` only where quantity makes sense (teeth, tracks, etc.).
4. **Protection / PDI / delivery add-ons** — `src/data/addons.ts` (`compatibleModelIds: "all"` or a list). `quoteRequired: true` shows "Quote required" instead of a price.
5. **Warranty tiers** — `src/data/warranties.ts` (term, coverage summary, eligibility, price).
6. **Financing** — `src/data/financing.ts`. Monthly estimates are only shown when `showEstimates: true` **and** `annualRate` + `termMonths` are set. Until then the summary shows "Financing available".
7. **Hero / category images** — `src/components/home/HeroVisual.tsx` (`HERO_IMAGE`) and `categories[].image` in `src/data/categories.ts`.
8. **Logo** — `src/components/layout/Logo.tsx` renders a text mark; swap for the official SVG when supplied.

Moving to a CMS/Supabase later: implement fetchers that return the same types and replace the imports in `src/data/index.ts` and the page files. Component APIs stay unchanged.


## Service, parts, lubricants and blog

| Page | What |
| --- | --- |
| `/service` | Service hub: pick a model → its guides, videos, spec sheet, oils, parts and booking links (`?model=<slug>&type=video` deep links). Service booking form (`source: service`). |
| `/service/parts` | Parts request form (`source: parts`), prefilled from `?model=`. |
| `/lubricants` | Catalys / Chevron products (collection **Lubricant products**) with B2B program form (`source: lubricants`). |
| `/blog`, `/blog/[slug]` | **Posts** collection: categories, YouTube embeds, related machines, tags. `?category=` and `?model=` filters. |
| Content requests | "Want to learn how to fix something on your RIPPA?" form on blog/service pages → `source: content-request`. |

Social channels come from Site Settings → Social (URLs + handles). Seed starter content with `npm run seed:content`.

**Attachment plates:** machines and attachments carry a `plateType` (Toro Dingo style, RIPPA proprietary mini plate, universal skid steer, excavator quick coupler). Product pages show a plate-conversion note. Import the manufacturer catalogue with `npm run import:attachments` from `seed-assets/attachments/rippagroup.json` (see the script header for the JSON shape).

## Leads

All forms (quote list, builder "Request This Build", contact, financing) POST a `LeadPayload` to `/api/lead`. Configure `LEAD_WEBHOOK_URL` (and optional `LEAD_WEBHOOK_SECRET`) in `.env.local` to forward to your CRM/Zapier/Make; without it, leads are logged to the server console. Configured builds are included with full line items and totals.

## Analytics

`track()` in `src/lib/analytics.ts` fires: `category_click`, `model_select`, `attachment_add/remove`, `addon_toggle`, `builder_complete`, `quote_add`, `quote_submit`, `phone_click`, `financing_click`. Events are pushed to `window.dataLayer` (GTM-ready); call `registerAnalytics(fn)` to add another vendor.

## Builder behaviour

- Only attachments/variants compatible with the selected model are shown.
- Changing model with incompatible selections opens a dialog: **Remove incompatible items** or **Keep current model**. Nothing is removed silently.
- Sticky "Your Build" panel on desktop; persistent bottom bar + bottom-sheet drawer on mobile.
- Items without a public price are listed as "Quote"/"Request pricing" and excluded from the estimate, with a note in the summary.
- "Save Build" persists to localStorage; "Request This Build" adds the configuration to the quote list and opens `/quote`.

## Deployment (Railway)

Live preview: https://web-production-9fdd9.up.railway.app — project `nes-website`, service `web`, GitHub repo
`niagaraequipmentsupply/Website`. Every push to `main` redeploys.

- Persistent volume mounted at `/data` (500 MB on the trial plan): `payload.db` plus `uploads/media` and `uploads/documents`.
- Variables: `PAYLOAD_SECRET`, `DATABASE_URI=file:/data/payload.db`, `UPLOAD_DIR=/data/uploads`, `NEXT_PUBLIC_SITE_URL`,
  `NIXPACKS_NODE_VERSION=22`. Add `LEAD_WEBHOOK_URL` to forward quote/contact leads.
- Copy local content up: `railway volume files -v web-volume upload --overwrite ./payload.db /payload.db`, then
  `tar czf - media documents | railway ssh -- tar xzf - -C /data/uploads`, then `railway redeploy -y`.
- Custom domain: `railway domain niagaraequipment.ca` and add the CNAME it prints.

## Leads & GoHighLevel CRM

Every form posts to `/api/lead`. The lead is stored in the **Leads** collection (`/admin/collections/leads`) first, then pushed to
GoHighLevel and/or a generic webhook; the status column shows `synced` / `failed` with the error text.

GHL setup (Settings → Private Integrations → new token with contacts, opportunities and locations scopes):

| Variable | Purpose |
|---|---|
| `GHL_API_KEY` | Private integration token |
| `GHL_LOCATION_ID` | Sub-account id |
| `GHL_PIPELINE_ID` / `GHL_STAGE_ID` | Pipeline and default stage for new opportunities |
| `GHL_STAGE_MAP` | Optional JSON, stage id per lead source (`quote`, `builder`, `contact`, `financing`, `service`, `parts`, `lubricants`) |
| `GHL_WEBHOOK_URL` | Alternative: a workflow Inbound Webhook URL (receives the full lead JSON) |

Per lead we upsert the contact (tagged `website` + source), add a note with the message and every requested item or build line,
and open an opportunity named `Name · Quote request · first item`. Content requests are stored and tagged but do not open opportunities.
