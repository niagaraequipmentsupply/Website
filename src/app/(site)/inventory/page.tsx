import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryCard } from "@/components/equipment/CategoryCard";
import { ProductCard } from "@/components/equipment/ProductCard";
import { CtaBand } from "@/components/home/CtaBand";
import { getSiteContent } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "RIPPA Equipment for Sale in Ontario | Mini Excavators, Skid Steers & Loaders",
  description: "Browse RIPPA mini excavators, skid steers, loaders, backhoe loaders and track dumpers available from Niagara Equipment Supply across Ontario.",
  alternates: { canonical: "/inventory" },
};

export default async function InventoryPage() {
  const { categories, catalogue: { machines } } = await getSiteContent();
  const catRank = new Map(categories.map((c, i) => [c.slug, i]));
  const featured = machines
    .filter((m) => m.featured)
    .sort((a, b) => (a.specs.length === 0 ? 1 : 0) - (b.specs.length === 0 ? 1 : 0) || (catRank.get(a.category) ?? 99) - (catRank.get(b.category) ?? 99) || a.sortOrder - b.sortOrder)
    .slice(0, 8);
  return (
    <>
      <PageHero title="Equipment" text="RIPPA compact machines for contractors, landscapers, farms and municipalities. Choose a category to see models, specs and pricing." crumbs={[{ label: "Equipment" }]} />
      <section className="section">
        <Container>
          <SectionHeading title="Browse by Category" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[...categories].sort((a, b) => a.sortOrder - b.sortOrder).map((c) => <li key={c.slug}><CategoryCard category={c} /></li>)}
          </ul>
        </Container>
      </section>
      <section className="section-tight bg-light/60">
        <Container>
          <SectionHeading title="Featured Equipment" link={{ href: "/builder/excavator", label: "Build an Excavator or Skid Steer" }} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((m) => <li key={m.id}><ProductCard machine={m} /></li>)}
          </ul>
        </Container>
      </section>
      <CtaBand title="Not sure which machine fits the job?" text="Tell us about your work and timeline. We'll recommend a setup and send pricing." />
    </>
  );
}
