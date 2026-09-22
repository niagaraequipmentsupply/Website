import { ShieldCheck, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconFeature } from "@/components/ui/IconFeature";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-gradient-to-r from-white via-white to-light/70">
      <Container className="grid items-center gap-10 py-12 lg:grid-cols-[45fr_55fr] lg:gap-8 lg:py-0">
        <div className="lg:py-20">
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.3em] text-navy">Official RIPPA Dealer</p>
          <h1 className="display text-charcoal">
            Compact Equipment<br />
            <span className="text-navy">Built for Real Work</span>
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-charcoal/85">
            Niagara Equipment Supply is your trusted RIPPA dealer for Excavators, Skid Steers, Track Dumpers, Backhoes, and Loaders across Ontario.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/inventory" size="lg" arrow>Shop Inventory</Button>
            <Button href="/attachments" size="lg" variant="secondary" arrow>Browse Attachments</Button>
          </div>
          <ul className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-4">
            <li><IconFeature icon={ShieldCheck} title="Quality Equipment" text="Built to perform" compact /></li>
            <li><IconFeature icon={Users} title="Expert Support" text="Before & after you buy" compact /></li>
            <li><IconFeature icon={MapPin} title="Ontario Wide" text="Delivery available" compact /></li>
          </ul>
        </div>
        <div className="relative lg:min-h-[520px]">
          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}
