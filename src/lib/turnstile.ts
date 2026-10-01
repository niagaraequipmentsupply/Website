/**
 * Cloudflare Turnstile (free, invisible bot check). Active only when TURNSTILE_SECRET_KEY is set on the server and
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY on the client; with neither set, forms work exactly as before.
 */
export const turnstileEnabled = () => !!process.env.TURNSTILE_SECRET_KEY;

export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  if (!turnstileEnabled()) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: token, ...(ip && ip !== "unknown" ? { remoteip: ip } : {}) }),
    });
    const data = (await res.json().catch(() => ({}))) as { success?: boolean };
    return !!data.success;
  } catch (err) {
    console.error("[turnstile] verification failed", err);
    return false;
  }
}
