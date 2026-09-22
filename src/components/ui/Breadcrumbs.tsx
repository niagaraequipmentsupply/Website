import Link from "next/link";
import { Fragment } from "react";

export interface Crumb { href?: string; label: string }

export function Breadcrumbs({ items, className = "", light }: { items: Crumb[]; className?: string; light?: boolean }) {
  const all = [{ href: "/", label: "Home" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: c.href } : {}) })),
  };
  return (
    <nav aria-label="Breadcrumb" className={`text-[13px] ${light ? "text-white/80" : "text-grey"} ${className}`}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((c, i) => (
          <Fragment key={i}>
            {i > 0 && <li aria-hidden className="opacity-60">/</li>}
            <li>
              {c.href && i < all.length - 1 ? (
                <Link href={c.href} className={`font-medium ${light ? "hover:text-white" : "text-navy hover:text-electric"}`}>{c.label}</Link>
              ) : (
                <span aria-current="page">{c.label}</span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
