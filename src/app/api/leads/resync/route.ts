import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getPayload, type Where } from "payload";
import config from "@payload-config";
import { ghlConfigured, pushLeadToGhl, type LeadRecord } from "@/lib/ghl";

export const dynamic = "force-dynamic";

/**
 * Re-send leads to GoHighLevel from the stored submission: every lead marked "CRM sync failed", or the ids in the body
 * ({ "ids": [12, 15] }). Authorised by a logged-in admin session or `Authorization: Bearer <BACKUP_TOKEN>`.
 * From the project folder: `npm run ghl:resync` (scripts/ghl-resync.sh).
 */
function tokenOk(req: Request): boolean {
  const expected = process.env.BACKUP_TOKEN;
  if (!expected) return false;
  const given = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  const a = Buffer.from(given), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const payload = await getPayload({ config });
  let authorized = tokenOk(req);
  if (!authorized) { try { authorized = !!(await payload.auth({ headers: req.headers })).user; } catch { authorized = false; } }
  if (!authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!ghlConfigured()) return NextResponse.json({ error: "GoHighLevel is not configured on this server." }, { status: 503 });

  const body = (await req.json().catch(() => ({}))) as { ids?: number[] };
  const where: Where = body.ids?.length ? { id: { in: body.ids } } : { status: { equals: "failed" } };
  const { docs } = await payload.find({ collection: "leads", where, limit: 200, overrideAccess: true, sort: "createdAt" });
  const results: { id: number; ok: boolean; contactId?: string; opportunityId?: string; error?: string }[] = [];
  for (const doc of docs) {
    const lead = doc.payload as unknown as LeadRecord | undefined;
    if (!lead?.contact?.email) { results.push({ id: doc.id, ok: false, error: "no stored submission" }); continue; }
    try {
      const r = await pushLeadToGhl(lead);
      await payload.update({ collection: "leads", id: doc.id, data: { status: "synced", error: null, ghlContactId: r.contactId, ghlOpportunityId: r.opportunityId }, overrideAccess: true });
      results.push({ id: doc.id, ok: true, contactId: r.contactId, opportunityId: r.opportunityId });
    } catch (err) {
      const message = (err as Error).message.slice(0, 300);
      await payload.update({ collection: "leads", id: doc.id, data: { status: "failed", error: message }, overrideAccess: true }).catch(() => undefined);
      results.push({ id: doc.id, ok: false, error: message });
    }
  }
  return NextResponse.json({ total: docs.length, synced: results.filter((r) => r.ok).length, results });
}
