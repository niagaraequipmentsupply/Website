import type { Attribution, Touch } from "@/lib/types";

/**
 * Where a visitor came from, captured in the browser on landing and sent with every form so the CRM can report
 * which channel and campaign produced the lead. First touch is written once per browser; last touch is refreshed
 * whenever a visit arrives with campaign tags, a click id or an outside referrer.
 */
const FIRST = "nes-first-touch";
const LAST = "nes-last-touch";
const UTM = ["source", "medium", "campaign", "term", "content"] as const;
const CLICK_IDS = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid"] as const;

function currentTouch(): Touch | undefined {
  if (typeof window === "undefined") return undefined;
  const params = new URLSearchParams(window.location.search);
  const t: Touch = { at: new Date().toISOString(), landing: window.location.pathname + (window.location.search ? window.location.search : "") };
  for (const k of UTM) { const v = params.get(`utm_${k}`); if (v) t[k] = v.slice(0, 120); }
  for (const k of CLICK_IDS) { const v = params.get(k); if (v) t.clickId = `${k}=${v.slice(0, 200)}`; }
  try {
    const ref = document.referrer ? new URL(document.referrer) : undefined;
    if (ref && ref.host !== window.location.host) t.referrer = `${ref.host}${ref.pathname}`.slice(0, 200);
  } catch { /* ignore */ }
  const marked = !!(t.source || t.clickId || t.referrer);
  return marked ? t : { at: t.at, landing: t.landing };
}

/** Run once per page load (layout). Safe to call repeatedly. */
export function captureTouch(): void {
  const t = currentTouch();
  if (!t) return;
  try {
    if (!localStorage.getItem(FIRST)) localStorage.setItem(FIRST, JSON.stringify(t));
    if (t.source || t.clickId || t.referrer) localStorage.setItem(LAST, JSON.stringify(t));
  } catch { /* storage blocked: attribution simply absent */ }
}

export function readAttribution(): Attribution | undefined {
  try {
    const first = localStorage.getItem(FIRST), last = localStorage.getItem(LAST);
    if (!first && !last) return undefined;
    return { first: first ? (JSON.parse(first) as Touch) : undefined, last: last ? (JSON.parse(last) as Touch) : undefined };
  } catch { return undefined; }
}

const title = (s: string) => s.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const paid = (m?: string) => !!m && /cpc|ppc|paid|ads?$|display|retarget/i.test(m);

/** Human channel name for a touch: "Google Ads", "Google organic", "Facebook / Instagram", "Email (spring-promo)", "Referral (gjequip.ca)", "Direct". */
export function channelOf(t?: Touch): string {
  if (!t) return "Direct";
  const src = (t.source ?? "").toLowerCase(), med = t.medium;
  const click = t.clickId?.split("=")[0];
  if (click === "gclid" || click === "gbraid" || click === "wbraid" || (/google/.test(src) && paid(med))) return "Google Ads";
  if (click === "msclkid" || (/bing|microsoft/.test(src) && paid(med))) return "Microsoft Ads";
  if (click === "ttclid" || /tiktok/.test(src)) return paid(med) ? "TikTok Ads" : "TikTok";
  if (click === "fbclid" || /facebook|^fb$|instagram|^ig$|meta/.test(src)) return paid(med) ? "Meta Ads" : "Facebook / Instagram";
  if (src) {
    if (/mail|newsletter|email/i.test(`${src} ${med ?? ""}`)) return `Email (${t.campaign ?? t.source})`;
    return med ? `${title(src)} (${med})` : title(src);
  }
  const host = (t.referrer ?? "").split("/")[0].replace(/^www\./, "").toLowerCase();
  if (!host) return "Direct";
  if (/(^|\.)google\./.test(host)) return "Google organic";
  if (/(^|\.)bing\.com$/.test(host)) return "Bing organic";
  if (/duckduckgo|yahoo|ecosia|brave/.test(host)) return `${title(host.split(".")[0])} organic`;
  if (/facebook|instagram|fb\.com|l\.facebook/.test(host)) return "Facebook / Instagram";
  if (/youtube|youtu\.be/.test(host)) return "YouTube";
  if (/linkedin/.test(host)) return "LinkedIn";
  if (/gjequip/.test(host)) return "G&J Equipment website";
  if (/rippa/.test(host)) return `RIPPA website (${host})`;
  return `Referral (${host})`;
}
