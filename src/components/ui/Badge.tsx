import type { ReactNode } from "react";
export function Badge({ children, tone = "navy", className = "" }: { children: ReactNode; tone?: "navy" | "grey" | "success" | "warning"; className?: string }) {
  const tones = {
    navy: "bg-navy text-white",
    grey: "bg-light text-grey",
    success: "bg-green-50 text-success border border-green-200",
    warning: "bg-amber-50 text-warning border border-amber-200",
  };
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${tones[tone]} ${className}`}>{children}</span>;
}
