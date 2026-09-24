import type { SiteContent } from "@/lib/catalogue";

export function OrganizationSchema({ site }: { site: SiteContent["site"] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    address: { "@type": "PostalAddress", streetAddress: site.address.street || undefined, addressLocality: site.address.city, addressRegion: site.address.region, postalCode: site.address.postal || undefined, addressCountry: site.address.country },
    areaServed: "Ontario, Canada",
    brand: { "@type": "Brand", name: "RIPPA" },
    image: `${site.url}/brand/logo-light.png`,
    logo: `${site.url}/brand/logo-light.png`,
    openingHours: site.hours.map((h) => `${h.day} ${h.time}`),
    sameAs: Object.values(site.social).filter((u): u is string => typeof u === "string" && /^https?:/.test(u)),
    knowsAbout: ["RIPPA mini excavators", "RIPPA skid steers", "compact equipment service", "RIPPA warranty repairs", "excavator attachments"],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
