/**
 * GoHighLevel (LeadConnector) integration for website leads.
 *
 * Two pipelines: Equipment Sales (quote, builder, contact, financing) and Parts & Service (parts, service, lubricants).
 * Per lead we upsert the contact (tags + custom fields), add a note with the full request, and open an opportunity.
 *   GHL_API_KEY               Private Integration token (contacts, opportunities, locations, custom fields scopes)
 *   GHL_LOCATION_ID           Sub-account id
 *   GHL_SALES_PIPELINE_ID / GHL_SALES_STAGE_ID   Equipment Sales pipeline + "New Lead" stage
 *   GHL_PARTS_PIPELINE_ID / GHL_PARTS_STAGE_ID   Parts & Service pipeline + "New Request" stage
 *   GHL_WEBHOOK_URL           Optional: a workflow Inbound Webhook URL that also receives the lead JSON
 * Custom field unique keys expected on the contact (create them with these exact names, see README):
 *   contact.lead_source, contact.model_of_interest, contact.requested_items, contact.first_touchpoint_date,
 *   contact.first_touchpoint_channel, contact.customer_segment, contact.financing_interest, contact.website_page
 * Run `npm run ghl:setup` to print pipeline / stage ids and check the fields exist.
 */
import type { LeadPayload } from "@/lib/types";

const API = "https://services.leadconnectorhq.com";
const VERSION = "2021-07-28";

export interface LeadRecord extends LeadPayload { receivedAt: string; summary: string; lines: string[] }

export const ghlConfigured = () => !!(process.env.GHL_WEBHOOK_URL || (process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID));
const PARTS_SOURCES: LeadPayload["source"][] = ["parts", "service", "lubricants"];
const NO_OPPORTUNITY: LeadPayload["source"][] = ["content-request"];
const LEAD_SOURCE_VALUE: Record<LeadPayload["source"], string> = {
  quote: "Website – Quote", builder: "Website – Builder", contact: "Website – Contact", financing: "Website – Financing", service: "Website – Service", parts: "Website – Parts", lubricants: "Website – Lubricants", "content-request": "Website – Content request",
};

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
    const models = Array.from(new Set(lead.lines.map((l) => l.match(/\b(R\d{2,3} (?:ECO|PRO)|RS\d{2}|RL06|RB06|RD06)\b/)?.[1]).filter((x): x is string => !!x)));
    const financing = lead.lines.find((l) => /Financing preference/.test(l))?.split(":")[1]?.trim();
    const upsert = await api<{ contact: { id: string } }>("/contacts/upsert", {
      locationId, ...splitName(c.name), email: c.email, phone: c.phone, companyName: c.company || undefined, city: c.location || undefined,
      source: `Website · ${SOURCE_NAMES[lead.source]}`, tags: SOURCE_TAGS[lead.source] ?? ["website"],
      customFields: [
        { key: "contact.lead_source", field_value: LEAD_SOURCE_VALUE[lead.source] },
        { key: "contact.first_touchpoint_channel", field_value: "Website" },
        { key: "contact.first_touchpoint_date", field_value: lead.receivedAt.slice(0, 10) },
        { key: "contact.website_page", field_value: lead.page ?? "" },
        ...(models.length ? [{ key: "contact.model_of_interest", field_value: models.join(", ") }] : []),
        ...(lead.lines.length ? [{ key: "contact.requested_items", field_value: lead.lines.join("\n").slice(0, 2000) }] : []),
        ...(financing ? [{ key: "contact.financing_interest", field_value: financing.charAt(0).toUpperCase() + financing.slice(1) }] : []),
      ],
    });
    out.contactId = upsert.contact.id;
    await api(`/contacts/${out.contactId}/notes`, { userId: undefined, body: `${SOURCE_NAMES[lead.source]} from ${lead.page ?? "website"} (${lead.receivedAt})\n\n${lead.summary}${lead.lines.length ? `\n\n${lead.lines.map((l) => `• ${l}`).join("\n")}` : ""}` });
    const parts = PARTS_SOURCES.includes(lead.source);
    const pipelineId = parts ? process.env.GHL_PARTS_PIPELINE_ID : process.env.GHL_SALES_PIPELINE_ID;
    const stageId = parts ? process.env.GHL_PARTS_STAGE_ID : process.env.GHL_SALES_STAGE_ID;
    if (pipelineId && stageId && !NO_OPPORTUNITY.includes(lead.source)) {
      const opp = await api<{ opportunity: { id: string } }>("/opportunities/", {
        locationId, pipelineId, pipelineStageId: stageId, contactId: out.contactId, status: "open",
        name: `${c.name} · ${SOURCE_NAMES[lead.source]}${models.length ? ` · ${models.join(" / ")}` : lead.lines[0] ? ` · ${lead.lines[0].slice(0, 60)}` : ""}`,
        source: LEAD_SOURCE_VALUE[lead.source],
      });
      out.opportunityId = opp.opportunity.id;
    }
  }
  return out;
}
