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
            <h2 className="display text-charcoal">Excavator &amp; Skid Steer Builders</h2>
            <p className="mt-3 max-w-lg text-[15px] text-grey">Choose your model and configuration, add the attachments RIPPA lists for it, pick protection and warranty, then send the build for a written quote.</p>
            <ul className="mt-5 grid gap-2 text-sm text-charcoal sm:grid-cols-2">
              {["Compatible attachments only", "Rustproof, PDI & delivery add-ons", "Extended warranty options", "Save or request your build"].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check className="size-4 text-navy" aria-hidden />{t}</li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3"><Button href="/builder/excavator" size="lg" arrow>Build an Excavator</Button><Button href="/builder/skid-steer" size="lg" variant="secondary" arrow>Build a Skid Steer</Button></div>
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
