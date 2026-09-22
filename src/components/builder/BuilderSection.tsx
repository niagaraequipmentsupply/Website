import type { ReactNode } from "react";
import { TextLink } from "@/components/ui/SectionHeading";

interface Props { id: string; step: number; title: string; text?: string; link?: { href: string; label: string }; children: ReactNode }

export function BuilderSection({ id, step, title, text, link, children }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 rounded-card border border-line bg-white p-5 md:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">{step}</span>
          <div>
            <h2 id={`${id}-title`} className="display text-2xl text-charcoal">{title}</h2>
            {text && <p className="text-sm text-grey">{text}</p>}
          </div>
        </div>
        {link && <TextLink href={link.href} className="normal-case tracking-normal">{link.label}</TextLink>}
      </div>
      {children}
    </section>
  );
}
