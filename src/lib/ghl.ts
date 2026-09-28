/**
 * GoHighLevel (LeadConnector) integration for website leads.
 *
 * Mode A (recommended): private integration token + location. We upsert the contact, tag it by lead source,
 * attach a note with the full request, and open an opportunity in the sales pipeline.
 *   GHL_API_KEY        Private Integration token (Settings → Private Integrations; scopes: contacts, opportunities, notes)
 *   GHL_LOCATION_ID    Sub-account / location id
 *   GHL_PIPELINE_ID    Pipeline to open opportunities in
 *   GHL_STAGE_ID       Default stage id for new opportunities
 *   GHL_STAGE_MAP      Optional JSON {"quote":"stageId","service":"stageId",…} to route by lead source
 *   GHL_SKIP_OPPORTUNITY_SOURCES  Optional CSV of sources that should not open an opportunity (default: content-request)
 * Mode B (simplest): GHL_WEBHOOK_URL — an Inbound Webhook trigger URL from a GHL workflow; we POST the lead JSON.
 * Both modes can be on at once. Errors are logged, never shown to the customer.
 */
import type { LeadPayload } from "@/lib/types";

const API = "https://services.leadconnectorhq.com";
const VERSION = "2021-07-28";

export interface LeadRecord extends LeadPayload { receivedAt: string; summary: string; lines: string[] }

export const ghlConfigured = () => !!(process.env.GHL_WEBHOOK_URL || (process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID));

const SOURCE_TAGS: Record<LeadPayload["source"], string[]> = {
  quote: ["website", "quote-request"], builder: ["website", "builder-build"], contact: ["website", "contact"], financing: ["website", "financing"],
  service: ["website", "service-centre"], parts: ["website", "parts-request"], lubricants: ["website", "lubricants-b2b"], "content-request": ["website", "content-request"],
};
const SOURCE_NAMES: Record<LeadPayload["source"], string> = {
  quote: "Quote request", builder: "Machine build", contact: "Equipment enquiry", financing: "Financing enquiry", service: "Service / warranty request", parts: "Parts request", lubricants: "Lubricants program", "content-request": "Content request",
};

async function api<T>(path: string, body: unknown, method = "POST"): Promise<T> {
  const res = await fetch(`${API}${path}`, { method, headers: { Authorization: `Bearer ${process.env.GHL_API_KEY}`, Version: VERSION, "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`GHL ${method} ${path} → ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return (await res.json()) as T;
}

const splitName = (full: string) => { const parts = full.trim().split(/\s+/); return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") || undefined }; };

/** Push one lead to GHL. Returns ids for the local record. */
export async function pushLeadToGhl(lead: LeadRecord): Promise<{ contactId?: string; opportunityId?: string; webhook?: boolean }> {
  const out: { contactId?: string; opportunityId?: string; webhook?: boolean } = {};
  if (process.env.GHL_WEBHOOK_URL) {
    const res = await fetch(process.env.GHL_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) });
    if (!res.ok) throw new Error(`GHL webhook → ${res.status}`);
    out.webhook = true;
  }
  const locationId = process.env.GHL_LOCATION_ID;
  if (process.env.GHL_API_KEY && locationId) {
    const c = lead.contact;
    const upsert = await api<{ contact: { id: string } }>("/contacts/upsert", {
      locationId, ...splitName(c.name), email: c.email, phone: c.phone, companyName: c.company || undefined, city: c.location || undefined,
      source: `Website · ${SOURCE_NAMES[lead.source]}`, tags: SOURCE_TAGS[lead.source] ?? ["website"],
      customFields: [], 
    });
    out.contactId = upsert.contact.id;
    await api(`/contacts/${out.contactId}/notes`, { userId: undefined, body: `${SOURCE_NAMES[lead.source]} from ${lead.page ?? "website"} (${lead.receivedAt})\n\n${lead.summary}${lead.lines.length ? `\n\n${lead.lines.map((l) => `• ${l}`).join("\n")}` : ""}` });
    const skip = (process.env.GHL_SKIP_OPPORTUNITY_SOURCES ?? "content-request").split(",").map((s) => s.trim());
    const pipelineId = process.env.GHL_PIPELINE_ID;
    let stageId = process.env.GHL_STAGE_ID;
    try { const map = process.env.GHL_STAGE_MAP ? (JSON.parse(process.env.GHL_STAGE_MAP) as Record<string, string>) : {}; stageId = map[lead.source] ?? stageId; } catch { /* keep default */ }
    if (pipelineId && stageId && !skip.includes(lead.source)) {
      const opp = await api<{ opportunity: { id: string } }>("/opportunities/", {
        locationId, pipelineId, pipelineStageId: stageId, contactId: out.contactId, status: "open",
        name: `${c.name} · ${SOURCE_NAMES[lead.source]}${lead.lines[0] ? ` · ${lead.lines[0].slice(0, 60)}` : ""}`,
        source: "Website",
      });
      out.opportunityId = opp.opportunity.id;
    }
  }
  return out;
}
