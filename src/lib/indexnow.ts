import { site } from "@/data/site";

/**
 * IndexNow: tells Bing, Yandex, Seznam and Naver (and through Bing, DuckDuckGo and ChatGPT search) about new or changed
 * URLs within seconds instead of waiting for a crawl. Google ignores it; nothing is lost by sending.
 * Needs INDEXNOW_KEY; the key is served back at /<key>.txt (src/proxy.ts), which is how the engines verify ownership.
 * The file must sit at the site root: a key under a subfolder can only verify URLs inside that folder.
 */
const ENDPOINT = "https://api.indexnow.org/indexnow";
const key = () => process.env.INDEXNOW_KEY?.trim();

/** Only submit for the real production host, never for localhost or preview builds. */
export const indexNowConfigured = (): boolean => !!key() && /^https:\/\//.test(site.url) && !/localhost|127\.0\.0\.1/.test(site.url);

export const indexNowKeyLocation = () => `${site.url}/${key()}.txt`;

/** Submit site-relative or absolute URLs (deduplicated, max 10,000 per call). Returns the HTTP status, or null when not configured. */
export async function submitIndexNow(urls: string[]): Promise<number | null> {
  const k = key();
  if (!k || !indexNowConfigured()) return null;
  const urlList = [...new Set(urls.map((u) => (u.startsWith("http") ? u : `${site.url}${u}`)))].slice(0, 10000);
  if (!urlList.length) return null;
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(site.url).host, key: k, keyLocation: indexNowKeyLocation(), urlList }),
  });
  return res.status;
}

/** Which public URLs a CMS document change affects, by collection. */
export function urlsForDoc(collection: string, doc: Record<string, unknown>): string[] {
  const slug = typeof doc.slug === "string" ? doc.slug : undefined;
  switch (collection) {
    case "posts": return slug ? [`/blog/${slug}`, "/blog"] : ["/blog"];
    case "machines": return slug && typeof doc.category === "string" ? [`/inventory/${doc.category}/${slug}`, `/inventory/${doc.category}`] : ["/inventory"];
    case "attachments": return slug && typeof doc.attachmentCategory === "string" ? [`/attachments/${doc.attachmentCategory}/${slug}`, `/attachments/${doc.attachmentCategory}`] : ["/attachments"];
    case "parts": return slug ? [`/parts/item/${slug}`, "/parts"] : ["/parts"];
    case "categories": return slug ? [`/inventory/${slug}`, "/inventory"] : ["/inventory"];
    case "attachment-categories": return slug ? [`/attachments/${slug}`, "/attachments"] : ["/attachments"];
    default: return ["/"];
  }
}

// Changes arrive in bursts (a seed run, a batch of edits); collect them and send one request a few seconds later.
const pending = new Set<string>();
let timer: ReturnType<typeof setTimeout> | undefined;
export function queueIndexNow(urls: string[]): void {
  if (!indexNowConfigured()) return;
  for (const u of urls) pending.add(u);
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    const batch = [...pending];
    pending.clear();
    submitIndexNow(batch).catch(() => { /* best effort; the sitemap still covers everything */ });
  }, 3000);
  (timer as { unref?: () => void }).unref?.();
}
