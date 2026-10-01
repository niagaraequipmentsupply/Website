"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

/**
 * Header search. `icon` renders a magnifier button that opens a small popover input (desktop);
 * `inline` renders a plain search field (mobile menu). Both submit to /search?q=.
 */
export function SearchBox({ variant = "icon", onNavigate }: { variant?: "icon" | "inline"; onNavigate?: () => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onClick = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { window.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, [open]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = (new FormData(e.currentTarget).get("q") as string | null)?.trim();
    if (!q) return;
    setOpen(false);
    onNavigate?.();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const field = (
    <form onSubmit={submit} role="search" className="flex gap-2">
      <label className="sr-only" htmlFor={`search-${variant}`}>Search the site</label>
      <input ref={inputRef} id={`search-${variant}`} name="q" type="search" placeholder="Model, attachment, part number…" autoComplete="off" className="h-11 w-full rounded-btn border border-line bg-white px-3 text-[15px] text-charcoal placeholder:text-grey/70 focus:border-electric" />
      <button type="submit" className="chamfer inline-flex h-11 shrink-0 items-center gap-1.5 bg-navy px-4 text-[12px] font-bold uppercase tracking-[0.12em] text-white hover:bg-electric"><Search className="size-4" aria-hidden />Go</button>
    </form>
  );

  if (variant === "inline") return <div className="px-3 pb-2 pt-3">{field}</div>;

  return (
    <div ref={wrapRef} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? "Close search" : "Search the site"} className="flex size-11 items-center justify-center rounded-btn text-navy hover:bg-tint">
        {open ? <X className="size-6" aria-hidden /> : <Search className="size-6" aria-hidden />}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(92vw,420px)] rounded-card border border-line bg-white p-3 shadow-lift">
          {field}
          <p className="mt-2 text-[12px] text-grey">Try a model (R18, RS07), an attachment (auger, grapple) or a part number.</p>
        </div>
      )}
    </div>
  );
}
