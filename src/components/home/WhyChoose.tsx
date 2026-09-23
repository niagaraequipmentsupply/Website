import { DollarSign, Settings, Cog, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Link from "next/link";
import { LogoMark } from "@/components/layout/Logo";

interface Benefit { icon?: LucideIcon; mark?: boolean; title: string; text: string; href: string }

const benefits: Benefit[] = [
  { icon: DollarSign, title: "Financing Available", text: "Flexible solutions to get you working.", href: "/financing" },
  { icon: Settings, title: "RIPPA Service Centre", text: "Warranty, repairs and training. You run it, we back it.", href: "/service" },
  { icon: Cog, title: "Parts", text: "Genuine parts, ready when you need them.", href: "/service/parts" },
  { mark: true, title: "Official RIPPA Dealer", text: "Trusted. Proven. Authorized.", href: "/about" },
  { icon: Truck, title: "Ontario Delivery", text: "Equipment where you need it.", href: "/contact" },
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
