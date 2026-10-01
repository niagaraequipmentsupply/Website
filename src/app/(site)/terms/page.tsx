import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { getSiteContent } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the Niagara Equipment Supply website, including how quotes, pricing, specifications, builder estimates and financing information should be read.",
  alternates: { canonical: "/terms" },
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

export default async function TermsPage() {
  const { site } = await getSiteContent();
  return (
    <>
      <PageHero title={<>Terms of <span className="text-navy">Use</span></>} text={`The ground rules for using this website and the quotes, estimates and information on it. Last updated ${UPDATED}.`} crumbs={[{ label: "Terms of Use" }]} />
      <Container className="max-w-3xl py-10">
        <p className="text-[15px] leading-relaxed text-charcoal/85">By using this website you agree to these terms. They apply to the website only; equipment purchases, service work and financing are governed by the written quote, invoice, work order or financing agreement you sign, which take priority over anything here.</p>

        <Section title="Product information and specifications">
          <p>Specifications, dimensions, weights, capacities and images come from RIPPA&apos;s published materials and are converted to the units shown on this site. They describe the model range in general and may differ from a specific unit by configuration, options, production changes or regional requirements. Photographs and renders may show optional equipment, attachments or markets other than Canada. Always confirm the exact specification of the unit you are buying on your written quote.</p>
        </Section>

        <Section title="Quotes, pricing and availability">
          <ul>
            <li>Submitting a quote request, quote list or builder package is a request for information, not an order. Nothing is reserved or sold until you receive and accept a written quote from us.</li>
            <li>Any prices shown on the website, including builder estimates, are in Canadian dollars, exclude taxes, delivery, registration and set-up unless stated, and may change without notice. Written quotes state their own validity period.</li>
            <li>Availability changes daily. “In stock” and lead-time information on the site is indicative; your written quote confirms it.</li>
            <li>Financing examples and monthly estimates are illustrations only. Actual terms are set by the financing partner, on approved credit, and are confirmed in the financing agreement.</li>
          </ul>
        </Section>

        <Section title="Attachment fitment and compatibility">
          <p>Compatibility lists, mounting plate standards and hydraulic requirements on this site are based on manufacturer data and our experience. Fitment on a specific machine, especially one not purchased from us, must be confirmed with us before purchase. We confirm fitment in writing on every quote that includes attachments.</p>
        </Section>

        <Section title="Warranty and service">
          <p>New RIPPA equipment is covered by RIPPA&apos;s manufacturer warranty, and the RIPPA Service Centre at Niagara Equipment Supply administers claims on eligible units. Warranty terms, exclusions and claim procedures are set out in the warranty documents supplied with the machine, which govern over any summary on this website.</p>
        </Section>

        <Section title="Your use of the site">
          <ul>
            <li>You may browse, print and share pages for personal or business use in connection with buying or servicing equipment.</li>
            <li>You may not scrape, copy or republish the catalogue, images or text for commercial purposes without written permission, and you may not interfere with the site, its forms or its security.</li>
            <li>Forms must be submitted with accurate information. We may decline or remove requests that are abusive, fraudulent or automated.</li>
          </ul>
        </Section>

        <Section title="Intellectual property">
          <p>RIPPA names, logos and product images are trademarks and copyrighted works of their respective owners and are used by {site.legalName} as an authorized dealer. Site design, text and original photography are owned by {site.legalName}. Nothing on the site grants you a licence to use any of them except as allowed above.</p>
        </Section>

        <Section title="Third-party links">
          <p>Links to manufacturer, financing partner and other third-party websites are provided for convenience. We do not control those sites and are not responsible for their content or privacy practices.</p>
        </Section>

        <Section title="Disclaimer and limitation of liability">
          <p>The website and its content are provided “as is”. To the fullest extent permitted by Ontario law, {site.legalName} is not liable for losses arising from reliance on website content, including specifications, pricing estimates, availability or compatibility information, or from interruptions to the website. Nothing in these terms limits rights you have under the Consumer Protection Act, 2002 (Ontario) or other laws that cannot be excluded.</p>
        </Section>

        <Section title="Governing law">
          <p>These terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable in Ontario. Any dispute about the website will be heard in the courts of Ontario.</p>
        </Section>

        <Section title="Changes and contact">
          <p>We may update these terms by posting a new version here with a new date. Questions: <a href={`mailto:${site.email}`} className="font-semibold text-navy">{site.email}</a> or <a href={site.phoneHref} className="font-semibold text-navy">{site.phone}</a>.</p>
          <p className="text-[13px] text-grey">See also our <Link href="/privacy" className="font-semibold text-navy">Privacy Policy</Link> and <Link href="/accessibility" className="font-semibold text-navy">Accessibility Statement</Link>.</p>
        </Section>
      </Container>
    </>
  );
}
