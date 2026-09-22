import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "white";
type Size = "sm" | "md" | "lg";

const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-btn transition-colors duration-200 whitespace-nowrap select-none disabled:opacity-50 disabled:pointer-events-none";
const variants: Record<Variant, string> = {
  primary: "bg-navy text-white hover:bg-electric active:bg-navy-dark",
  secondary: "bg-white text-navy border-2 border-navy hover:bg-tint hover:border-electric hover:text-electric",
  ghost: "bg-transparent text-navy hover:bg-tint",
  white: "bg-white text-navy hover:bg-tint",
};
const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-12 px-6 text-base",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

type ButtonProps = BaseProps & Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & { href?: undefined };
type LinkProps = BaseProps & Omit<ComponentPropsWithoutRef<"a">, "className" | "children" | "href"> & { href: string };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", arrow, icon, className = "", children, ...rest } = props;
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const content = (
    <>
      {icon}
      {children}
      {arrow && <ArrowRight className="size-4" aria-hidden />}
    </>
  );
  if ("href" in rest && rest.href) {
    const { href, ...a } = rest as LinkProps;
    if (href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
      return <a href={href} className={cls} {...a}>{content}</a>;
    }
    return <Link href={href} className={cls} {...a}>{content}</Link>;
  }
  const b = rest as ButtonProps;
  return <button type="button" className={cls} {...b}>{content}</button>;
}
