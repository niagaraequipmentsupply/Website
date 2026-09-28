import { ShieldCheck, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconFeature } from "@/components/ui/IconFeature";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#070d1a] text-white">
      <div aria-hidden className="absolute inset-0 bg-[url('/images/bg/hero-shards.jpg')] bg-cover bg-[position:75%_50%]" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#070d1a] via-[#070d1a]/85 to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-electric via-navy to-transparent" />
      <Container className="relative py-14 lg:min-h-[600px] lg:py-24">
        <div className="max-w-2xl">
          <p className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-electric sm:text-[12px] sm:tracking-[0.3em]"><span className="h-px w-8 shrink-0 bg-electric" aria-hidden /><span>Official RIPPA Dealer · Thorold, Ontario</span></p>
          <h1 className="display text-white">
            Compact Equipment<br />
            <span className="text-electric">Built for Real Work</span>
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/80">
            RIPPA mini excavators, skid steers, loaders and track dumpers, backed by the RIPPA Service Centre, genuine parts across Canada and delivery anywhere in Ontario.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/inventory" size="lg" arrow className="bg-electric hover:bg-white hover:text-navy">Shop Equipment</Button>
            <Button href="/builder/excavator" size="lg" arrow className="border-2 border-white/70 bg-transparent text-white hover:border-white hover:bg-white hover:text-navy">Build Your Machine</Button>
          </div>
          <ul className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-4">
            <li><IconFeature icon={ShieldCheck} title="RIPPA Service Centre" text="Warranty handled for you" compact dark /></li>
            <li><IconFeature icon={Users} title="Expert Support" text="Before & after you buy" compact dark /></li>
            <li><IconFeature icon={MapPin} title="Ontario Wide" text="Delivery available" compact dark /></li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
