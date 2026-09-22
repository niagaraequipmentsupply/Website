import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Attachment } from "@/lib/types";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { attachmentUnitPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { AddToQuoteButton } from "./AddToQuoteButton";

export function AttachmentCard({ attachment, showQuote = false }: { attachment: Attachment; showQuote?: boolean }) {
  const href = `/attachments/${attachment.attachmentCategory}/${attachment.slug}`;
  const price = attachmentUnitPrice(attachment, attachment.variants[0]?.id);
  return (
    <article className="flex h-full flex-col rounded-card border border-line bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-electric hover:shadow-lift">
      <Link href={href}><EquipmentImage image={attachment.images[0]} kind="attachment" alt={attachment.name} /></Link>
      <h3 className="mt-3 text-center text-base font-bold text-charcoal"><Link href={href}>{attachment.name}</Link></h3>
      <p className="mt-0.5 text-center text-sm text-grey">{attachment.description}</p>
      {showQuote ? (
        <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
          <p className="text-center text-sm font-semibold text-navy">{price !== undefined ? `${attachment.variants.length > 1 ? "From " : ""}${formatPrice(price)}` : "Request pricing"}</p>
          <AddToQuoteButton kind="attachment" id={attachment.id} variantId={attachment.variants[0]?.id} size="sm" />
        </div>
      ) : (
        <Link href={href} className="mt-2 flex items-center justify-center gap-1 text-sm font-semibold text-navy hover:text-electric">
          View Details <ArrowRight className="size-4" aria-hidden />
        </Link>
      )}
    </article>
  );
}
