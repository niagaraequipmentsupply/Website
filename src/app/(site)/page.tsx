import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { CategoryCarousel } from "@/components/home/CategoryCarousel";
import { WhyChoose } from "@/components/home/WhyChoose";
import { AttachmentCarousel } from "@/components/home/AttachmentCarousel";
import { CtaBand } from "@/components/home/CtaBand";
import { BuilderPromo } from "@/components/home/BuilderPromo";
import { FeaturedEquipment } from "@/components/home/FeaturedEquipment";
import { PromoStrip } from "@/components/home/PromoStrip";
import { ServiceFirst } from "@/components/home/ServiceFirst";
import { ServiceAreas } from "@/components/home/ServiceAreas";
import { Testimonials } from "@/components/home/Testimonials";
import { getSiteContent } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Niagara Equipment Supply | Official RIPPA Dealer in Ontario",
  description: "RIPPA dealer in Thorold, Ontario: mini excavators, skid steers, loaders, dumpers and attachments, with the RIPPA Service Centre and Ontario-wide delivery.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const { testimonials, catalogue } = await getSiteContent();
  const featured = testimonials.filter((t) => t.featured).slice(0, 6);
  const machineNames = new Map(catalogue.machines.map((m) => [m.id, m.modelName]));
  return (
    <>
      <Hero />
      <PromoStrip />
      <CategoryCarousel />
      <FeaturedEquipment />
      <WhyChoose />
      <Testimonials items={featured} machineNames={machineNames} />
      <AttachmentCarousel category="excavator-attachments" />
      <AttachmentCarousel category="skid-steer-attachments" />
      <ServiceFirst />
      <ServiceAreas />
      <BuilderPromo />
      <CtaBand
        eyebrow="Get to work sooner"
        title="Need the right machine fast?"
        text="Our team is here to help you find the right equipment, with financing options available."
      />
    </>
  );
}
