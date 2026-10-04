import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { getSiteContent } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "Niagara Equipment Supply's accessibility commitment under the AODA for our website and showroom, and how to request information in another format.",
  alternates: { canonical: "/accessibility" },
};

export default async function AccessibilityPage() {
  const { site } = await getSiteContent();
  return (
    <>
      <PageHero title={<>Accessibility <span className="text-navy">Statement</span></>} text="We want every customer to be able to research, buy and service equipment with us, online and in person." crumbs={[{ label: "Accessibility" }]} />
      <Container className="max-w-3xl py-10">
        <div className="space-y-4 text-[15px] leading-relaxed text-charcoal/85 [&_h2]:mt-8 [&_h2]:font-[family-name:var(--font-anton)] [&_h2]:text-2xl [&_h2]:uppercase [&_h2]:text-charcoal [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
          <p>{site.legalName} is committed to meeting the accessibility needs of people with disabilities in a timely way, in line with the Accessibility for Ontarians with Disabilities Act, 2005 (AODA) and the Ontario Human Rights Code.</p>

          <h2>This website</h2>
          <p>We build the site to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA as our target. Measures already in place include:</p>
          <ul>
            <li>Full keyboard navigation, including menus, the photo galleries, model comparison and the builders.</li>
            <li>Visible focus indicators and a skip-to-content link on every page.</li>
            <li>Descriptive alternative text on product photos and meaningful images.</li>
            <li>Colour contrast that meets AA ratios for text and controls, and information that never relies on colour alone.</li>
            <li>Forms with labelled fields, clear error messages and no time limits.</li>
            <li>Pages that work with screen readers and browser zoom up to 200 percent.</li>
          </ul>
          <p>Specification sheets from the manufacturer are supplied as PDF files. If a PDF is not accessible for you, tell us and we will provide the specifications in another format.</p>

          <h2>Our showroom and service centre</h2>
          <p>Our location on Highway 20 in Thorold has ground-level access and accessible parking close to the entrance. Service drop-off and pickup can be arranged at your vehicle, and we can bring a machine to you for a demonstration.</p>

          <h2>Information in other formats</h2>
          <p>On request we will provide quotes, specifications, warranty documents and service records in accessible formats or with communication supports, at no extra cost and in a timely manner. We will consult with you on what works best.</p>

          <h2>Feedback</h2>
          <p>If you have trouble using any part of the website or our services, please tell us so we can fix it: email <a href={`mailto:${site.email}`} className="font-semibold text-navy">{site.email}</a>, call <a href={site.phoneHref} className="font-semibold text-navy">{site.phone}</a>, or write to {[site.address.street, site.address.city, site.address.region, site.address.postal].filter(Boolean).join(", ")}. We aim to respond within five business days.</p>
        </div>
      </Container>
    </>
  );
}
