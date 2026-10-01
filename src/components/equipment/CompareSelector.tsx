"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RuggedChip } from "@/components/ui/RuggedChip";
import { compareHref, DEFAULT_COMPARE, MAX_COMPARE } from "@/lib/compare";

interface Group { label: string; models: { slug: string; name: string }[] }

/** Toggle models in and out of the comparison; the page re-renders server-side from the URL. */
export function CompareSelector({ groups, selected }: { groups: Group[]; selected: string[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const go = (slugs: string[]) => start(() => router.push(compareHref(slugs), { scroll: false }));
  const toggle = (slug: string) => {
    if (selected.includes(slug)) return go(selected.filter((s) => s !== slug));
    if (selected.length >= MAX_COMPARE) return;
    go([...selected, slug]);
  };
  const full = selected.length >= MAX_COMPARE;
  return (
    <div className={`rounded-card border border-line bg-white p-4 md:p-5 ${pending ? "opacity-70" : ""}`} aria-busy={pending}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-navy">Choose up to {MAX_COMPARE} models</p>
        <div className="flex items-center gap-3 text-[12px] font-semibold">
          <span className="text-grey">{selected.length} selected</span>
          <button type="button" onClick={() => go(DEFAULT_COMPARE)} className="text-navy hover:text-electric">Reset</button>
          {selected.length > 0 && <button type="button" onClick={() => go([])} className="text-grey hover:text-navy">Clear</button>}
        </div>
      </div>
      <div className="mt-3 grid gap-3">
        {groups.map((g) => (
          <div key={g.label} className="flex flex-wrap items-center gap-2">
            <span className="mr-1 w-full text-[12px] font-semibold text-grey sm:w-32">{g.label}</span>
            {g.models.map((m) => {
              const active = selected.includes(m.slug);
              return (
                <RuggedChip key={m.slug} active={active} size="sm" onClick={() => toggle(m.slug)} aria-pressed={active} className={!active && full ? "opacity-40" : ""}>
                  {m.name}
                </RuggedChip>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
