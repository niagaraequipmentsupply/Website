import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** IndexNow ownership check: /indexnow/<key>.txt must answer with the key itself (see src/lib/indexnow.ts). */
export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const expected = process.env.INDEXNOW_KEY?.trim();
  if (!expected || key !== `${expected}.txt`) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(expected, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
