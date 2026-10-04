import { getSiteContent } from "@/lib/catalogue";
import { isThin } from "@/lib/machines";
import { serviceAreas } from "@/data/service-areas";

export const dynamic = "force-dynamic";

/**
 * /llms.txt — a plain-text map of the site for AI crawlers and answer engines (llmstxt.org convention).
 * Summarises who we are and links every important page with a one-line description so models cite the right URL.
 */
export async function GET() {
  const { site, categories, attachmentCategories, posts, catalogue: { machines } } = await getSiteContent();
  const base = site.url;
  const hours = site.hoursList.map((h) => `${h.day} ${h.time}`).join("; ");
  const machineLine = (m: (typeof machines)[number]) => `- [RIPPA ${m.modelName}](${base}/inventory/${m.category}/${m.slug}): ${m.shortDescription.trim()}`;

  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} is an authorized RIPPA dealer at ${[site.address.street, site.address.city, site.address.region, site.address.postal].filter(Boolean).join(", ")}, Canada. We sell new RIPPA mini excavators, stand-on and ride-on skid steer loaders, compact wheel loaders, backhoe loaders and tracked dumpers with attachments, operate the RIPPA Service Centre (warranty repairs, scheduled maintenance, field service, genuine parts) and deliver anywhere in Ontario. Pricing is by written quote; financing and leasing are available on approved credit. Phone ${site.phone}. Email ${site.email}. Hours: ${hours}.`,
    "",
    "## Equipment categories",
    ...categories.map((c) => `- [${c.name}](${base}/inventory/${c.slug})${c.description ? `: ${c.description}` : ""}`),
    "",
    "## Machines",
    ...machines.filter((m) => !isThin(m)).map(machineLine),
    "",
    "## Attachments",
    `- [All attachments](${base}/attachments): buckets, thumbs, augers, breakers, grapples, forks and more, matched to each RIPPA model.`,
    ...attachmentCategories.map((c) => `- [${c.name}](${base}/attachments/${c.slug})`),
    "",
    "## Buying tools",
    `- [Excavator Builder](${base}/builder/excavator): configure a RIPPA mini excavator with attachments, service package and delivery, then request a written quote.`,
    `- [Skid Steer Builder](${base}/builder/skid-steer): configure a RIPPA skid steer loader package.`,
    `- [Compare models](${base}/compare): spec-by-spec comparison of up to four RIPPA machines.`,
    `- [Financing & leasing](${base}/financing): loans, lease-to-own and current promotions on approved credit.`,
    `- [Request a quote](${base}/quote)`,
    "",
    "## Service, parts and lubricants",
    `- [RIPPA Service Centre](${base}/service): warranty claims handled for the owner, in-shop and field repairs, maintenance, winterization. Every RIPPA owner welcome.`,
    `- [Genuine RIPPA parts](${base}/parts): parts by model and system, shipped across Canada.`,
    `- [Parts & service requests](${base}/service/parts)`,
    `- [Oil & lubricants](${base}/lubricants): Chevron and Catalys engine, hydraulic and gear oils for compact equipment.`,
    "",
    "## Service areas (Ontario)",
    ...serviceAreas.map((a) => `- [${a.name}](${base}/service-area/${a.slug}): ${a.drive} from our Thorold location.`),
    "",
    "## Guides and how-to articles",
    ...posts.map((p) => `- [${p.title}](${base}/blog/${p.slug}): ${p.excerpt.trim()}`),
    "",
    "## Company",
    `- [About](${base}/about)`,
    `- [Contact](${base}/contact)`,
    `- [Privacy policy](${base}/privacy)`,
    `- [Terms of use](${base}/terms)`,
    `- [Accessibility](${base}/accessibility)`,
    "",
    "## Optional",
    `- [Sitemap](${base}/sitemap.xml)`,
  ];

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=3600" },
  });
}
