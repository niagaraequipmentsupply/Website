import type { ImageAsset } from "@/lib/types";
import { MediaImage } from "./MediaImage";
import { PlaceholderArt, type PlaceholderKind } from "./PlaceholderArt";

interface Props {
  image?: ImageAsset;
  kind: PlaceholderKind;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** e.g. "aspect-[4/3]" */
  ratio?: string;
  /** Small thumbnail: hide the "image coming soon" caption. */
  compact?: boolean;
}

/** Product image with explicit aspect ratio and object-contain so buckets/thumbs are never cropped. */
export function EquipmentImage({ image, kind, alt, priority, sizes = "(max-width: 768px) 90vw, 320px", className = "", ratio = "aspect-[4/3]", compact }: Props) {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-light/60 ${ratio} ${className}`}>
      {image?.src ? (
        <MediaImage image={image} alt={alt} priority={priority} sizes={sizes} maxWidth={compact ? 800 : undefined} className={`object-contain ${compact ? "p-1" : "p-3"}`} />
      ) : (
        <PlaceholderArt kind={kind} label={alt} compact={compact} />
      )}
    </div>
  );
}
