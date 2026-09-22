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
    address: { "@type": "PostalAddress", addressLocality: site.address.city, addressRegion: site.address.region, addressCountry: site.address.country },
    areaServed: "Ontario, Canada",
    brand: { "@type": "Brand", name: "RIPPA" },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
