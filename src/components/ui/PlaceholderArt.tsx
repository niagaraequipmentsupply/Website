export type PlaceholderKind = "excavators" | "skid-steers" | "loaders" | "track-dumpers" | "attachment" | "generic";

/** Simple, brand-neutral line art used until real product photography is supplied. */
export function PlaceholderArt({ kind, label, compact }: { kind: PlaceholderKind; label: string; compact?: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-navy/70" role="img" aria-label={`${label} (image coming soon)`}>
      <svg viewBox="0 0 120 80" className={compact ? "h-[80%] w-auto" : "h-[55%] w-auto"} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {kind === "excavators" && (<>
          <rect x="18" y="58" width="52" height="12" rx="6" /><rect x="30" y="34" width="30" height="22" rx="3" /><path d="M60 40 L84 20 L100 44" /><path d="M100 44 l-8 12 h14 z" />
        </>)}
        {kind === "skid-steers" && (<>
          <circle cx="32" cy="62" r="9" /><circle cx="66" cy="62" r="9" /><rect x="24" y="32" width="50" height="22" rx="3" /><path d="M74 40 L96 40 L104 58 L84 58" />
        </>)}
        {kind === "loaders" && (<>
          <circle cx="34" cy="60" r="10" /><circle cx="80" cy="60" r="10" /><rect x="44" y="30" width="30" height="22" rx="3" /><path d="M74 36 L96 36 L108 54 L92 54" />
        </>)}
        {kind === "track-dumpers" && (<>
          <rect x="16" y="58" width="80" height="12" rx="6" /><path d="M24 54 L34 30 L94 30 L100 54 Z" /><rect x="22" y="38" width="12" height="16" rx="2" />
        </>)}
        {(kind === "attachment" || kind === "generic") && (<>
          <path d="M30 20 L70 20 L84 52 L20 52 Z" /><path d="M20 52 L28 64 L76 64 L84 52" /><path d="M40 20 v-8 M64 20 v-8" />
        </>)}
      </svg>
      {!compact && <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-grey">Image coming soon</span>}
    </div>
  );
}
