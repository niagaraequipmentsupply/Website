import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { Facebook, Instagram, Youtube, Linkedin } from "./SocialIcons";
import type { SiteContent } from "@/lib/catalogue";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";

const quick = [
  [{ href: "/", label: "Home" }, { href: "/inventory", label: "Equipment" }, { href: "/attachments", label: "Attachments" }, { href: "/financing", label: "Financing" }],
  [{ href: "/service", label: "Service" }, { href: "/service/parts", label: "RIPPA Parts" }, { href: "/lubricants", label: "Oil & Lubricants" }, { href: "/blog", label: "Blog" }, { href: "/about", label: "About" }, { href: "/contact", label: "Contact" }],
];

export function Footer({ site }: { site: SiteContent["site"] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto">
      <div className="border-t border-line bg-white">
        <Container className="grid gap-10 py-12 md:grid-cols-[1.2fr_1fr_1fr_0.8fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-grey">{site.tagline}. {site.serviceArea}.</p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold text-charcoal">Quick Links</h3>
            <div className="grid grid-cols-2 gap-x-6">
              {quick.map((col, i) => (
                <ul key={i} className="space-y-2 text-sm text-grey">
                  {col.map((l) => <li key={l.href}><Link href={l.href} className="hover:text-navy">{l.label}</Link></li>)}
                </ul>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold text-charcoal">Contact Us</h3>
            <ul className="space-y-2.5 text-sm text-grey">
              <li><a href={site.phoneHref} className="flex items-center gap-2 hover:text-navy"><Phone className="size-4 text-navy" aria-hidden />{site.phone}</a></li>
              <li><a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-navy"><Mail className="size-4 text-navy" aria-hidden />{site.email}</a></li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden /><span>{site.address.city}, {site.address.region}<br /><span className="text-xs">{site.serviceArea}</span></span></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold text-charcoal">Follow Us</h3>
            <ul className="flex gap-2">
              {[
                { href: site.social.facebook, label: "Facebook", Icon: Facebook },
                { href: site.social.instagram, label: "Instagram", Icon: Instagram },
                { href: site.social.youtube, label: "YouTube", Icon: Youtube },
                { href: site.social.linkedin, label: "LinkedIn", Icon: Linkedin },
              ].map(({ href, label, Icon }) => (
                <li key={label}>
                  <a href={href} aria-label={label} className="flex size-10 items-center justify-center rounded-md bg-navy text-white transition-colors hover:bg-electric"><Icon className="size-4" aria-hidden /></a>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
      <div className="bg-navy text-white">
        <Container className="flex flex-col items-center justify-between gap-2 py-4 text-[12px] sm:flex-row">
          <p>© {year} {site.legalName}. All rights reserved.</p>
          <p className="uppercase tracking-[0.15em] text-white/80">Official RIPPA Dealer &nbsp;|&nbsp; Equipment for a stronger tomorrow.</p>
        </Container>
      </div>
    </footer>
  );
}
