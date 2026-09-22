import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: ReactNode;
  subtitle?: string;
  eyebrow?: string;
  link?: { href: string; label: string };
  as?: "h1" | "h2" | "h3";
  className?: string;
  rule?: boolean;
}

export function SectionHeading({ title, subtitle, eyebrow, link, as: Tag = "h2", className = "", rule = true }: Props) {
  return (
    <div className={`mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 ${className}`}>
      <div className="flex min-w-0 flex-1 basis-full items-center gap-5 sm:basis-0">
        <div className="min-w-0 flex-1">
          {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-grey">{eyebrow}</p>}
          <Tag className="display text-charcoal">{title}</Tag>
          {subtitle && <p className="mt-2 max-w-2xl text-[15px] text-grey">{subtitle}</p>}
        </div>
        {rule && !subtitle && <div className="hidden h-px flex-1 bg-line md:block" aria-hidden />}
      </div>
      {link && <TextLink href={link.href}>{link.label}</TextLink>}
    </div>
  );
}

export function TextLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-navy hover:text-electric ${className}`}>
      {children}
      <ArrowRight className="size-4" aria-hidden />
    </Link>
  );
}
