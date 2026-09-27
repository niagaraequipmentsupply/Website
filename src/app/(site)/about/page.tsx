import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { CtaBand } from "@/components/home/CtaBand";
import { getSiteContent } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "About Us",
  description: "Niagara Equipment Supply is an official RIPPA dealer serving contractors, landscapers, farms and municipalities across Ontario.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const { site } = await getSiteContent();
  return (
    <>
      <PageHero title="About Niagara Equipment Supply" text="Reliable equipment. Stronger communities." crumbs={[{ label: "About" }]} />
      <section className="section">
        <Container className="grid gap-10 lg:grid-cols-[3fr_2fr]">
          <div className="space-y-4 text-[16px] leading-relaxed text-charcoal/85">
            <p>{site.name} is an official RIPPA dealer based in {site.address.city}, Ontario. We supply compact excavators, skid steers, loaders, backhoe loaders, track dumpers and attachments to contractors, landscapers, farms and municipalities across the province.</p>
            <p>We keep things simple: honest pricing, machines that are set up properly before delivery, and support from people who know the equipment. Whether you are buying your first mini excavator or adding to a fleet, we help you spec the right machine for the work.</p>
          </div>
          <div className="rounded-card border border-line bg-light/60 p-6">
            <h2 className="display text-2xl text-charcoal">People · Projects · Progress</h2>
            <ul className="mt-4 space-y-3 text-sm text-charcoal">
              {["Official RIPPA dealer", "Parts and service support", "Financing on approved credit", "Ontario-wide delivery"].map((t) => <li key={t} className="flex items-center gap-2"><span className="size-2 rounded-full bg-navy" aria-hidden />{t}</li>)}
            </ul>
          </div>
        </Container>
      </section>
      <CtaBand title="Let's find the right machine" text="Call us or send a quote request. We'll help you build the right setup for your work." />
    </>
  );
}
