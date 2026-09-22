import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function BuilderPromo() {
  return (
    <section className="section-tight">
      <Container>
        <div className="grid items-center gap-8 rounded-card border border-line bg-tint/50 p-6 md:grid-cols-[1.2fr_1fr] md:p-10">
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.3em] text-navy">Build your machine</p>
            <h2 className="display text-charcoal">Excavator Builder</h2>
            <p className="mt-3 max-w-lg text-[15px] text-grey">Choose your model, add compatible attachments and protection packages, then request the build. Indicative pricing updates as you go.</p>
            <ul className="mt-5 grid gap-2 text-sm text-charcoal sm:grid-cols-2">
              {["Compatible attachments only", "Rustproof, PDI & delivery add-ons", "Extended warranty options", "Save or request your build"].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check className="size-4 text-navy" aria-hidden />{t}</li>
              ))}
            </ul>
            <Button href="/builder/excavator" size="lg" arrow className="mt-6">Start Building</Button>
          </div>
          <ol className="grid gap-3">
            {["Choose Model", "Add Attachments", "Protection & Warranty", "Review Build"].map((s, i) => (
              <li key={s} className="flex items-center gap-4 rounded-card border border-line bg-white px-4 py-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">{i + 1}</span>
                <span className="font-semibold text-charcoal">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
