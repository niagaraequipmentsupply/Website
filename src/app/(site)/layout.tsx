import type { Metadata } from "next";
import { Anton, Raleway } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OrganizationSchema } from "@/components/layout/OrganizationSchema";
import { Analytics } from "@/components/layout/Analytics";
import { CatalogueProvider } from "@/components/CatalogueProvider";
import { getSiteContent } from "@/lib/catalogue";
import { site as siteDefaults } from "@/data/site";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const raleway = Raleway({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-raleway", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteDefaults.url),
  title: { default: `${siteDefaults.name} | Official RIPPA Dealer in Ontario`, template: `%s | ${siteDefaults.name}` },
  description: siteDefaults.description,
  openGraph: { siteName: siteDefaults.name, type: "website", locale: "en_CA" },
  robots: { index: true, follow: true },
};

/** Revalidate every 5 minutes; Payload hooks also purge the cache on every admin save. */
export const revalidate = 300;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { catalogue, financing, site, nav } = await getSiteContent();
  return (
    <html lang="en-CA" data-scroll-behavior="smooth" className={`${anton.variable} ${raleway.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:px-3 focus:py-2 focus:rounded-btn focus:shadow-card">
          Skip to content
        </a>
        <CatalogueProvider value={{ catalogue, financing, taxRate: site.tax.rate, taxLabel: site.tax.label, phone: site.phone, phoneHref: site.phoneHref }}>
          <AnnouncementBar left={site.announcement.left} right={site.announcement.right} />
          <Header nav={nav} contact={{ phone: site.phone, phoneHref: site.phoneHref, address: [site.address.street, site.address.city, site.address.region, site.address.postal].filter(Boolean).join(", "), hours: site.hoursList, mapEmbedUrl: site.mapEmbedUrl }} />
          <main id="main" className="flex-1">{children}</main>
          <Footer site={site} />
        </CatalogueProvider>
        <OrganizationSchema site={site} />
        <Analytics />
      </body>
    </html>
  );
}
