import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { LeadForm } from "@/components/quote/LeadForm";
import { CalendarEmbed } from "@/components/ghl/CalendarEmbed";
import { getSiteContent } from "@/lib/catalogue";
import { site as siteDefaults } from "@/data/site";

export const metadata: Metadata = pageMeta({
  titles: ["Contact Us in Thorold, Ontario"],
  description: `Call or text ${siteDefaults.phone}, email, or visit us at 16-2275 Hwy 20, ${siteDefaults.address.city}, Ontario for RIPPA sales, parts, the RIPPA Service Centre and written quotes.`,
  path: "/contact",
});

export default async function ContactPage() {
  const { site } = await getSiteContent();
  return (
    <>
      <PageHero title="Contact Us" text="Sales, parts, service or a quote. Call or text us, send an email, or use the form below." crumbs={[{ label: "Contact" }]} />
      <section className="section">
        <Container className="grid gap-10 lg:grid-cols-[2fr_3fr]">
          <div className="space-y-4">
            <div className="rounded-card border border-line p-5">
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3"><Phone className="mt-0.5 size-5 shrink-0 text-navy" aria-hidden /><div><p className="font-bold text-charcoal">Call or text</p><a href={site.phoneHref} className="text-navy hover:text-electric">{site.phone}</a><p className="mt-0.5 text-grey">Calls and texts both welcome. Text a photo of the machine, part or problem and we reply during business hours.</p><a href={site.phoneHref.replace(/^tel:/, "sms:")} className="mt-1 inline-block font-semibold text-navy hover:text-electric">Text us</a></div></li>
                <li className="flex gap-3"><Mail className="mt-0.5 size-5 shrink-0 text-navy" aria-hidden /><div><p className="font-bold text-charcoal">Email</p><a href={`mailto:${site.email}`} className="text-navy hover:text-electric">{site.email}</a></div></li>
                <li className="flex gap-3"><MapPin className="mt-0.5 size-5 shrink-0 text-navy" aria-hidden /><div><p className="font-bold text-charcoal">Location</p><p className="text-grey">{site.address.street && <>{site.address.street}<br /></>}{site.address.city}, {site.address.region}{site.address.postal ? ` ${site.address.postal}` : ""}</p><p className="text-grey">{site.serviceArea}</p></div></li>
                <li id="hours" className="flex scroll-mt-28 gap-3"><Clock className="mt-0.5 size-5 shrink-0 text-navy" aria-hidden /><div><p className="font-bold text-charcoal">Showroom hours</p><ul className="text-grey">{site.hoursList.map((h) => <li key={h.day}>{h.day}: {h.time}</li>)}</ul><p className="mt-2 text-grey">Outside these hours we are available by appointment, and our team monitors the phone after hours, so call or text whenever suits you.</p></div></li>
              </ul>
            </div>
            {site.mapEmbedUrl && (
              <div className="aspect-[4/3] overflow-hidden rounded-card border border-line bg-light">
                <iframe src={site.mapEmbedUrl} title={`Map to ${site.name}`} className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              </div>
            )}
          </div>
          <div className="grid gap-6">
            <LeadForm source="contact" title="Send a Message" submitLabel="Send Message" messageLabel="How can we help?" />
            {process.env.NEXT_PUBLIC_GHL_DEMO_CALENDAR_URL && (
              <div id="demo" className="scroll-mt-28">
                <h2 className="display mb-2 text-2xl text-charcoal">Book a demo or site visit</h2>
                <p className="mb-3 text-sm text-grey">Pick a time and we bring the machine to you or set it up here in {site.address.city}.</p>
                <CalendarEmbed src={process.env.NEXT_PUBLIC_GHL_DEMO_CALENDAR_URL} title="Book a demo or site visit" />
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
