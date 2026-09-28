import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * Compatibility / filter chip with chamfered corners and an uppercase label: the "rugged" model button used for
 * machine filters, "fits these machines" lists and jump bars. Renders a Link when href is given, else a button.
 */
type Tone = "navy" | "outline" | "dark";
interface Base { active?: boolean; tone?: Tone; size?: "sm" | "md"; className?: string; children: ReactNode; count?: number | string }
type LinkP = Base & Omit<ComponentPropsWithoutRef<"a">, "className" | "children" | "href"> & { href: string };
type BtnP = Base & Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & { href?: undefined };

export function RuggedChip(props: LinkP | BtnP) {
  const { active = false, tone = "outline", size = "md", className = "", children, count, ...rest } = props;
  const h = size === "sm" ? "h-8 px-3 text-[11px]" : "h-10 px-4 text-[12px]";
  const look = active
    ? "bg-navy text-white border-navy"
    : tone === "dark" ? "bg-charcoal text-white border-charcoal hover:bg-navy hover:border-navy" : "bg-white text-charcoal border-charcoal/80 hover:border-navy hover:text-navy";
  const cls = `chamfer inline-flex items-center gap-1.5 border-2 font-bold uppercase tracking-[0.12em] leading-none transition-colors ${h} ${look} ${className}`;
  const inner = <>{children}{count !== undefined && <span className={`ml-0.5 text-[10px] font-semibold ${active ? "text-white/70" : "text-grey"}`}>{count}</span>}</>;
  if ("href" in rest && rest.href) { const { href, ...a } = rest as LinkP; return href.startsWith("#") ? <a href={href} className={cls} {...a}>{inner}</a> : <Link href={href} className={cls} {...a}>{inner}</Link>; }
  const b = rest as BtnP;
  return <button type="button" className={cls} aria-pressed={active} {...b}>{inner}</button>;
}
