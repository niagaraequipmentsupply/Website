import { NextResponse } from "next/server";

/**
 * Edge guard for the Payload "create first user" flow. While the users collection is empty, Payload serves
 * /admin/create-first-user to anyone, so the production CMS could be claimed by a stranger. The screen and its
 * API endpoint answer 404 unless ALLOW_FIRST_USER=true is set; set it on Railway only while creating the account,
 * then remove it. Everything else under /admin is Payload's normal login.
 */
export function proxy() {
  if (process.env.ALLOW_FIRST_USER === "true") return NextResponse.next();
  return new NextResponse("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
}

export const config = {
  matcher: ["/admin/create-first-user", "/api/users/first-register"],
};
