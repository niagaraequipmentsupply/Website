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
    <section className="border-b border-line bg-gradient-to-r from-white via-white to-light/70">
      <Container className="grid items-center gap-8 py-10 lg:grid-cols-[3fr_2fr] lg:py-12">
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
