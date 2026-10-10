import type { Metadata } from "next";
import Link from "next/link";
import { Tractor, Wrench, Package, Handshake, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBand } from "@/components/home/CtaBand";
import { getSiteContent } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "About Us · RIPPA Dealer in Niagara",
  description: "Niagara Equipment Supply is the RIPPA dealer in Thorold, Ontario: mini excavators, skid steers, loaders and attachments, backed by the RIPPA Service Centre.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const { site, catalogue } = await getSiteContent();
  const modelCount = catalogue.machines.filter((m) => m.specs.length > 0).length;
  const what = [
    { icon: Tractor, title: "Equipment sales", text: `${modelCount} RIPPA models from the 747 kg R06 ECO to full-size excavators, plus skid steers, loaders and track dumpers. Every quote is written, itemised and includes delivery.`, href: "/inventory", label: "Browse equipment" },
    { icon: Wrench, title: "RIPPA Service Centre", text: "Pre-delivery inspection, scheduled maintenance, repairs and warranty claims handled in our shop or on site. Any RIPPA owner is welcome, wherever the machine was bought.", href: "/service", label: "Service Centre" },
    { icon: Package, title: "Genuine parts & lubricants", text: "RIPPA parts by model and system, Kubota engine parts, and Chevron and Catalys oils, shipped across Canada.", href: "/parts", label: "Parts catalogue" },
    { icon: Handshake, title: "Financing & leasing", text: "Loans and lease-to-own on approved credit, with the machine, attachments and delivery on one agreement.", href: "/financing", label: "Financing options" },
  ];

  return (
    <>
      <PageHero title="About Niagara Equipment Supply" text="Reliable equipment. Stronger communities." crumbs={[{ label: "About" }]} />
      <section className="section">
        <Container className="grid gap-10 lg:grid-cols-[3fr_2fr]">
          <div className="space-y-4 text-[16px] leading-relaxed text-charcoal/85">
            <p>{site.name} is an official RIPPA dealer at {site.address.street}, {site.address.city}, Ontario. We supply compact excavators, skid steers, loaders, backhoe loaders, track dumpers and attachments to contractors, landscapers, farms and municipalities across the province, and we deliver anywhere in Ontario from our Niagara location.</p>
            <p>We keep things simple: written quotes with no hidden fees, machines that are inspected and set up before delivery, and support from people who know the equipment. Whether you are buying your first mini excavator or adding to a fleet, we help you spec the right machine, the right attachments and the right service plan for the work.</p>
            <p>Every RIPPA we sell is backed by the RIPPA Service Centre in {site.address.city}: warranty claims filed and repaired here, genuine parts in stock, and the guides and videos we publish from the shop floor so you can look after the machine yourself if you prefer.</p>
          </div>
          <div className="rounded-card border border-line bg-light/60 p-6">
            <h2 className="display text-2xl text-charcoal">People · Projects · Progress</h2>
            <ul className="mt-4 space-y-3 text-sm text-charcoal">
              {["Official RIPPA dealer", "RIPPA Service Centre: warranty, repairs, maintenance", "Genuine RIPPA and Kubota parts", "Financing and leasing on approved credit", "Delivery anywhere in Ontario"].map((t) => <li key={t} className="flex items-center gap-2"><span className="size-2 rounded-full bg-navy" aria-hidden />{t}</li>)}
            </ul>
            <p className="mt-5 text-sm text-grey">Visit us at {site.address.street}, {site.address.city} · <Link href="/contact#hours" className="font-semibold text-navy hover:text-electric">Hours and directions</Link></p>
          </div>
        </Container>
      </section>

      <section className="section-tight bg-light/60">
        <Container>
          <SectionHeading title="What we do" subtitle="Four things, done properly, for RIPPA owners across Ontario." rule={false} />
          <ul className="grid gap-4 md:grid-cols-2">
            {what.map((w) => (
              <li key={w.title} className="flex gap-4 rounded-card border border-line bg-white p-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-tint text-navy"><w.icon className="size-5" aria-hidden /></span>
                <div>
                  <h3 className="text-lg font-bold text-charcoal">{w.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-grey">{w.text}</p>
                  <Link href={w.href} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-electric">{w.label}<ArrowRight className="size-4" aria-hidden /></Link>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>


      <CtaBand title="Let's find the right machine" text="Call us or send a quote request. We'll help you build the right setup for your work." />
    </>
  );
}
