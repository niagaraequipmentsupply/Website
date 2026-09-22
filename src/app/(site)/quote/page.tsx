import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { QuoteList } from "@/components/quote/QuoteList";
import { LeadForm } from "@/components/quote/LeadForm";
import { getSiteContent } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Get a Quote",
  description: "Request a quote on RIPPA equipment, attachments or a configured excavator build from Niagara Equipment Supply.",
  alternates: { canonical: "/quote" },
};

export default async function QuotePage() {
  const { site } = await getSiteContent();
  return (
    <>
      <PageHero title="Get a Quote" text="Review your quote list and send us your details. We reply with pricing, availability and financing options." crumbs={[{ label: "Get a Quote" }]}>
        <Button href={site.phoneHref} variant="secondary" icon={<Phone className="size-4" aria-hidden />}>Prefer to talk? {site.phone}</Button>
      </PageHero>
      <section className="section">
        <Container className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="display mb-4 text-2xl text-charcoal">Your Quote List</h2>
            <QuoteList />
          </div>
          <LeadForm source="quote" title="Your Details" includeItems />
        </Container>
      </section>
    </>
  );
}
