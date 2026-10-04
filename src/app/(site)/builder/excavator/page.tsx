import type { Metadata } from "next";
import { Suspense } from "react";
import { preload } from "react-dom";
import { ShieldCheck, Users, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { IconFeature } from "@/components/ui/IconFeature";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { MachineBuilder } from "@/components/builder/MachineBuilder";
import { getSiteContent } from "@/lib/catalogue";
import { BUILDERS } from "@/lib/builders";

const builder = BUILDERS["excavator"];

export const metadata: Metadata = {
  title: "RIPPA Excavator Builder",
  description: "Pick a RIPPA excavator, choose engine and cab, add the attachments that fit, then send the build for a written quote from Niagara Equipment Supply.",
  alternates: { canonical: builder.href },
};

export default async function BuilderPage() {
  preload("/images/bg/light-grid.svg", { as: "image" });
  const { categories } = await getSiteContent();
  const cat = categories.find((c) => c.slug === builder.category);
  const other = builder.kind === "excavator" ? BUILDERS["skid-steer"] : BUILDERS.excavator;
  return (
    <>
      <section className="relative border-b border-line bg-light/60">
        <div aria-hidden className="absolute inset-0 bg-[url('/images/bg/light-grid.svg')] bg-cover bg-right opacity-40" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        <Container className="relative grid items-center gap-6 py-8 lg:grid-cols-[3fr_2fr]">
          <div>
            <Breadcrumbs items={[{ href: "/inventory", label: "Equipment" }, { label: `${builder.label} Builder` }]} className="mb-3" />
            <h1 className="display text-charcoal">{builder.label} <span className="text-navy">Builder</span></h1>
            <p className="mt-2 max-w-xl text-[16px] text-charcoal/85">Choose your model and configuration, add the attachments RIPPA lists for it, pick protection and warranty, then send the build for a written quote. Building {other.kind === "excavator" ? "an" : "a"} {other.noun} instead? <a href={other.href} className="font-semibold text-navy hover:text-electric">{other.label} Builder</a>.</p>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <li><IconFeature icon={ShieldCheck} title="Fitment confirmed" text="Only attachments listed for your model" compact /></li>
              <li><IconFeature icon={Users} title="Expert Support" text="Before & after you buy" compact /></li>
              <li><IconFeature icon={Truck} title="Ontario Wide" text="Delivery available" compact /></li>
            </ul>
          </div>
          <div className="hidden lg:block"><EquipmentImage image={cat?.image} kind={builder.category} alt={cat?.name ?? builder.label} ratio="aspect-[16/9]" className="bg-white" /></div>
        </Container>
      </section>
      {/* Reserve the builder's height while it streams in so the footer does not jump (CLS). */}
      <Suspense fallback={<div className="min-h-[90vh]" aria-hidden />}>
        <MachineBuilder builder={builder} />
      </Suspense>
    </>
  );
}
