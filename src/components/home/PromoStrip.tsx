import Link from "next/link";
import { Percent, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getSiteContent } from "@/lib/catalogue";

/** Slim banner for the featured financing promotion. Hidden when none is featured. */
export async function PromoStrip() {
  const { financePromos } = await getSiteContent();
  const promo = financePromos.find((p) => p.featured) ?? financePromos.find((p) => p.kind === "promo");
  if (!promo) return null;
  return (
    <div className="border-b border-line bg-tint">
      <Container className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-3 text-sm text-charcoal">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy text-white"><Percent className="size-4" aria-hidden /></span>
          <span>{promo.badge && <strong className="mr-1 text-navy">{promo.badge}:</strong>}{promo.title}. <span className="text-grey">{promo.summary.split(".")[0]}.</span></span>
        </p>
        <Link href="/financing#promotions" className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold uppercase tracking-wide text-navy hover:text-electric">See financing offers <ArrowRight className="size-4" aria-hidden /></Link>
      </Container>
    </div>
  );
}
