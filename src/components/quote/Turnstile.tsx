"use client";
import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window { turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; remove: (id: string) => void } }
}

/** Cloudflare Turnstile widget. Injects a hidden `cf-turnstile-response` field into the enclosing form. */
export function Turnstile({ siteKey }: { siteKey: string }) {
  const el = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);

  const render = () => {
    if (!el.current || !window.turnstile || widget.current) return;
    widget.current = window.turnstile.render(el.current, { sitekey: siteKey, theme: "light", size: "flexible", appearance: "interaction-only" });
  };

  useEffect(() => {
    render();
    return () => { if (widget.current && window.turnstile) { window.turnstile.remove(widget.current); widget.current = undefined; } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onLoad={render} />
      <div ref={el} className="min-h-[1px]" />
    </>
  );
}
