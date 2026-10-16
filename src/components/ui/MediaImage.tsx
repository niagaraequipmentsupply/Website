import Image from "next/image";
import { preload } from "react-dom";
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
  /** Serve through next/image (WebP, resized to `sizes`) instead of the direct media URL. Use for cards and tiles, not galleries. */
  optimized?: boolean;
}

/**
 * Product photo served straight from the media store instead of the /_next/image proxy: the URL keeps its
 * descriptive filename (rippa-r10-eco-...jpg), the srcset reuses the thumbnail/card/large files Payload already
 * generated, and the same URLs appear in the image sitemap and ImageObject markup, so Google sees one image, not
 * a proxy URL on the page and a different file in the sitemap. Assets without size variants (static files) fall
 * back to next/image.
 */
export function MediaImage({ image, alt, sizes = "100vw", priority, className = "", maxWidth, optimized }: Props) {
  const label = image.alt || alt || "";
  // Listing cards and thumbnails: the optimizer cuts the bytes by half or more; the product's own gallery keeps the
  // descriptive direct URL, which is the copy Google indexes and the one listed in the image sitemap.
  if (optimized) return <Image src={image.src} alt={label} fill priority={priority} sizes={sizes} className={className} />;
  const pool = image.sources ?? [];
  let sources = maxWidth ? pool.filter((s) => s.width <= maxWidth) : pool;
  if (!sources.length && pool.length) sources = [pool[0]];
  if (!sources.length) return <Image src={image.src} alt={label} fill priority={priority} sizes={sizes} className={className} />;
  const largest = sources[sources.length - 1];
  const srcSet = sources.map((s) => `${s.src} ${s.width}w`).join(", ");
  // The product's lead photo is the LCP element: a preload in <head> starts it before the body is parsed.
  if (priority) preload(largest.src, { as: "image", imageSrcSet: srcSet, imageSizes: sizes, fetchPriority: "high" });
  return (
    // eslint-disable-next-line @next/next/no-img-element -- deliberate: descriptive media URLs + Payload's own size variants
    <img
      src={largest.src}
      srcSet={srcSet}
      sizes={sizes}
      alt={label}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}
