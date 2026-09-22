"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";

interface Props { modelName: string; sections: { id: string; label: string }[]; brochureUrl?: string }

/** Sticky in-page navigation under the header, RIPPA-style. Highlights the section in view. */
export function ProductSubnav({ modelName, sections, brochureUrl }: Props) {
  const [active, setActive] = useState(sections[0]?.id);
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((x): x is HTMLElement => !!x);
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-140px 0px -60% 0px", threshold: 0 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <div className="sticky top-16 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-site items-center gap-4 px-5 sm:px-6 lg:px-8">
        <p className="hidden shrink-0 py-3 text-sm font-bold text-charcoal md:block">{modelName}</p>
        <nav aria-label="On this page" className="no-scrollbar -mb-px flex flex-1 gap-1 overflow-x-auto">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition-colors ${active === s.id ? "border-navy text-navy" : "border-transparent text-grey hover:text-navy"}`} aria-current={active === s.id ? "location" : undefined}>{s.label}</a>
          ))}
        </nav>
        <div className="hidden shrink-0 items-center gap-2 py-2 md:flex">
          {brochureUrl && <Button href={brochureUrl} variant="secondary" size="sm" icon={<Download className="size-4" aria-hidden />} target="_blank" rel="noopener">Spec Sheet</Button>}
          <Button href="#quote" size="sm" arrow>Get a Quote</Button>
        </div>
      </div>
    </div>
  );
}
