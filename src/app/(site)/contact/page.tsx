import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { LeadForm } from "@/components/quote/LeadForm";
import { getSiteContent } from "@/lib/catalogue";
import { site as siteDefaults } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact Niagara Equipment Supply in ${siteDefaults.address.city}, Ontario for RIPPA equipment sales, parts, service and quotes.`,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const { site } = await getSiteContent();
  return (
    <>
      <PageHero title="Contact Us" text="Sales, parts, service or a quote. Reach us by phone, email or the form below." crumbs={[{ label: "Contact" }]} />
      <section className="section">
        <Container className="grid gap-10 lg:grid-cols-[2fr_3fr]">
          <div className="space-y-4">
            <div className="rounded-card border border-line p-5">
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3"><Phone className="mt-0.5 size-5 shrink-0 text-navy" aria-hidden /><div><p className="font-bold text-charcoal">Phone</p><a href={site.phoneHref} className="text-navy hover:text-electric">{site.phone}</a></div></li>
                <li className="flex gap-3"><Mail className="mt-0.5 size-5 shrink-0 text-navy" aria-hidden /><div><p className="font-bold text-charcoal">Email</p><a href={`mailto:${site.email}`} className="text-navy hover:text-electric">{site.email}</a></div></li>
                <li className="flex gap-3"><MapPin className="mt-0.5 size-5 shrink-0 text-navy" aria-hidden /><div><p className="font-bold text-charcoal">Location</p><p className="text-grey">{site.address.street && <>{site.address.street}<br /></>}{site.address.city}, {site.address.region}{site.address.postal ? ` ${site.address.postal}` : ""}</p><p className="text-grey">{site.serviceArea}</p></div></li>
                <li id="hours" className="flex scroll-mt-28 gap-3"><Clock className="mt-0.5 size-5 shrink-0 text-navy" aria-hidden /><div><p className="font-bold text-charcoal">Hours</p><ul className="text-grey">{site.hoursList.map((h) => <li key={h.day}>{h.day}: {h.time}</li>)}</ul></div></li>
              </ul>
            </div>
            {site.mapEmbedUrl && (
              <div className="aspect-[4/3] overflow-hidden rounded-card border border-line bg-light">
                <iframe src={site.mapEmbedUrl} title={`Map to ${site.name}`} className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              </div>
            )}
          </div>
          <LeadForm source="contact" title="Send a Message" submitLabel="Send Message" messageLabel="How can we help?" />
        </Container>
      </section>
    </>
  );
}
