import { site } from "@/data/site";

const abs = (u: string) => (u.startsWith("http") ? u : `${site.url}${u}`);

/**
 * ItemList markup for a listing page (category, catalogue index): tells Google which product pages the list points
 * at and in what order. Pure listing data, so it stays valid while Product markup is gated on prices.
 */
export function itemListLd(name: string, items: { url: string; name: string; image?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, url: abs(it.url), name: it.name, ...(it.image ? { image: abs(it.image) } : {}) })),
  };
}
