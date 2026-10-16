import { getSiteContent } from "@/lib/catalogue";

export const dynamic = "force-dynamic";

const esc = (s: string) => s.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[c] ?? c);
const mime = (src: string) => (/\.png$/i.test(src) ? "image/png" : /\.webp$/i.test(src) ? "image/webp" : "image/jpeg");

/** RSS 2.0 feed of the guides and field notes, newest first; linked from every page's <head>. */
export async function GET() {
  const { posts, site } = await getSiteContent();
  const sorted = [...posts].sort((a, b) => (b.publishedAt > a.publishedAt ? 1 : -1));
  const items = sorted.map((p) => {
    const url = `${site.url}/blog/${p.slug}`;
    const cover = p.cover ? `${site.url}${p.cover.full ?? p.cover.src}` : undefined;
    return `<item><title>${esc(p.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate><category>${esc(p.category)}</category><description>${esc(p.excerpt)}</description>${cover ? `<enclosure url="${esc(cover)}" type="${mime(cover)}" length="0"/>` : ""}</item>`;
  }).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${esc(site.name)}: RIPPA guides and field notes</title><link>${site.url}/blog</link><atom:link href="${site.url}/blog/feed.xml" rel="self" type="application/rss+xml"/><description>Maintenance guides, buying advice and how-to videos for RIPPA mini excavators, skid steers and loaders from the RIPPA Service Centre in Thorold, Ontario.</description><language>en-ca</language><lastBuildDate>${new Date(sorted[0]?.publishedAt ?? Date.now()).toUTCString()}</lastBuildDate>${items}</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=900" } });
}
