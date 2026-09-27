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

export const metadata: Metadata = {
  title: "Niagara Equipment Supply | Official RIPPA Dealer in Ontario",
  description: "Compact equipment built for real work. RIPPA mini excavators, skid steers, loaders, backhoe loaders, track dumpers and attachments with financing, service and Ontario-wide delivery.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <PromoStrip />
      <CategoryCarousel />
      <FeaturedEquipment />
      <WhyChoose />
      <AttachmentCarousel category="excavator-attachments" />
      <AttachmentCarousel category="skid-steer-attachments" />
      <ServiceFirst />
      <BuilderPromo />
      <CtaBand
        eyebrow="Get to work sooner"
        title="Need the right machine fast?"
        text="Our team is here to help you find the right equipment, with financing options available."
      />
    </>
  );
}
