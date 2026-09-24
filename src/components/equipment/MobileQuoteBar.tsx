"use client";
import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";

/** Fixed bottom CTA on phones for product pages: quote anchor + call. Hides once the quote form is on screen. */
export function MobileQuoteBar({ label, phone, phoneHref }: { label: string; phone: string; phoneHref: string }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const el = document.getElementById("quote");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), { rootMargin: "0px 0px -20% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  if (hidden) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 py-2.5 shadow-[0_-4px_16px_rgba(8,61,145,0.08)] backdrop-blur md:hidden" role="region" aria-label="Quick actions">
      <div className="flex items-center gap-2">
        <Button href="#quote" size="sm" arrow className="flex-1">{label}</Button>
        <Button href={phoneHref} variant="secondary" size="sm" icon={<Phone className="size-4" aria-hidden />} aria-label={`Call ${phone}`}>Call</Button>
      </div>
    </div>
  );
}
