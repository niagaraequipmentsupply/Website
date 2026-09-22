import { Carousel } from "@/components/ui/Carousel";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/equipment/ProductCard";
import { getSiteContent } from "@/lib/catalogue";

/** Machines flagged "Featured" in the admin, excavators first. Hidden when nothing is featured. */
export async function FeaturedEquipment() {
  const { catalogue, categories } = await getSiteContent();
  const rank = new Map(categories.map((c, i) => [c.slug, i]));
  const items = catalogue.machines
    .filter((m) => m.featured && m.specs.length > 0)
    .sort((a, b) => (rank.get(a.category) ?? 99) - (rank.get(b.category) ?? 99) || a.sortOrder - b.sortOrder)
    .slice(0, 8);
  if (items.length === 0) return null;
  return (
    <section className="section-tight">
      <Container>
        <SectionHeading title="Ready to Go to Work" link={{ href: "/inventory", label: "View All Equipment" }} />
        <Carousel ariaLabel="Featured equipment" itemClassName="w-[82%] sm:w-[48%] lg:w-[31.5%] xl:w-[23.5%]">
          {items.map((m) => <ProductCard key={m.id} machine={m} />)}
        </Carousel>
      </Container>
    </section>
  );
}
