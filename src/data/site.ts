/**
 * Dealer contact + site configuration. Replace placeholders before launch.
 */
export interface SiteConfig {
  name: string; legalName: string; tagline: string; description: string; url: string;
  phone: string; phoneHref: string; email: string;
  address: { street: string; city: string; region: string; postal: string; country: string };
  serviceArea: string;
  hours: { day: string; time: string }[];
  social: { facebook: string; instagram: string; youtube: string; linkedin: string; tiktok?: string; instagramHandle?: string; youtubeHandle?: string; facebookHandle?: string; tiktokHandle?: string };
  announcement: { left: string; right: string };
  tax: { label: string; rate: number | undefined };
  mapEmbedUrl?: string;
  currency: string;
}

export const site: SiteConfig = {
  name: "Niagara Equipment Supply",
  legalName: "Niagara Equipment Supply",
  tagline: "Official RIPPA Dealer",
  description:
    "Niagara Equipment Supply is the RIPPA dealer in Thorold, Ontario: mini excavators, skid steers, loaders, track dumpers and attachments, delivered Ontario-wide.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://niagaraequipment.com",
  phone: "289-271-6947", // dealer line, call or text
  phoneHref: "tel:+12892716947",
  email: "niagaraequipmentsupply@gmail.com",
  address: { street: "16-2275 Hwy 20", city: "Thorold", region: "ON", postal: "L3B 5N5", country: "CA" },
  serviceArea: "Serving all of Ontario",
  // Showroom hours; outside these by appointment, phones monitored after hours. The CMS Site Settings rows override these.
  hours: [
    { day: "Monday", time: "Closed" },
    { day: "Tuesday", time: "Closed" },
    { day: "Wednesday", time: "8:30 AM – 4:30 PM" },
    { day: "Thursday", time: "8:30 AM – 4:30 PM" },
    { day: "Friday", time: "8:30 AM – 6:30 PM" },
    { day: "Saturday", time: "8:30 AM – 3:30 PM" },
    { day: "Sunday", time: "Closed" },
  ],
  social: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
    linkedin: "#",
  },
  announcement: {
    left: "Official RIPPA Dealer | Equipment Available Across Ontario",
    right: "Reliable Equipment. Stronger Communities.",
  },
  /** Tax treatment for builder estimates. Set rate to undefined to hide the tax line. */
  tax: { label: "Estimated HST (13%)", rate: 0.13 },
  currency: "CAD",
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Inventory" },
  { href: "/attachments", label: "Attachments" },
  { href: "/financing", label: "Financing" },
  { href: "/service", label: "Service Centre" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
