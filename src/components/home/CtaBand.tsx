import { Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getSiteContent } from "@/lib/catalogue";

interface Props {
  eyebrow?: string;
  title: string;
  text: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string; phone?: boolean };
}

export async function CtaBand({ eyebrow, title, text, primary = { href: "/quote", label: "Get a Quote" }, secondary: secondaryProp }: Props) {
  const { site } = await getSiteContent();
  const secondary = secondaryProp ?? { href: site.phoneHref, label: "Call Now", phone: true };
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_85%_50%,rgba(255,255,255,0.08),transparent_45%)]" />
      <Container className="relative flex flex-col items-start justify-between gap-6 py-12 lg:flex-row lg:items-center">
        <div className="max-w-2xl">
          {eyebrow && <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.3em] text-white/80">{eyebrow}</p>}
          <h2 className="display text-white">{title}</h2>
          <p className="mt-3 text-[15px] text-white/85">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href={primary.href} variant="white" size="lg" arrow>{primary.label}</Button>
          <Button href={secondary.href} size="lg" className="border-2 border-white bg-transparent hover:bg-white hover:text-navy" icon={secondary.phone ? <Phone className="size-4" aria-hidden /> : undefined}>
            {secondary.label}
          </Button>
        </div>
        <p aria-hidden className="pointer-events-none absolute -right-2 bottom-4 hidden rotate-[-8deg] font-serif text-3xl italic text-white/30 xl:block">
          People · Projects · Progress
        </p>
      </Container>
    </section>
  );
}
