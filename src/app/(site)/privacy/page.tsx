import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { getSiteContent } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Niagara Equipment Supply collects, uses and protects the personal information you share through our website, quote forms and service requests.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "September 30, 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="display text-2xl text-charcoal">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-charcoal/85 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">{children}</div>
    </section>
  );
}

export default async function PrivacyPage() {
  const { site } = await getSiteContent();
  const address = [site.address.street, site.address.city, site.address.region, site.address.postal].filter(Boolean).join(", ");
  return (
    <>
      <PageHero title={<>Privacy <span className="text-navy">Policy</span></>} text={`How ${site.legalName} handles your personal information. Last updated ${UPDATED}.`} crumbs={[{ label: "Privacy Policy" }]} />
      <Container className="max-w-3xl py-10">
        <p className="text-[15px] leading-relaxed text-charcoal/85">
          {site.legalName} (“we”, “us”) operates {site.url.replace(/^https?:\/\//, "")}. We collect only the information we need to answer your request, sell and service equipment, and run this website, and we handle it in line with Canada&apos;s Personal Information Protection and Electronic Documents Act (PIPEDA) and Canada&apos;s Anti-Spam Legislation (CASL).
        </p>

        <Section title="What we collect">
          <p><strong>Information you give us.</strong> When you request a quote, book service, ask about financing or parts, or contact us, we collect what you enter: your name, company, email address, phone number, city or job-site location, your message, and the machines, attachments, parts or builds you selected.</p>
          <p><strong>Information collected automatically.</strong> Like most websites we use Google Analytics 4, which sets cookies and records pages viewed, approximate location, device and browser type, and how you interact with the site. Google processes this data on our behalf; IP addresses are not stored by Google Analytics 4. Our customer relationship system (GoHighLevel) also sets a visitor cookie so that, if you send us a request, we can see which pages you looked at beforehand and follow up properly. When you arrive from an ad, a search result or a link on another site, your browser keeps a note of that source so we know which campaign brought you to us when you send a request. If live chat is turned on, the chat widget keeps a cookie so your conversation continues between pages. You can decline both at any time using the notice at the bottom of the site or by installing Google&apos;s opt-out browser add-on.</p>
          <p><strong>Saved builds and quote lists.</strong> The Excavator Builder, Skid Steer Builder and quote list store your selections in your own browser (local storage). They are not sent to us until you submit a request.</p>
        </Section>

        <Section title="How we use it">
          <ul>
            <li>To respond to your request and prepare written quotes, service bookings, financing referrals and parts orders.</li>
            <li>To deliver, set up, service and support equipment you buy from us, including warranty claims with the manufacturer.</li>
            <li>To send you commercial electronic messages such as promotions, new-model news and service reminders, <strong>only if you have given express consent</strong> (for example by ticking the box on a form). You can withdraw consent at any time using the unsubscribe link in any message or by contacting us.</li>
            <li>To understand how the website is used and improve it.</li>
            <li>To meet legal, tax and warranty record-keeping obligations.</li>
          </ul>
        </Section>

        <Section title="Who we share it with">
          <p>We do not sell personal information. We share it only with service providers who help us run the business, under contracts that limit what they can do with it:</p>
          <ul>
            <li><strong>Customer relationship management</strong> (GoHighLevel) to store leads, quotes and follow-ups.</li>
            <li><strong>Email delivery</strong> providers used to send confirmations and, with your consent, newsletters.</li>
            <li><strong>Hosting and security</strong> providers (Railway and Cloudflare) that run and protect this website.</li>
            <li><strong>Google Analytics</strong> for anonymous usage statistics.</li>
            <li><strong>RIPPA and parts suppliers</strong> when needed to register a machine, process a warranty claim or order parts.</li>
            <li><strong>Financing partners</strong>, only when you ask us to refer you for financing or leasing.</li>
          </ul>
          <p>Some of these providers store data outside Canada (for example in the United States). Where they do, your information may be subject to the laws of that country.</p>
        </Section>

        <Section title="How long we keep it">
          <p>We keep quote and contact requests for as long as needed to follow up and for a reasonable period afterwards. Records tied to a sale, warranty or service history are kept for the life of the equipment relationship and as long as tax and legal rules require. Analytics data is retained by Google Analytics for 14 months.</p>
        </Section>

        <Section title="Your choices and rights">
          <ul>
            <li>Ask us what personal information we hold about you, and ask us to correct it.</li>
            <li>Withdraw consent to marketing messages at any time.</li>
            <li>Ask us to delete your information where we no longer need it for a sale, warranty or legal reason.</li>
            <li>Decline analytics cookies using the site notice or your browser settings.</li>
          </ul>
          <p>To do any of these, email <a href={`mailto:${site.email}`} className="font-semibold text-navy">{site.email}</a> or write to us at {address}. If you are not satisfied with our response you may contact the Office of the Privacy Commissioner of Canada.</p>
        </Section>

        <Section title="Security">
          <p>The website is served over HTTPS, protected by Cloudflare, and form submissions are stored in access-controlled systems. No method of transmission or storage is completely secure, so please do not send us payment card numbers or government identification through the website; we will arrange a secure way to collect anything of that kind when a purchase needs it.</p>
        </Section>

        <Section title="Children">
          <p>This website is for businesses and adults. We do not knowingly collect information from anyone under 18.</p>
        </Section>

        <Section title="Changes to this policy">
          <p>We will post any changes on this page and update the date at the top. Significant changes will be noted on the home page for a period after they take effect.</p>
        </Section>

        <Section title="Contact">
          <p>{site.legalName}<br />{address}<br /><a href={`mailto:${site.email}`} className="font-semibold text-navy">{site.email}</a> · <a href={site.phoneHref} className="font-semibold text-navy">{site.phone}</a></p>
          <p className="text-[13px] text-grey">See also our <Link href="/terms" className="font-semibold text-navy">Terms of Use</Link> and <Link href="/accessibility" className="font-semibold text-navy">Accessibility Statement</Link>.</p>
        </Section>
      </Container>
    </>
  );
}
