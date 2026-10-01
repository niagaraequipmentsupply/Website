"use client";
import Link from "next/link";
import { useSyncExternalStore } from "react";

const KEY = "nes-consent";
const listeners = new Set<() => void>();
const read = (): string | null => { try { return localStorage.getItem(KEY); } catch { return "blocked"; } };
const subscribe = (cb: () => void) => { listeners.add(cb); window.addEventListener("storage", cb); return () => { listeners.delete(cb); window.removeEventListener("storage", cb); }; };
const write = (value: string) => { try { localStorage.setItem(KEY, value); } catch { /* ignore */ } listeners.forEach((cb) => cb()); };

/**
 * Analytics notice. Google Analytics loads by default (implied consent is acceptable for analytics in Ontario);
 * "Decline analytics" sets the GA opt-out flag for this browser and remembers the choice. Hidden on the server render.
 */
export function ConsentBanner({ gaId }: { gaId?: string }) {
  const choice = useSyncExternalStore(subscribe, read, () => "server");
  if (choice !== null) return null;

  const choose = (value: "accepted" | "declined") => {
    if (value === "declined" && gaId) (window as unknown as Record<string, boolean>)[`ga-disable-${gaId}`] = true;
    write(value);
  };

  return (
    <div role="region" aria-label="Cookie and analytics notice" className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-xl rounded-card border border-line bg-white p-4 text-[13px] text-charcoal shadow-lift sm:inset-x-auto sm:left-4">
      <p>We use cookies and Google Analytics to see how the site is used and improve it. No personal details are collected until you send a form. <Link href="/privacy" className="font-semibold text-navy underline-offset-2 hover:underline">Privacy policy</Link></p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => choose("accepted")} className="chamfer inline-flex h-9 items-center bg-navy px-4 text-[12px] font-bold uppercase tracking-[0.12em] text-white hover:bg-electric">OK</button>
        <button type="button" onClick={() => choose("declined")} className="inline-flex h-9 items-center px-3 text-[12px] font-semibold text-grey hover:text-navy">Decline analytics</button>
      </div>
    </div>
  );
}
