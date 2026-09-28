import { getSiteContent } from "@/lib/catalogue";
import { machineConfigPrice, PRICES_ENABLED } from "@/lib/pricing";
import { isThin } from "@/lib/machines";

/**
 * Google Merchant Center product feed (RSS 2.0 / g: namespace) at /api/merchant-feed.
 * Google requires a price on every item and the same price visible on the landing page, so items are emitted only
 * while PRICES_ENABLED is true and the configuration has a price. Until then the feed is valid but empty, and the
 * Product structured data on each page still supports free organic product listings.
 */
export const dynamic = "force-dynamic";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const { catalogue, site } = await getSiteContent();
  const items: string[] = [];
  if (PRICES_ENABLED) {
    for (const m of catalogue.machines.filter((x) => !isThin(x))) {
      const cfgs = m.configurations.length ? m.configurations : [{ id: "base", label: "", sku: undefined }];
      for (const c of cfgs) {
        const price = machineConfigPrice(m, c.id === "base" ? undefined : c.id);
        if (price === undefined) continue;
        const img = m.images[0]?.src ? (m.images[0].src.startsWith("http") ? m.images[0].src : `${site.url}${m.images[0].src}`) : undefined;
        items.push(`<item>
  <g:id>${esc(c.sku ?? `${m.slug}-${c.id}`)}</g:id>
  <g:item_group_id>${esc(m.slug)}</g:item_group_id>
  <g:title>${esc(`${m.brand} ${m.modelName}${c.label ? ` ${c.label}` : ""}`)}</g:title>
  <g:description>${esc(m.shortDescription)}</g:description>
  <g:link>${esc(`${site.url}/inventory/${m.category}/${m.slug}`)}</g:link>
  ${img ? `<g:image_link>${esc(img)}</g:image_link>` : ""}
  <g:brand>${esc(m.brand)}</g:brand>
  <g:mpn>${esc(m.modelName)}</g:mpn>
  <g:condition>new</g:condition>
  <g:availability>${m.inStock ? "in_stock" : "preorder"}</g:availability>
  <g:price>${price.toFixed(2)} CAD</g:price>
  <g:google_product_category>Business &amp; Industrial &gt; Heavy Machinery</g:google_product_category>
  <g:product_type>${esc(m.category)}</g:product_type>
</item>`);
      }
    }
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>${esc(site.name)}</title>
<link>${esc(site.url)}</link>
<description>${esc(site.description)}</description>
${items.join("\n")}
</channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
