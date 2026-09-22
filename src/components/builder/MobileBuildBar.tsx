"use client";
import { useEffect } from "react";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

interface Props {
  total: number;
  itemCount: number;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onRequest: () => void;
  canRequest: boolean;
  children: ReactNode;
}

export function MobileBuildBar({ total, itemCount, open, onOpen, onClose, onRequest, canRequest, children }: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white px-4 py-3 shadow-[0_-4px_16px_rgba(8,61,145,0.08)] lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={onOpen} className="min-w-0 shrink text-left">
            <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-grey">Est. total · {itemCount} item{itemCount === 1 ? "" : "s"}</p>
            <p className="display text-2xl text-navy">{formatPrice(total)}</p>
          </button>
          <div className="flex shrink-0 gap-2">
            <Button onClick={onOpen} variant="secondary" size="sm">View Build</Button>
            <Button onClick={onRequest} size="sm" disabled={!canRequest}>Request</Button>
          </div>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Your build">
          <button type="button" aria-label="Close build summary" onClick={onClose} className="absolute inset-0 bg-charcoal/50" />
          <div className="slide-up absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-2xl bg-white">
            <div className="sticky top-0 z-[1] flex justify-end bg-white/95 px-3 pt-3">
              <button type="button" onClick={onClose} aria-label="Close" className="flex size-11 items-center justify-center rounded-btn text-navy hover:bg-tint"><X className="size-6" aria-hidden /></button>
            </div>
            <div className="px-3 pb-6">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
