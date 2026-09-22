import type { LucideIcon } from "lucide-react";

export function IconFeature({ icon: Icon, title, text, compact }: { icon: LucideIcon; title: string; text: string; compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`flex shrink-0 items-center justify-center rounded-md text-navy ${compact ? "size-9" : "size-11 bg-tint"}`}>
        <Icon className={compact ? "size-7" : "size-6"} strokeWidth={1.75} aria-hidden />
      </span>
      <div className="leading-tight">
        <p className="text-[12px] font-bold uppercase tracking-wide text-charcoal">{title}</p>
        <p className="text-[11px] uppercase tracking-wide text-grey">{text}</p>
      </div>
    </div>
  );
}
