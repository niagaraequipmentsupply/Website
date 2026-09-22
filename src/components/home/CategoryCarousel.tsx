import { Carousel } from "@/components/ui/Carousel";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryCard } from "@/components/equipment/CategoryCard";
import { getSiteContent } from "@/lib/catalogue";

export async function CategoryCarousel() {
  const { categories } = await getSiteContent();
  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
  return (
    <section className="section">
      <Container>
        <SectionHeading title="Shop by Equipment Category" link={{ href: "/inventory", label: "View All Inventory" }} />
        <Carousel ariaLabel="Equipment categories" itemClassName="w-[70%] sm:w-[44%] md:w-[31%] lg:w-[23%] xl:w-[18.8%]">
          {sorted.map((c) => <CategoryCard key={c.slug} category={c} />)}
        </Carousel>
      </Container>
    </section>
  );
}
