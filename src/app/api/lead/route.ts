import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import type { LeadPayload } from "@/lib/types";
import { getSiteContent } from "@/lib/catalogue";
import { ghlConfigured, pushLeadToGhl, type LeadRecord } from "@/lib/ghl";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { verifyTurnstile, turnstileEnabled } from "@/lib/turnstile";
import { sendLeadEmails } from "@/lib/lead-email";
import { includedWith } from "@/lib/included";
import { normalizePhone } from "@/lib/phone";

const PAYMENT_LABEL: Record<string, string> = { cash: "Pay in full", finance: "Finance / leasing", lease: "Finance / leasing" };

/**
 * Lead endpoint for every website form. Order of operations:
 *  1. validate;  2. store in the Leads collection (never lose a lead);  3. push to GoHighLevel (contact + note + opportunity)
 *  and/or LEAD_WEBHOOK_URL;  4. record sync status. The customer only sees an error if nothing could be stored.
 */
export async function POST(req: Request) {
  const ip = clientIp(req);
  const limit = rateLimit(`lead:${ip}`, 6, 10 * 60 * 1000);
  if (!limit.ok) return NextResponse.json({ error: "Too many requests from this connection. Please wait a few minutes or call us." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } });
  let body: LeadPayload;
  try { body = (await req.json()) as LeadPayload; } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const c = body?.contact;
  if (!c?.name || !c?.email || !c?.phone || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email)) return NextResponse.json({ error: "Name, email and phone are required." }, { status: 400 });
  const phone = normalizePhone(c.phone);
  if (!phone) return NextResponse.json({ error: "Please enter a phone number with the area code, e.g. 905-555-0123." }, { status: 400 });
  c.phone = phone; // stored and sent to the CRM in +1 format so texting works
  if (typeof (body as { website?: unknown }).website === "string" && (body as { website?: string }).website) return NextResponse.json({ ok: true }); // honeypot
  // Bots fill forms in milliseconds; a person needs at least a couple of seconds. Silently accept so the bot learns nothing.
  if (body.startedAt && Date.now() - Date.parse(body.startedAt) < 1500 && Date.now() - Date.parse(body.startedAt) >= 0) return NextResponse.json({ ok: true });
  if (turnstileEnabled() && !(await verifyTurnstile(body.turnstileToken, ip))) return NextResponse.json({ error: "We couldn't verify your browser. Please try again or call us." }, { status: 400 });

  const lead: LeadRecord = { ...body, receivedAt: new Date().toISOString(), summary: c.message?.trim() || "", lines: await describeItems(body), value: await estimateValue(body) };
  const title = `${c.name} · ${lead.source}${lead.lines[0] ? ` · ${lead.lines[0].slice(0, 50)}` : ""}`;

  let payload: Awaited<ReturnType<typeof getPayload>> | undefined; let leadId: number | undefined;
  try {
    payload = await getPayload({ config });
    const doc = await payload.create({ collection: "leads", data: { marketingConsent: !!body.marketingConsent, consentAt: body.marketingConsent ? new Date().toISOString() : undefined, title, source: lead.source, status: "new", name: c.name, email: c.email, phone: c.phone, company: c.company, location: c.location, message: lead.summary, lines: lead.lines.map((text) => ({ text })), page: lead.page, payload: lead as unknown as Record<string, unknown> }, overrideAccess: true });
    leadId = doc.id;
  } catch (err) { console.error("[lead] could not store lead", err); }

  const errors: string[] = []; let synced = false; const ids: { ghlContactId?: string; ghlOpportunityId?: string } = {};
  if (ghlConfigured()) {
    try { const r = await pushLeadToGhl(lead); ids.ghlContactId = r.contactId; ids.ghlOpportunityId = r.opportunityId; synced = true; } catch (err) { errors.push(`GHL: ${(err as Error).message}`); console.error("[lead] GHL failed", err); }
  }
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json", ...(process.env.LEAD_WEBHOOK_SECRET ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_SECRET}` } : {}) }, body: JSON.stringify(lead) });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`); synced = true;
    } catch (err) { errors.push(`Webhook: ${(err as Error).message}`); console.error("[lead] webhook failed", err); }
  }
  if (!ghlConfigured() && !webhook) console.info("[lead] stored only (no GHL / LEAD_WEBHOOK_URL configured)", title);
  if (payload) {
    try { const { site } = await getSiteContent(); await sendLeadEmails(payload, lead, { name: site.name, email: site.email, phone: site.phone, url: site.url, hoursList: site.hoursList }, leadId); } catch (err) { console.error("[lead] email", err); }
  }

  if (payload && leadId) {
    try { await payload.update({ collection: "leads", id: leadId, data: { status: errors.length ? "failed" : synced ? "synced" : "new", error: errors.join("\n") || undefined, ...ids }, overrideAccess: true }); } catch (err) { console.error("[lead] could not update lead status", err); }
  }
  if (!leadId && errors.length) return NextResponse.json({ error: "We couldn't send your request. Please call us." }, { status: 502 });
  return NextResponse.json({ ok: true });
}

/**
 * Indicative deal value from the prices stored in the CMS (machine configuration, attachments, add-ons, warranty), whether or
 * not prices are shown on the site. Used as the opportunity's monetary value so pipeline reports have a figure; undefined when
 * nothing in the request carries a price.
 */
async function estimateValue(body: LeadPayload): Promise<number | undefined> {
  try {
    const { catalogue } = await getSiteContent();
    const machine = (id?: string) => catalogue.machines.find((m) => m.id === id);
    const att = (id?: string) => catalogue.attachments.find((a) => a.id === id);
    const machinePrice = (id?: string, cfgId?: string) => { const m = machine(id); const cfg = m?.configurations.find((x) => x.id === cfgId); return cfg?.price ?? m?.promoPrice ?? m?.basePrice; };
    const attPrice = (id?: string, variantId?: string) => { const a = att(id); const v = a?.variants.find((x) => x.id === variantId) ?? a?.variants[0]; return v?.price ?? a?.basePrice; };
    let total = 0, priced = false;
    const add = (p?: number, qty = 1) => { if (typeof p === "number" && p > 0) { total += p * qty; priced = true; } };
    for (const it of body.items ?? []) {
      if (it.kind === "machine") add(machinePrice(it.machineId, it.configurationId), it.quantity);
      else if (it.kind === "attachment") add(attPrice(it.attachmentId, it.variantId), it.quantity);
    }
    for (const b of body.builds ?? []) {
      const cfg = b.configuration;
      add(machinePrice(cfg.selectedModelId, cfg.selectedConfigurationId));
      for (const s of cfg.attachmentSelections) add(attPrice(s.attachmentId, s.variantId), s.quantity);
      for (const id of cfg.addonSelections) add(catalogue.addons.find((a) => a.id === id)?.price);
      if (cfg.warrantySelectionId) add(catalogue.warranties.find((w) => w.id === cfg.warrantySelectionId)?.price);
    }
    return priced ? Math.round(total) : undefined;
  } catch (err) { console.error("[lead] estimateValue", err); return undefined; }
}

/** Human-readable lines for quote items and builds, resolved against the catalogue. */
async function describeItems(body: LeadPayload): Promise<string[]> {
  const lines: string[] = [];
  try {
    const { catalogue } = await getSiteContent();
    const machine = (id?: string) => catalogue.machines.find((m) => m.id === id);
    const att = (id?: string) => catalogue.attachments.find((a) => a.id === id);
    for (const it of body.items ?? []) {
      if (it.kind === "machine") { const m = machine(it.machineId); const cfg = m?.configurations.find((x) => x.id === it.configurationId); lines.push(`${it.quantity > 1 ? `${it.quantity}× ` : ""}${m ? `${m.brand} ${m.modelName}` : it.machineId}${cfg ? ` · ${cfg.label}` : ""}`); }
      else if (it.kind === "attachment") { const a = att(it.attachmentId); const v = a?.variants.find((x) => x.id === it.variantId); lines.push(`${it.quantity > 1 ? `${it.quantity}× ` : ""}${a?.name ?? it.attachmentId}${v ? ` · ${v.widthOrSize ?? v.label}${v.sku ? ` (${v.sku})` : ""}` : ""}`); }
      else if (it.kind === "build") lines.push(`Build: ${it.name}`);
    }
    for (const b of body.builds ?? []) {
      const cfg = b.configuration; const m = machine(cfg.selectedModelId); const c = m?.configurations.find((x) => x.id === cfg.selectedConfigurationId);
      lines.push(`Build: ${m ? `${m.brand} ${m.modelName}` : "machine"}${c ? ` · ${c.label}` : ""}`);
      const inc = includedWith(m); if (inc.length) lines.push(`  Included at no charge: ${inc.map((i) => i.label).join(", ")}`);
      for (const s of cfg.attachmentSelections) { const a = att(s.attachmentId); const v = a?.variants.find((x) => x.id === s.variantId); lines.push(`  + ${s.quantity > 1 ? `${s.quantity}× ` : ""}${a?.name ?? s.attachmentId}${v?.widthOrSize ? ` · ${v.widthOrSize}` : ""}`); }
      for (const id of cfg.addonSelections) { const a = catalogue.addons.find((x) => x.id === id); if (a) lines.push(`  + ${a.name}`); }
      if (cfg.warrantySelectionId) { const w = catalogue.warranties.find((x) => x.id === cfg.warrantySelectionId); if (w) lines.push(`  + ${w.name}`); }
      lines.push(`  Payment method: ${PAYMENT_LABEL[cfg.financeSelection] ?? cfg.financeSelection}`);
    }
  } catch (err) { console.error("[lead] describeItems", err); }
  return lines;
}
