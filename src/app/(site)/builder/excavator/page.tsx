import type { Metadata } from "next";
import { Suspense } from "react";
import { ShieldCheck, Users, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { IconFeature } from "@/components/ui/IconFeature";
import { ExcavatorBuilder } from "@/components/builder/ExcavatorBuilder";
import { PlaceholderArt } from "@/components/ui/PlaceholderArt";

export const metadata: Metadata = {
  title: "Excavator Builder | Configure Your RIPPA Mini Excavator",
  description: "Choose your RIPPA excavator model, add compatible attachments, protection packages and warranty, then request your build from Niagara Equipment Supply.",
  alternates: { canonical: "/builder/excavator" },
};

export default function BuilderPage() {
  return (
    <>
      <section className="border-b border-line bg-gradient-to-r from-white via-white to-light/70">
        <Container className="grid items-center gap-6 py-8 lg:grid-cols-[3fr_2fr]">
          <div>
            <Breadcrumbs items={[{ label: "Build Your Machine" }]} className="mb-3" />
            <h1 className="display text-charcoal">Excavator <span className="text-navy">Builder</span></h1>
            <p className="mt-2 max-w-xl text-[16px] text-charcoal/85">Choose your model, add attachments, and build the right machine for your work.</p>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <li><IconFeature icon={ShieldCheck} title="Quality Equipment" text="Built to perform" compact /></li>
              <li><IconFeature icon={Users} title="Expert Support" text="Before & after you buy" compact /></li>
              <li><IconFeature icon={Truck} title="Ontario Wide" text="Delivery available" compact /></li>
            </ul>
          </div>
          <div className="relative hidden aspect-[16/8] overflow-hidden rounded-card bg-light lg:block">
            <PlaceholderArt kind="excavators" label="RIPPA excavator" />
            <p aria-hidden className="display absolute right-5 top-4 text-right text-3xl leading-[0.95] text-navy/20">Work<br />Builds<br />More</p>
          </div>
        </Container>
      </section>
      <Suspense>
        <ExcavatorBuilder />
      </Suspense>
    </>
  );
}
