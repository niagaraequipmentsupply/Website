"use client";
import { Check } from "lucide-react";

export interface Step { id: string; label: string; href: string }

export function Stepper({ steps, current, completed }: { steps: Step[]; current: number; completed: boolean[] }) {
  return (
    <nav aria-label="Builder progress" className="w-full">
      <ol className="flex items-center justify-between gap-2 md:justify-center md:gap-0">
        {steps.map((s, i) => {
          const isCurrent = i === current;
          const done = completed[i];
          return (
            <li key={s.id} className="flex flex-1 items-center md:flex-none">
              <a href={s.href} className="group flex items-center gap-3" aria-current={isCurrent ? "step" : undefined}>
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                    isCurrent ? "border-navy bg-navy text-white" : done ? "border-navy bg-white text-navy" : "border-line bg-white text-grey"
                  }`}
                >
                  {done && !isCurrent ? <Check className="size-4" aria-hidden /> : i + 1}
                </span>
                <span className={`hidden text-sm font-semibold sm:inline ${isCurrent ? "text-navy" : done ? "text-charcoal" : "text-grey"}`}>{s.label}</span>
              </a>
              {i < steps.length - 1 && <span aria-hidden className="mx-3 h-px flex-1 bg-line md:w-20 md:flex-none lg:w-28" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
