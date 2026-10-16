import { NextResponse, type NextRequest } from "next/server";

const CANONICAL_HOST = "niagaraequipment.com";
const FIRST_USER_PATHS = new Set(["/admin/create-first-user", "/api/users/first-register"]);

/**
 * Two edge jobs:
 *  1. Canonical host. Railway's generated *.up.railway.app address still serves the whole site, which search engines
 *     see as a duplicate; everyone except Railway's own health check is sent to the real domain with a 301.
 *  2. Guard for Payload's "create first user" flow: while the users collection is empty Payload serves that screen to
 *     anyone, so it answers 404 unless ALLOW_FIRST_USER=true is set (set it on Railway only while creating the account).
 */
export function proxy(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  if (/\.up\.railway\.app$/i.test(host) && !/RailwayHealthCheck/i.test(req.headers.get("user-agent") ?? "")) {
    return NextResponse.redirect(new URL(req.nextUrl.pathname + req.nextUrl.search, `https://${CANONICAL_HOST}`), 301);
  }
  if (FIRST_USER_PATHS.has(req.nextUrl.pathname) && process.env.ALLOW_FIRST_USER !== "true") {
    return new NextResponse("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
