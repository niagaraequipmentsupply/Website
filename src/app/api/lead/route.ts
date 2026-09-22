import { NextResponse } from "next/server";
import type { LeadPayload } from "@/lib/types";

/**
 * Generic lead endpoint. Forwards the structured payload to LEAD_WEBHOOK_URL (Zapier, Make, HubSpot,
 * a CRM endpoint, etc.) when configured, otherwise logs it. Swap in email (Resend) or a DB insert here.
 */
export async function POST(req: Request) {
  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const c = body?.contact;
  if (!c?.name || !c?.email || !c?.phone || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email)) {
    return NextResponse.json({ error: "Name, email and phone are required." }, { status: 400 });
  }
  const lead = { ...body, receivedAt: new Date().toISOString(), userAgent: req.headers.get("user-agent") ?? undefined };

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json", ...(process.env.LEAD_WEBHOOK_SECRET ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_SECRET}` } : {}) }, body: JSON.stringify(lead) });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      console.error("[lead] webhook failed", err);
      return NextResponse.json({ error: "We couldn't send your request. Please call us." }, { status: 502 });
    }
  } else {
    console.info("[lead] (no LEAD_WEBHOOK_URL configured)", JSON.stringify(lead, null, 2));
  }
  return NextResponse.json({ ok: true });
}
