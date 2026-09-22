import Image from "next/image";
import { PlaceholderArt } from "@/components/ui/PlaceholderArt";

/**
 * Hero image slot. Drop the approved hero photo at /public/images/hero/excavator.jpg (or update `src`)
 * and the placeholder art is replaced automatically. Keep the machine uncropped: object-contain.
 */
const HERO_IMAGE: { src: string; alt: string } | null = null;

export function HeroVisual() {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[5/4] rounded-card border border-line bg-light lg:absolute lg:inset-y-8 lg:right-0 lg:aspect-auto lg:h-auto lg:w-full">
      {HERO_IMAGE ? (
        <Image src={HERO_IMAGE.src} alt={HERO_IMAGE.alt} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-contain" />
      ) : (
        <>
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(8,61,145,0.08),transparent_55%)]" />
          <PlaceholderArt kind="excavators" label="RIPPA mini excavator" />
          <div aria-hidden className="absolute right-6 top-6 hidden rotate-[-4deg] text-right sm:block">
            <p className="display text-4xl leading-[0.95] text-navy/25">Work<br />Builds<br />More</p>
          </div>
        </>
      )}
    </div>
  );
}
