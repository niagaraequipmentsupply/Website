/** Tiny in-memory sliding-window limiter for the single-instance lead endpoint. Resets on deploy, which is fine. */
const buckets = new Map<string, number[]>();
let lastSweep = 0;

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  if (now - lastSweep > windowMs) {
    for (const [k, times] of buckets) { const live = times.filter((t) => now - t < windowMs); if (live.length) buckets.set(k, live); else buckets.delete(k); }
    lastSweep = now;
  }
  const times = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (times.length >= limit) return { ok: false, retryAfterSec: Math.ceil((windowMs - (now - times[0])) / 1000) };
  times.push(now);
  buckets.set(key, times);
  return { ok: true, retryAfterSec: 0 };
}

/** Best-effort client address behind Cloudflare / Railway. */
export function clientIp(req: Request): string {
  return req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown";
}
