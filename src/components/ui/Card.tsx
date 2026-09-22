import type { ComponentPropsWithoutRef } from "react";

interface CardProps extends ComponentPropsWithoutRef<"div"> {
  selected?: boolean;
  interactive?: boolean;
  padded?: boolean;
}

export function Card({ selected, interactive, padded = true, className = "", children, ...rest }: CardProps) {
  const border = selected ? "border-2 border-navy bg-tint/40" : "border border-line bg-white";
  const hover = interactive ? "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift hover:border-electric" : "";
  return (
    <div className={`relative rounded-card ${border} ${hover} ${padded ? "p-5" : ""} ${className}`} {...rest}>
      {children}
    </div>
  );
}
