import type { Metadata } from "next";
import Link from "next/link";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { getSiteContent } from "@/lib/catalogue";
import { searchSite } from "@/lib/search";

type SearchParams = Promise<{ q?: string | string[] }>;

const q = async (sp: SearchParams) => { const { q } = await sp; return (Array.isArray(q) ? q[0] : q ?? "").trim().slice(0, 80); };

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const query = await q(searchParams);
  return { title: query ? `Search: ${query}` : "Search", robots: { index: false, follow: true } };
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await q(searchParams);
  const content = await getSiteContent();
  const { groups, total } = query ? searchSite(content, query) : { groups: [], total: 0 };
  const popular = ["R10 ECO", "R32 PRO", "RS07", "tilt bucket", "auger", "hydraulic filter", "financing", "warranty"];

  return (
    <Container className="py-8 lg:py-10">
      <Breadcrumbs items={[{ label: "Search" }]} className="mb-3" />
      <h1 className="display text-charcoal">Search <span className="text-navy">the site</span></h1>
      <form action="/search" role="search" className="mt-4 flex max-w-2xl gap-2">
        <label className="sr-only" htmlFor="site-search">Search equipment, attachments, parts and guides</label>
        <input id="site-search" name="q" type="search" defaultValue={query} placeholder="Model, attachment, part number, topic…" autoComplete="off" className="h-12 w-full rounded-btn border border-line bg-white px-4 text-[15px] text-charcoal placeholder:text-grey/70 focus:border-electric" />
        <button type="submit" className="chamfer inline-flex h-12 items-center gap-2 bg-navy px-5 text-[13px] font-bold uppercase tracking-[0.12em] text-white hover:bg-electric"><SearchIcon className="size-4" aria-hidden />Search</button>
      </form>

      {!query && (
        <div className="mt-6">
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-grey">Popular searches</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {popular.map((p) => <li key={p}><Link href={`/search?q=${encodeURIComponent(p)}`} className="inline-flex h-8 items-center rounded-full bg-tint px-3 text-[13px] font-semibold text-navy hover:bg-navy hover:text-white">{p}</Link></li>)}
          </ul>
        </div>
      )}

      {query && total === 0 && (
        <div className="mt-8 rounded-card border border-line bg-white p-6">
          <p className="font-bold text-charcoal">No results for “{query}”.</p>
          <p className="mt-1 text-sm text-grey">Try a model number (R18, RS07), an attachment type (grapple, auger, tilt bucket) or a part number. Or <Link href="/contact" className="font-semibold text-navy hover:text-electric">ask us directly</Link>; we answer within one business day.</p>
        </div>
      )}

      {total > 0 && (
        <div className="mt-8 grid gap-8">
          <p className="text-sm text-grey" role="status">{total} result{total === 1 ? "" : "s"} for “{query}”</p>
          {groups.map((g) => (
            <section key={g.type} aria-labelledby={`search-${g.type}`}>
              <h2 id={`search-${g.type}`} className="accent-bar display text-2xl text-charcoal">{g.label}</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.hits.map((h) => (
                  <li key={h.href + h.title}>
                    <Link href={h.href} className="flex h-full gap-3 rounded-card border border-line bg-white p-3 transition-colors hover:border-navy">
                      {g.type !== "page" && <EquipmentImage image={h.image} kind={g.type === "machine" ? "generic" : g.type === "attachment" || g.type === "part" ? "attachment" : "generic"} alt={h.title} className="w-20 shrink-0 bg-light" ratio="aspect-[4/3]" sizes="80px" compact />}
                      <div className="min-w-0">
                        <p className="font-bold text-charcoal">{h.title}</p>
                        {h.subtitle && <p className="mt-0.5 line-clamp-2 text-[13px] text-grey">{h.subtitle}</p>}
                        <span className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-navy">Open <ArrowRight className="size-3" aria-hidden /></span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </Container>
  );
}
