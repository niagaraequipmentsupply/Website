import { DollarSign, Settings, Cog, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Link from "next/link";
import { LogoMark } from "@/components/layout/Logo";

interface Benefit { icon?: LucideIcon; mark?: boolean; title: string; text: string; href: string }

const benefits: Benefit[] = [
  { icon: DollarSign, title: "Financing & Leasing", text: "Loans and lease-to-own on approved credit, with decisions in about a business day.", href: "/financing" },
  { icon: Settings, title: "RIPPA Service Centre", text: "Warranty claims filed for you, repairs in our shop or on site, owner training.", href: "/service" },
  { icon: Cog, title: "Genuine Parts", text: "RIPPA and Kubota parts by serial number, shipped across Canada.", href: "/parts" },
  { mark: true, title: "Official RIPPA Dealer", text: "Factory-backed warranty, dealer setup and inspection on every machine.", href: "/about" },
  { icon: Truck, title: "Ontario-Wide Delivery", text: "Flatbed delivery from Thorold to your yard or job site anywhere in Ontario.", href: "/service-area" },
];

export function WhyChoose() {
  return (
    <section className="section-tight bg-light/60">
      <Container>
        <SectionHeading
          title="Why Choose Niagara Equipment Supply"
          rule={false}
          link={undefined}
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {benefits.map((b) => (
            <li key={b.title}>
              <Link href={b.href} className="flex h-full flex-col rounded-card border border-line bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-electric hover:shadow-lift">
                {b.mark ? (
                  <LogoMark className="size-11" />
                ) : b.icon ? (
                  <span className="flex size-11 items-center justify-center text-navy"><b.icon className="size-9" strokeWidth={1.6} aria-hidden /></span>
                ) : null}
                <h3 className="mt-4 text-base font-bold text-charcoal">{b.title}</h3>
                <p className="mt-1 text-sm text-grey">{b.text}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
