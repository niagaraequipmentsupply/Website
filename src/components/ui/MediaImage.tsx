import Image from "next/image";
import type { ImageAsset } from "@/lib/types";

interface Props {
  image: ImageAsset;
  /** Fallback when the asset carries no alt of its own. */
  alt?: string;
  sizes?: string;
  priority?: boolean;
  /** object-fit / padding classes; the element always fills its positioned parent. */
  className?: string;
  /** Skip candidates wider than this (thumbnails never need the 1600px file). */
  maxWidth?: number;
}

/**
 * Product photo served straight from the media store instead of the /_next/image proxy: the URL keeps its
 * descriptive filename (rippa-r10-eco-...jpg), the srcset reuses the thumbnail/card/large files Payload already
 * generated, and the same URLs appear in the image sitemap and ImageObject markup, so Google sees one image, not
 * a proxy URL on the page and a different file in the sitemap. Assets without size variants (static files) fall
 * back to next/image.
 */
export function MediaImage({ image, alt, sizes = "100vw", priority, className = "", maxWidth }: Props) {
  const label = image.alt || alt || "";
  const pool = image.sources ?? [];
  let sources = maxWidth ? pool.filter((s) => s.width <= maxWidth) : pool;
  if (!sources.length && pool.length) sources = [pool[0]];
  if (!sources.length) return <Image src={image.src} alt={label} fill priority={priority} sizes={sizes} className={className} />;
  const largest = sources[sources.length - 1];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- deliberate: descriptive media URLs + Payload's own size variants
    <img
      src={largest.src}
      srcSet={sources.map((s) => `${s.src} ${s.width}w`).join(", ")}
      sizes={sizes}
      alt={label}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}
