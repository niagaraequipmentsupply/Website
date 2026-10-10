/**
 * Create in GoHighLevel everything the website integration expects, idempotently: the contact custom fields and the tags.
 * Pipelines cannot be created through the public API, so it reports whether the three exist and prints their ids instead.
 *   npm run ghl:provision     (needs GHL_API_KEY and GHL_LOCATION_ID in .env.local; token scopes: custom fields + tags write)
 */
import fs from "fs";
for (const line of fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8").split("\n") : []) { const m = line.match(/^([A-Z_]+)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim(); }
const key = process.env.GHL_API_KEY, loc = process.env.GHL_LOCATION_ID;
if (!key || !loc) { console.error("Set GHL_API_KEY and GHL_LOCATION_ID in .env.local first."); process.exit(1); }
const call = async (method: string, path: string, body?: unknown) => {
  const r = await fetch(`https://services.leadconnectorhq.com${path}`, { method, headers: { Authorization: `Bearer ${key}`, Version: "2021-07-28", Accept: "application/json", ...(body ? { "Content-Type": "application/json" } : {}) }, body: body ? JSON.stringify(body) : undefined });
  const text = await r.text(); let json: unknown = null; try { json = JSON.parse(text); } catch { /* not json */ }
  if (!r.ok) throw new Error(`${method} ${path} → ${r.status} ${text.slice(0, 200)}`);
  return json as never;
};

// ---- Custom fields (names are what GHL turns into the keys the site writes) --------------------------------------
type FieldSpec = { name: string; key: string; dataType: "TEXT" | "LARGE_TEXT" | "DATE" | "SINGLE_OPTIONS"; options?: string[]; placeholder?: string };
const FIELDS: FieldSpec[] = [
  { name: "Lead Source", key: "contact.lead_source", dataType: "TEXT", placeholder: "Website – Quote" },
  { name: "Model of Interest", key: "contact.model_of_interest", dataType: "TEXT", placeholder: "R18 PRO" },
  { name: "Requested Items", key: "contact.requested_items", dataType: "LARGE_TEXT" },
  { name: "First Touchpoint Date", key: "contact.first_touchpoint_date", dataType: "DATE" },
  { name: "First Touchpoint Channel", key: "contact.first_touchpoint_channel", dataType: "TEXT", placeholder: "Website" },
  { name: "Website Page", key: "contact.website_page", dataType: "TEXT", placeholder: "/inventory/excavators/r18-pro" },
  { name: "Financing Interest", key: "contact.financing_interest", dataType: "TEXT", placeholder: "Pay in full / Finance / leasing" },
  { name: "Customer Segment", key: "contact.customer_segment", dataType: "SINGLE_OPTIONS", options: ["Contractor", "Landscaper", "Farm", "Municipality", "Homeowner", "Rental", "Other"] },
  { name: "Machine Owned", key: "contact.machine_owned", dataType: "TEXT", placeholder: "R18 PRO" },
  { name: "Serial Number", key: "contact.serial_number", dataType: "TEXT" },
  { name: "First Touchpoint Campaign", key: "contact.first_touchpoint_campaign", dataType: "TEXT", placeholder: "utm_campaign of the first visit" },
  { name: "Landing Page", key: "contact.landing_page", dataType: "TEXT", placeholder: "/inventory/excavators/r18-pro?utm_source=google" },
  { name: "Last Touchpoint Channel", key: "contact.last_touchpoint_channel", dataType: "TEXT", placeholder: "Google Ads" },
  { name: "Last Touchpoint Campaign", key: "contact.last_touchpoint_campaign", dataType: "TEXT" },
  { name: "Google Click ID", key: "contact.google_click_id", dataType: "TEXT", placeholder: "gclid, for offline conversion uploads" },
  { name: "Marketing Consent Date", key: "contact.marketing_consent_date", dataType: "DATE" },
];
const existing = (await call("GET", `/locations/${loc}/customFields?model=contact`)) as { customFields: { id: string; fieldKey: string; name: string; dataType: string }[] };
console.log("\nCustom fields:");
for (const f of FIELDS) {
  const have = existing.customFields.find((x) => x.fieldKey === f.key);
  if (have) { console.log(`  ✓ ${f.name}  (${have.fieldKey}, ${have.dataType})`); continue; }
  try {
    const created = (await call("POST", `/locations/${loc}/customFields`, { name: f.name, dataType: f.dataType, model: "contact", placeholder: f.placeholder ?? "", position: 0, ...(f.options ? { options: f.options } : {}) })) as { customField: { fieldKey: string; dataType: string } };
    const got = created.customField?.fieldKey;
    console.log(`  ${got === f.key ? "✓" : "⚠"} ${f.name}  created as ${got ?? "?"}${got && got !== f.key ? ` — expected ${f.key}: rename it in GHL so the key matches` : ""}`);
  } catch (err) { console.log(`  ✗ ${f.name}  ${(err as Error).message}`); }
}

// ---- Tags ---------------------------------------------------------------------------------------------------------
const TAGS = ["website", "quote-request", "builder-build", "contact", "financing", "service-centre", "parts-request", "lubricants-b2b", "content-request", "needs-triage", "repeat-enquiry", "casl-express-consent", "casl-no-marketing-consent"];
const tags = (await call("GET", `/locations/${loc}/tags`)) as { tags: { id: string; name: string }[] };
const haveTags = new Set(tags.tags.map((t) => t.name.toLowerCase()));
console.log("\nTags:");
for (const t of TAGS) {
  if (haveTags.has(t)) { console.log(`  ✓ ${t}`); continue; }
  try { await call("POST", `/locations/${loc}/tags`, { name: t }); console.log(`  ✓ ${t}  created`); } catch (err) { console.log(`  ✗ ${t}  ${(err as Error).message}`); }
}

// ---- Pipelines (read-only: create them in Settings → Opportunities & Pipelines) --------------------------------------
const pipes = (await call("GET", `/opportunities/pipelines?locationId=${loc}`)) as { pipelines: { id: string; name: string; stages: { id: string; name: string; position: number }[] }[] };
const first = (p: { stages: { id: string; position: number }[] }) => [...p.stages].sort((a, b) => a.position - b.position)[0]?.id;
const find = (re: RegExp, not?: RegExp) => pipes.pipelines.find((p) => re.test(p.name) && !(not && not.test(p.name)));
const want = [["Equipment Sales", find(/sales|equipment/i), "GHL_SALES"], ["Service & Modifications", find(/service|modif|repair/i, /parts/i), "GHL_SERVICE"], ["Parts & Lubricants", find(/parts|lubric/i), "GHL_PARTS"]] as const;
console.log("\nPipelines:");
for (const [label, p, env] of want) console.log(p ? `  ✓ ${label}: "${p.name}" (${p.stages.length} stages)\n      ${env}_PIPELINE_ID=${p.id}\n      ${env}_STAGE_ID=${first(p)}` : `  ✗ ${label}: not found — create it in GHL (Settings → Opportunities & Pipelines) with the stages from the setup document`);
process.exit(0);
