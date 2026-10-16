import type { SiteContent } from "@/lib/catalogue";
import { serviceAreas } from "@/data/service-areas";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const dayIndex = (token: string) => DAYS.findIndex((d) => d.toLowerCase().startsWith(token.trim().toLowerCase().slice(0, 3)));
const to24h = (t: string) => {
  const m = t.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!m) return undefined;
  let h = Number(m[1]); const min = m[2] ?? "00"; const ap = m[3]?.toLowerCase();
  if (ap === "pm" && h < 12) h += 12;
  if (ap === "am" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${min}`;
};

/** "Mon – Fri" / "Thursday – Friday" / "Saturday" + "8:30 AM – 4:30 PM" → OpeningHoursSpecification; closed / by-appointment rows are skipped. */
function openingHours(rows: { day: string; time: string }[]) {
  const out: { "@type": "OpeningHoursSpecification"; dayOfWeek: string[]; opens: string; closes: string }[] = [];
  for (const r of rows) {
    const [openText, closeText] = r.time.match(/\d{1,2}(?::\d{2})?\s*(?:am|pm)?/gi) ?? [];
    if (!openText || !closeText) continue;
    const opens = to24h(openText); const closes = to24h(closeText);
    if (!opens || !closes) continue;
    const [from, to, ...rest] = r.day.split(/\s*[–-]\s*/);
    let days: string[] = [];
    if (from && to && rest.length === 0 && dayIndex(from) >= 0 && dayIndex(to) >= 0) days = DAYS.slice(dayIndex(from), dayIndex(to) + 1);
    else days = r.day.split(/\s*(?:,|&|and)\s*/).map((d) => DAYS[dayIndex(d)]).filter((d): d is string => !!d);
    if (days.length) out.push({ "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes });
  }
  return out;
}

export function OrganizationSchema({ site }: { site: SiteContent["site"] }) {
  const digits = site.phoneHref.replace(/\D/g, "");
  const telephone = digits.length === 11 ? `+${digits.slice(0, 1)}-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}` : site.phone;
  const hours = openingHours(site.hoursList);
  const businessId = `${site.url}/#business`;
  const business = {
    "@type": "LocalBusiness",
    "@id": businessId,
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    url: site.url,
    telephone,
    email: site.email,
    priceRange: "$$",
    currenciesAccepted: "CAD",
    address: { "@type": "PostalAddress", streetAddress: site.address.street || undefined, addressLocality: site.address.city, addressRegion: site.address.region, postalCode: site.address.postal || undefined, addressCountry: site.address.country },
    ...(site.geo ? { geo: { "@type": "GeoCoordinates", latitude: site.geo.latitude, longitude: site.geo.longitude } } : {}),
    areaServed: [{ "@type": "AdministrativeArea", name: "Ontario, Canada" }, ...serviceAreas.map((a) => ({ "@type": "City", name: a.name, url: `${site.url}/service-area/${a.slug}` }))],
    ...(site.mapEmbedUrl ? { hasMap: site.mapEmbedUrl } : {}),
    brand: { "@type": "Brand", name: "RIPPA" },
    image: `${site.url}/brand/og-default.png`,
    logo: `${site.url}/brand/logo-light.png`,
    ...(hours.length ? { openingHoursSpecification: hours } : {}),
    contactPoint: [
      { "@type": "ContactPoint", telephone, contactType: "sales", areaServed: "CA", availableLanguage: "English" },
      { "@type": "ContactPoint", telephone, contactType: "customer service", areaServed: "CA", availableLanguage: "English" },
    ],
    sameAs: Object.values(site.social).filter((u): u is string => typeof u === "string" && /^https?:/.test(u)),
    knowsAbout: ["RIPPA mini excavators", "RIPPA skid steers", "compact equipment service", "RIPPA warranty repairs", "excavator attachments"],
  };
  // WebSite + SearchAction lets Google offer a sitelinks search box pointing at /search.
  const website = {
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    inLanguage: "en-CA",
    publisher: { "@id": businessId },
    potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${site.url}/search?q={search_term_string}` }, "query-input": "required name=search_term_string" },
  };
  const data = { "@context": "https://schema.org", "@graph": [business, website] };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
