import Link from "next/link";
import { Quote, Star, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Testimonial } from "@/lib/types";

interface Props {
  items: Testimonial[];
  title?: string;
  subtitle?: string;
  /** Model name lookup for the "on their R18 PRO" line. */
  machineNames?: Map<string, string>;
  className?: string;
}

/** Customer quotes. Renders nothing until there is at least one published testimonial. */
export function Testimonials({ items, title = "What RIPPA owners say", subtitle = "Real customers, in their own words.", machineNames, className = "" }: Props) {
  if (items.length === 0) return null;
  return (
    <section className={`section-tight bg-light/60 ${className}`} aria-labelledby="testimonials-title">
      <Container>
        <SectionHeading title={<span id="testimonials-title">{title}</span>} subtitle={subtitle} rule={false} />
        <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((t) => {
            const machine = t.machineId ? machineNames?.get(t.machineId) : undefined;
            return (
              <li key={t.id} className="relative flex flex-col rounded-card border border-line bg-white p-5">
                <Quote className="absolute right-4 top-4 size-6 text-tint" aria-hidden />
                {t.rating ? (
                  <p className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, i) => <Star key={i} className={`size-4 ${i < t.rating! ? "fill-electric text-electric" : "text-line"}`} aria-hidden />)}
                  </p>
                ) : null}
                <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-charcoal/90">“{t.quote}”</blockquote>
                <footer className="mt-4 border-t border-line pt-3 text-[13px]">
                  <p className="font-bold text-charcoal">{t.name}{t.company ? `, ${t.company}` : ""}</p>
                  <p className="text-grey">{[t.location, machine ? `RIPPA ${machine} owner` : undefined].filter(Boolean).join(" · ")}</p>
                </footer>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 text-sm text-grey">Own a RIPPA from us? <Link href="/contact" className="inline-flex items-center gap-1 font-semibold text-navy hover:text-electric">Tell us how it is working out <ArrowRight className="size-3.5" aria-hidden /></Link></p>
      </Container>
    </section>
  );
}
