import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";

interface Props {
  title: ReactNode;
  text?: string;
  crumbs: Crumb[];
  children?: ReactNode;
  aside?: ReactNode;
}

export function PageHero({ title, text, crumbs, children, aside }: Props) {
  return (
    <section className="relative border-b border-line bg-light/60">
      <div aria-hidden className="absolute inset-0 bg-[url('/images/bg/light-grid.svg')] bg-cover bg-right opacity-40" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
      <Container className="relative grid items-center gap-8 py-10 lg:grid-cols-[3fr_2fr] lg:py-12">
        <div>
          <Breadcrumbs items={crumbs} className="mb-4" />
          <h1 className="display text-charcoal">{title}</h1>
          {text && <p className="mt-3 max-w-2xl text-[16px] text-charcoal/85">{text}</p>}
          {children && <div className="mt-6">{children}</div>}
        </div>
        {aside && <div className="hidden lg:block">{aside}</div>}
      </Container>
    </section>
  );
}
