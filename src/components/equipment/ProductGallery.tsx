"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { ImageAsset } from "@/lib/types";
import { track } from "@/lib/analytics";
import { PlaceholderArt, type PlaceholderKind } from "@/components/ui/PlaceholderArt";

interface Props {
  images: ImageAsset[];
  /** Fallback alt / placeholder label, e.g. "RIPPA R18 PRO". */
  alt: string;
  kind: PlaceholderKind;
  priority?: boolean;
}

/**
 * Product photo gallery: click a thumbnail to swap the main image, click the main image (or "Enlarge")
 * to open a full-screen lightbox with previous/next, keyboard arrows, Escape and touch swipe.
 */
export function ProductGallery({ images, alt, kind, priority }: Props) {
  const photos = images.filter((i) => i?.src);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const current = photos[Math.min(index, Math.max(photos.length - 1, 0))];
  const label = (i: number) => photos[i]?.alt || alt;

  const count = photos.length;
  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);
  const openAt = (i: number) => { setIndex(i); setOpen(true); track({ name: "gallery_open", refId: alt }); };

  if (photos.length === 0) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-light/60">
        <PlaceholderArt kind={kind} label={alt} />
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => openAt(index)}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-lg border border-line bg-white aspect-[4/3] focus:outline-none focus-visible:ring-2 focus-visible:ring-electric"
        aria-label={`Enlarge photo: ${label(index)}`}
      >
        <Image key={current.src} src={current.src} alt={label(index)} fill priority={priority} sizes="(max-width: 1024px) 100vw, 720px" className="object-contain p-3" />
        <span className="chamfer absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-charcoal/85 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors group-hover:bg-navy">
          <Maximize2 className="h-3.5 w-3.5" aria-hidden /> Enlarge
        </span>
        {photos.length > 1 && (
          <span className="absolute bottom-3 left-3 rounded-sm bg-white/90 px-2 py-1 text-[11px] font-semibold tabular-nums text-charcoal" aria-hidden>
            {index + 1} / {photos.length}
          </span>
        )}
      </button>

      {photos.length > 1 && (
        <ul className="mt-3 flex snap-x gap-2 overflow-x-auto pb-1" aria-label="Product photos">
          {photos.map((img, i) => (
            <li key={img.src} className="w-24 shrink-0 snap-start">
              <button
                type="button"
                onClick={() => setIndex(i)}
                onDoubleClick={() => openAt(i)}
                aria-label={`Show photo ${i + 1}: ${img.alt || alt}`}
                aria-current={i === index ? "true" : undefined}
                className={`relative block aspect-[4/3] w-full overflow-hidden rounded-md border-2 bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-electric ${i === index ? "border-navy" : "border-line hover:border-grey"}`}
              >
                <Image src={img.src} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && <Lightbox photos={photos} index={index} alt={alt} onClose={() => setOpen(false)} onPrev={prev} onNext={next} onSelect={setIndex} />}
    </div>
  );
}

function Lightbox({ photos, index, alt, onClose, onPrev, onNext, onSelect }: { photos: ImageAsset[]; index: number; alt: string; onClose: () => void; onPrev: () => void; onNext: () => void; onSelect: (i: number) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const many = photos.length > 1;
  const photo = photos[index];

  // Lock page scroll and move focus into the dialog; restore both on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && many) onPrev();
      else if (e.key === "ArrowRight" && many) onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext, many]);

  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0]?.clientX ?? null; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null || !many) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
    if (dx > 40) onPrev();
    else if (dx < -40) onNext();
    touchX.current = null;
  };

  const navBtn = "chamfer inline-flex h-11 w-11 items-center justify-center bg-white/10 text-white transition-colors hover:bg-electric focus:outline-none focus-visible:ring-2 focus-visible:ring-white";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo gallery: ${alt}`}
      className="fixed inset-0 z-[120] flex flex-col bg-charcoal text-white"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="min-w-0 truncate text-[13px] text-white/80">
          {many && <span className="mr-3 font-bold tabular-nums text-white">{index + 1} / {photos.length}</span>}
          {photo?.alt || alt}
        </p>
        <button ref={closeRef} type="button" onClick={onClose} className={navBtn} aria-label="Close gallery">
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        {many && (
          <button type="button" onClick={onPrev} className={`${navBtn} absolute left-2 top-1/2 -translate-y-1/2 sm:left-4`} aria-label="Previous photo">
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </button>
        )}
        <div className="relative h-full w-full max-w-6xl">
          {photo && <Image key={photo.src} src={photo.src} alt={photo.alt || alt} fill sizes="100vw" className="object-contain" priority />}
        </div>
        {many && (
          <button type="button" onClick={onNext} className={`${navBtn} absolute right-2 top-1/2 -translate-y-1/2 sm:right-4`} aria-label="Next photo">
            <ChevronRight className="h-6 w-6" aria-hidden />
          </button>
        )}
      </div>

      {many && (
        <ul className="flex justify-center gap-2 overflow-x-auto px-4 py-3" aria-label="All photos">
          {photos.map((img, i) => (
            <li key={img.src} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`Photo ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={`relative block h-14 w-[4.7rem] overflow-hidden rounded-sm border-2 bg-white transition-colors ${i === index ? "border-electric" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>,
    document.body,
  );
}
