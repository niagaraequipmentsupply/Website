import Link from "next/link";
import { Wrench, Package, Droplets, PlayCircle, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostCard } from "@/components/content/PostCard";
import { getSiteContent } from "@/lib/catalogue";
import { SERVICE_CENTRE } from "@/components/service/ServiceCentre";

/** Homepage: service-first positioning with the three support entry points and the latest guides. */
export async function ServiceFirst() {
  const { posts, site } = await getSiteContent();
  const latest = posts.slice(0, 3);
  const tiles = [
    { icon: Wrench, title: "Warranty & certified repairs", text: `Claims filed for you, repairs by factory-trained technicians in ${site.address.city} or at your site. Any RIPPA owner welcome.`, href: "/service", cta: "Find help for my machine" },
    { icon: Package, title: "Parts shipped Canada-wide", text: "Filters, tracks, hoses, couplers and wear parts by serial number. US sourcing help too.", href: "/parts", cta: "Browse the parts catalogue" },
    { icon: Droplets, title: "Oil & lubricant programs", text: "Chevron and Catalys oils over the counter, or a supply program for your farm, shop or fleet.", href: "/lubricants", cta: "Set up a program" },
  ];
  return (
    <section className="section relative overflow-hidden bg-light/60">
      <div aria-hidden className="absolute inset-0 bg-[url('/images/bg/light-angles.svg')] bg-cover bg-center opacity-70" />
      <Container className="relative">
        <SectionHeading eyebrow={SERVICE_CENTRE.name} title={SERVICE_CENTRE.tagline} subtitle={SERVICE_CENTRE.promise} rule={false} link={{ href: "/service", label: "Visit the Service Centre" }} />
        <ul className="grid gap-4 md:grid-cols-3">
          {tiles.map((t) => (
            <li key={t.title}>
              <Link href={t.href} className="flex h-full flex-col rounded-card border border-line bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-electric hover:shadow-lift">
                <span className="flex size-11 items-center justify-center rounded-md bg-tint text-navy"><t.icon className="size-6" aria-hidden /></span>
                <h3 className="mt-3 text-lg font-bold text-charcoal">{t.title}</h3>
                <p className="mt-1 text-sm text-grey">{t.text}</p>
                <span className="mt-auto pt-4 text-sm font-semibold text-navy">{t.cta} →</span>
              </Link>
            </li>
          ))}
        </ul>
        {latest.length > 0 && (
          <>
            <div className="mt-10 mb-4 flex flex-wrap items-end justify-between gap-3">
              <h3 className="display text-2xl text-charcoal">Latest from the shop</h3>
              <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-navy hover:text-electric"><PlayCircle className="size-4" aria-hidden />All guides &amp; videos <ArrowRight className="size-4" aria-hidden /></Link>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{latest.map((p) => <li key={p.id}><PostCard post={p} /></li>)}</ul>
          </>
        )}
      </Container>
    </section>
  );
}
