import Link from "next/link";
import { ShieldCheck, Wrench, Package, GraduationCap, Phone, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * The RIPPA Service Centre brand. One name, one promise, reused on the homepage, product pages and the
 * service pages so support reads as a destination, not a back-of-house department.
 */
export const SERVICE_CENTRE = {
  name: "RIPPA Service Centre",
  shortName: "Service Centre",
  tagline: "You run it. We back it.",
  promise: "Certified RIPPA technicians, warranty claims handled for you, genuine parts shipped across Canada and free owner training. For every RIPPA owner in Ontario, whether you bought from us or not.",
  href: "/service",
};

/** The four things the Service Centre stands for. Used as pillars on /service and as a strip elsewhere. */
export const PILLARS: { icon: LucideIcon; title: string; text: string; href: string }[] = [
  { icon: ShieldCheck, title: "Warranty, handled", text: "We diagnose, file the claim with RIPPA and fit the parts. You get one call and a fixed machine.", href: "/service#warranty" },
  { icon: Wrench, title: "Certified repairs", text: "Factory-trained technicians who work on RIPPA every day, in our shop or at your site.", href: "/service#book" },
  { icon: Package, title: "Genuine parts, Canada-wide", text: "Filters, tracks, hoses and wear parts by serial number. Stocked items ship same or next day.", href: "/service/parts" },
  { icon: GraduationCap, title: "Owner training", text: "Delivery walk-through, first-service check-in, and free guides and videos for every model.", href: "/service#learn" },
];

/** Compact strip for product pages and the builder: the promise plus the four pillars as links. */
export function ServiceCentreStrip({ phone, phoneHref, className = "" }: { phone: string; phoneHref: string; className?: string }) {
  return (
    <aside className={`relative overflow-hidden rounded-card border border-navy/15 bg-navy p-5 text-white ${className}`} aria-label={SERVICE_CENTRE.name}>
      <div aria-hidden className="absolute inset-0 bg-[url('/images/bg/service-bay.jpg')] bg-cover bg-center opacity-40" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/60" />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/70">Backed by the</p>
          <p className="display mt-1 text-2xl leading-none">{SERVICE_CENTRE.name}</p>
          <p className="mt-2 max-w-2xl text-sm text-white/85">{SERVICE_CENTRE.tagline} {SERVICE_CENTRE.promise}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link href={SERVICE_CENTRE.href} className="inline-flex h-10 items-center gap-1.5 rounded-btn bg-white px-4 text-sm font-bold text-navy hover:bg-tint">Visit the Service Centre <ArrowRight className="size-4" aria-hidden /></Link>
          <a href={phoneHref} className="inline-flex h-10 items-center gap-1.5 rounded-btn border border-white/40 px-4 text-sm font-semibold text-white hover:bg-white/10"><Phone className="size-4" aria-hidden />{phone}</a>
        </div>
      </div>
      <ul className="relative mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p) => (
          <li key={p.title}>
            <Link href={p.href} className="flex h-full items-start gap-2 rounded-md bg-white/10 px-3 py-2.5 text-sm hover:bg-white/15">
              <p.icon className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span><span className="block font-bold">{p.title}</span><span className="block text-[12px] text-white/75">{p.text}</span></span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
