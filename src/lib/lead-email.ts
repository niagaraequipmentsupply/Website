import type { BasePayload } from "payload";
import type { LeadRecord } from "@/lib/ghl";

/**
 * Internal lead alert, active when RESEND_API_KEY is set (see payload.config.ts): one email per lead to LEAD_NOTIFY_EMAIL
 * (defaults to the site email). The customer's confirmation is sent by the CRM workflow in GoHighLevel so the whole
 * conversation lives in one inbox; the website sends them nothing directly.
 */
export const emailEnabled = () => !!process.env.RESEND_API_KEY;

interface SiteInfo { name: string; email: string; phone: string; url: string; hoursList: { day: string; time: string }[] }

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
const SOURCE_LABEL: Record<LeadRecord["source"], string> = { quote: "Quote request", builder: "Builder package", contact: "Contact / machine enquiry", financing: "Financing request", service: "Service Centre request", parts: "Parts request", lubricants: "Lubricants request", "content-request": "Content request" };

function wrap(site: SiteInfo, title: string, body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f3f5f8;font-family:Helvetica,Arial,sans-serif;color:#1f2933">
<div style="max-width:600px;margin:0 auto;padding:24px 16px">
  <div style="background:#083d91;color:#fff;padding:18px 22px;font-weight:700;font-size:18px;letter-spacing:.02em">${esc(site.name)}</div>
  <div style="background:#fff;border:1px solid #e1e6ee;border-top:0;padding:22px">
    <h1 style="margin:0 0 12px;font-size:20px;color:#083d91">${esc(title)}</h1>
    ${body}
  </div>
  <p style="font-size:12px;color:#6b7785;margin:14px 4px 0">${esc(site.name)} · ${esc(site.phone)} · <a href="${esc(site.url)}" style="color:#083d91">${esc(site.url.replace(/^https?:\/\//, ""))}</a></p>
</div></body></html>`;
}

export async function sendLeadEmails(payload: BasePayload, lead: LeadRecord, site: SiteInfo, leadId?: number): Promise<void> {
  if (!emailEnabled()) return;
  const c = lead.contact;
  const label = SOURCE_LABEL[lead.source] ?? lead.source;
  const lines = lead.lines.length ? `<ul style="padding-left:18px;margin:8px 0">${lead.lines.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>` : "";
  const adminUrl = leadId ? `${site.url}/admin/collections/leads/${leadId}` : `${site.url}/admin/collections/leads`;

  const internalHtml = wrap(site, `New website lead: ${label}`, `
    <table style="border-collapse:collapse;font-size:14px">
      ${[["Name", c.name], ["Company", c.company], ["Email", c.email], ["Phone", c.phone], ["Location", c.location], ["Page", lead.page], ["Received", lead.receivedAt]].filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#6b7785">${esc(k!)}</td><td style="padding:4px 0"><strong>${esc(v!)}</strong></td></tr>`).join("")}
    </table>
    ${lead.summary ? `<p style="margin:14px 0 4px;color:#6b7785;font-size:13px">Message</p><p style="white-space:pre-wrap;margin:0">${esc(lead.summary)}</p>` : ""}
    ${lines ? `<p style="margin:14px 0 4px;color:#6b7785;font-size:13px">Requested items</p>${lines}` : ""}
    <p style="margin-top:18px"><a href="${esc(adminUrl)}" style="background:#083d91;color:#fff;padding:10px 16px;text-decoration:none;font-weight:700;display:inline-block">Open in admin</a></p>`);

  const text = (html: string) => html.replace(/<style[\s\S]*?<\/style>/g, "").replace(/<br\s*\/?>/g, "\n").replace(/<\/(p|li|tr|h1)>/g, "\n").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\n{3,}/g, "\n\n").trim();

  try {
    await payload.sendEmail({ to: process.env.LEAD_NOTIFY_EMAIL || site.email, replyTo: c.email, subject: `New lead · ${label} · ${c.name}${lead.lines[0] ? ` · ${lead.lines[0].slice(0, 40)}` : ""}`, html: internalHtml, text: text(internalHtml) });
  } catch (err) { console.error("[lead] email failed", err); }
}
