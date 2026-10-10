/**
 * Print GoHighLevel pipeline + stage ids and check the contact custom fields the site writes to.
 *   npm run ghl:setup     (needs GHL_API_KEY and GHL_LOCATION_ID in .env.local)
 */
import fs from "fs";
for (const line of fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8").split("\n") : []) { const m = line.match(/^([A-Z_]+)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim(); }
const key = process.env.GHL_API_KEY, loc = process.env.GHL_LOCATION_ID;
if (!key || !loc) { console.error("Set GHL_API_KEY and GHL_LOCATION_ID in .env.local first."); process.exit(1); }
const get = async (path: string) => { const r = await fetch(`https://services.leadconnectorhq.com${path}`, { headers: { Authorization: `Bearer ${key}`, Version: "2021-07-28", Accept: "application/json" } }); if (!r.ok) throw new Error(`${path} → ${r.status} ${(await r.text()).slice(0, 200)}`); return r.json(); };
const pipes = (await get(`/opportunities/pipelines?locationId=${loc}`)) as { pipelines: { id: string; name: string; stages: { id: string; name: string; position: number }[] }[] };
console.log("\nPipelines:");
for (const p of pipes.pipelines) { console.log(`  ${p.name}  id=${p.id}`); for (const s of [...p.stages].sort((a, b) => a.position - b.position)) console.log(`     ${s.position + 1}. ${s.name}  stage=${s.id}`); }
const first = (p: { stages: { id: string; position: number }[] }) => [...p.stages].sort((a, b) => a.position - b.position)[0]?.id;
const sales = pipes.pipelines.find((p) => /sales|equipment/i.test(p.name));
const service = pipes.pipelines.find((p) => /service|modif|repair/i.test(p.name) && !/parts/i.test(p.name));
const parts = pipes.pipelines.find((p) => /parts|lubric/i.test(p.name));
console.log("\nSuggested .env.local lines (first stage of each pipeline):");
if (sales) console.log(`GHL_SALES_PIPELINE_ID=${sales.id}\nGHL_SALES_STAGE_ID=${first(sales)}`); else console.log("  ✗ no pipeline named like \"Equipment Sales\"");
if (service) console.log(`GHL_SERVICE_PIPELINE_ID=${service.id}\nGHL_SERVICE_STAGE_ID=${first(service)}`); else console.log("  ✗ no pipeline named like \"Service & Modifications\"");
if (parts) console.log(`GHL_PARTS_PIPELINE_ID=${parts.id}\nGHL_PARTS_STAGE_ID=${first(parts)}`); else console.log("  ✗ no pipeline named like \"Parts & Lubricants\"");
const fields = (await get(`/locations/${loc}/customFields?model=contact`)) as { customFields: { fieldKey: string; name: string; dataType: string }[] };
const need = ["contact.lead_source", "contact.model_of_interest", "contact.requested_items", "contact.first_touchpoint_date", "contact.first_touchpoint_channel", "contact.customer_segment", "contact.financing_interest", "contact.website_page", "contact.machine_owned", "contact.serial_number", "contact.first_touchpoint_campaign", "contact.landing_page", "contact.last_touchpoint_channel", "contact.last_touchpoint_campaign", "contact.google_click_id", "contact.marketing_consent_date"];
console.log("\nCustom fields:");
for (const k of need) { const f = fields.customFields.find((x) => x.fieldKey === k); console.log(`  ${f ? "✓" : "✗"} ${k}${f ? `  (${f.name}, ${f.dataType})` : "  MISSING"}`); }
process.exit(0);
