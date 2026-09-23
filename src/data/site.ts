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
    "Niagara Equipment Supply is your trusted RIPPA dealer for mini excavators, skid steers, loaders, track dumpers, backhoes and attachments across Ontario.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://niagaraequipment.ca",
  phone: "(905) 555-0123", // TODO: replace with real dealer phone
  phoneHref: "tel:+19055550123",
  email: "info@niagaraequip.com",
  address: { street: "16-2275 Hwy 20", city: "Thorold", region: "ON", postal: "L3B 5N5", country: "CA" },
  serviceArea: "Serving all of Ontario",
  hours: [
    { day: "Mon – Fri", time: "8:00 AM – 5:00 PM" },
    { day: "Saturday", time: "By appointment" },
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
  { href: "/service", label: "Service" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
