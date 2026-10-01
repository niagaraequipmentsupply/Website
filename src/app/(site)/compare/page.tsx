import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { Button } from "@/components/ui/Button";
import { AddToQuoteButton } from "@/components/equipment/AddToQuoteButton";
import { CompareSelector } from "@/components/equipment/CompareSelector";
import { getSiteContent } from "@/lib/catalogue";
import { isThin } from "@/lib/machines";
import { buildCompareRows, compareHref, DEFAULT_COMPARE, highlightLabels, parseModelsParam, resolveCompareModels } from "@/lib/compare";

type SearchParams = Promise<{ models?: string | string[] }>;

async function load(searchParams: SearchParams) {
  const { models } = await searchParams;
  const content = await getSiteContent();
  const requested = parseModelsParam(models);
  const slugs = requested.length ? requested : DEFAULT_COMPARE;
  const machines = resolveCompareModels(content.catalogue.machines, slugs);
  return { content, machines, requested };
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { machines, requested } = await load(searchParams);
  const names = machines.map((m) => `${m.brand} ${m.modelName}`);
  const valid = machines.length >= 2;
  const title = valid ? `${machines.map((m) => m.modelName).join(" vs ")}: RIPPA Comparison` : "Compare RIPPA Models";
  const description = valid
    ? `Side-by-side specs for the ${names.join(", ")}: weight, engine, dig depth, hydraulics, dimensions and what each is best for. Compare, then request a written quote from Niagara Equipment Supply.`
    : "Compare RIPPA mini excavators, skid steers, loaders and dumpers side by side: weight, engine, dig depth, hydraulics and dimensions.";
  const canonicalSlugs = [...machines].sort((a, b) => a.sortOrder - b.sortOrder || a.modelName.localeCompare(b.modelName)).map((m) => m.slug);
  return {
    title,
    description,
    alternates: { canonical: valid ? compareHref(canonicalSlugs) : "/compare" },
    robots: { index: valid || requested.length === 0, follow: true },
  };
}

export default async function ComparePage({ searchParams }: { searchParams: SearchParams }) {
  const { content, machines } = await load(searchParams);
  const { catalogue, categories } = content;
  const groups = categories.map((c) => ({ label: c.name, models: catalogue.machines.filter((m) => m.category === c.slug && !isThin(m)).map((m) => ({ slug: m.slug, name: m.modelName })) })).filter((g) => g.models.length);
  const selected = machines.map((m) => m.slug);
  const rows = buildCompareRows(machines);
  const highlights = highlightLabels(machines);
  const cols = `repeat(${machines.length}, minmax(160px, 1fr))`;
  const names = machines.map((m) => m.modelName);

  return (
    <>
      <section className="border-b border-line bg-light/60">
        <Container className="py-8">
          <Breadcrumbs items={[{ href: "/inventory", label: "Equipment" }, { label: "Compare" }]} className="mb-3" />
          <h1 className="display text-charcoal">{machines.length >= 2 ? <>{names.slice(0, -1).join(", ")} <span className="text-navy">vs</span> {names[names.length - 1]}</> : <>Compare RIPPA <span className="text-navy">models</span></>}</h1>
          <p className="mt-2 max-w-2xl text-[16px] text-charcoal/85">Every spec from the official RIPPA sheets, side by side. Differences are shaded so the trade-offs stand out. Add the one you want to your quote list or ask us which fits the work.</p>
        </Container>
      </section>

      <Container className="py-8">
        <CompareSelector groups={groups} selected={selected} />

        {machines.length === 0 ? (
          <p className="mt-8 rounded-card border border-line bg-white p-6 text-sm text-grey">Pick two or more models above to start a comparison.</p>
        ) : (
          <>
            <div className="mt-6 overflow-x-auto pb-2">
              <div className="grid gap-3" style={{ gridTemplateColumns: `180px ${cols}` }}>
                <div className="hidden sm:block" />
                {machines.map((m) => (
                  <article key={m.id} className="rounded-card border border-line bg-white p-3">
                    <Link href={`/inventory/${m.category}/${m.slug}`}><EquipmentImage image={m.images[0]} kind={m.category} alt={`${m.brand} ${m.modelName}`} compact /></Link>
                    <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-navy">{m.series ?? m.brand}</p>
                    <h2 className="display text-xl leading-tight text-charcoal"><Link href={`/inventory/${m.category}/${m.slug}`}>{m.modelName}</Link></h2>
                    <p className="mt-1 line-clamp-3 text-[13px] text-grey">{m.shortDescription}</p>
                    <div className="mt-3 grid gap-2">
                      <AddToQuoteButton kind="machine" id={m.id} size="sm" />
                      <Link href={`/inventory/${m.category}/${m.slug}`} className="inline-flex items-center gap-1 text-[13px] font-semibold text-navy hover:text-electric">Full details <ArrowRight className="size-3.5" aria-hidden /></Link>
                    </div>
                  </article>
                ))}
              </div>

              {highlights.length > 0 && (
                <div className="mt-4 grid gap-3" style={{ gridTemplateColumns: `180px ${cols}` }}>
                  {highlights.map((label) => (
                    <div key={label} className="contents">
                      <div className="flex items-center text-[12px] font-bold uppercase tracking-[0.12em] text-grey">{label}</div>
                      {machines.map((m) => { const s = m.specs.find((x) => x.label === label); return <div key={m.id} className="chamfer bg-navy px-3 py-2 text-[15px] font-bold text-white">{s?.value ?? "—"}</div>; })}
                    </div>
                  ))}
                </div>
              )}

              <table className="mt-8 w-full min-w-[640px] border-separate border-spacing-0 text-sm">
                <caption className="sr-only">Specification comparison: {names.join(", ")}</caption>
                <thead>
                  <tr>
                    <th scope="col" className="sticky left-0 z-10 bg-white px-3 py-2 text-left text-[12px] font-bold uppercase tracking-[0.15em] text-grey">Specification</th>
                    {machines.map((m) => <th key={m.id} scope="col" className="px-3 py-2 text-left text-[12px] font-bold uppercase tracking-[0.15em] text-charcoal">{m.modelName}</th>)}
                  </tr>
                </thead>
                {rows.map((g) => (
                  <tbody key={g.group}>
                    <tr><th scope="rowgroup" colSpan={machines.length + 1} className="bg-light/80 px-3 py-2 text-left text-[12px] font-bold uppercase tracking-[0.15em] text-charcoal">{g.label}</th></tr>
                    {g.rows.map((r) => (
                      <tr key={r.label} className={r.differs ? "bg-tint/60" : ""}>
                        <th scope="row" className="sticky left-0 z-10 border-b border-line bg-inherit px-3 py-2.5 text-left font-medium text-grey">{r.label}</th>
                        {r.values.map((v, i) => (
                          <td key={machines[i].id} className="border-b border-line px-3 py-2.5 font-semibold text-charcoal">{v ?? <span className="font-normal text-grey">—</span>}{r.imperial[i] && r.imperial[i] !== v && <span className="block text-[12px] font-normal text-grey">{r.imperial[i]}</span>}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-center rounded-card border border-line bg-light/60 p-5">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-navy">Still deciding?</p>
                <p className="mt-1 text-sm text-charcoal/85">Tell us the jobs, the access and what you tow with. We will recommend one model and a short attachment list, in writing, within one business day.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button href="/contact" arrow>Ask a specialist</Button>
                <Button href="/builder/excavator" variant="secondary">Build a package</Button>
              </div>
            </div>
          </>
        )}
      </Container>
    </>
  );
}
