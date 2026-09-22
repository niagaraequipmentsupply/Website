import { Carousel } from "@/components/ui/Carousel";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AttachmentCard } from "@/components/equipment/AttachmentCard";
import { getAttachmentCategory, getAttachments } from "@/lib/catalogue";
import type { AttachmentCategorySlug } from "@/lib/types";

export async function AttachmentCarousel({ category }: { category: AttachmentCategorySlug }) {
  const cat = await getAttachmentCategory(category);
  const items = (await getAttachments(category)).filter((a) => a.featured);
  if (!cat || items.length === 0) return null;
  return (
    <section className="section-tight">
      <Container>
        <SectionHeading title={cat.name} link={{ href: `/attachments/${category}`, label: "View All Attachments" }} />
        <Carousel ariaLabel={cat.name} itemClassName="w-[70%] sm:w-[44%] md:w-[31%] lg:w-[23%] xl:w-[18.8%]">
          {items.map((a) => <AttachmentCard key={a.id} attachment={a} />)}
        </Carousel>
      </Container>
    </section>
  );
}
