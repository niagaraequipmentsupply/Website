"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  ariaLabel: string;
  /** Tailwind width classes for each slide. */
  itemClassName?: string;
  className?: string;
}

/**
 * Native scroll-snap carousel. No library. Keyboard: items are focusable links/buttons; arrows scroll by one viewport.
 */
export function Carousel({ children, ariaLabel, itemClassName = "w-[78%] sm:w-[46%] lg:w-[31%] xl:w-[23.5%]", className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, [update]);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  const items = Array.isArray(children) ? children : [children];
  const btn = "absolute top-1/2 z-[2] hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy text-white shadow-card transition-colors hover:bg-electric disabled:opacity-35 disabled:hover:bg-navy lg:flex";

  return (
    <div className={`relative overflow-x-clip ${className}`}>
      <div ref={ref} role="region" aria-label={ariaLabel} className="no-scrollbar flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2">
        {items.map((child, i) => (
          <div key={i} className={`shrink-0 snap-start ${itemClassName}`}>{child}</div>
        ))}
      </div>
      <button type="button" onClick={() => scrollBy(-1)} disabled={!canPrev} aria-label="Scroll previous" className={`${btn} -left-3 xl:-left-6`}>
        <ChevronLeft className="size-5" aria-hidden />
      </button>
      <button type="button" onClick={() => scrollBy(1)} disabled={!canNext} aria-label="Scroll next" className={`${btn} -right-3 xl:-right-6`}>
        <ChevronRight className="size-5" aria-hidden />
      </button>
    </div>
  );
}
