/**
 * Vendor-neutral analytics abstraction. Wire `window.dataLayer`, GA4, Plausible, etc. in `dispatch`.
 */
export type AnalyticsEvent =
  | { name: "category_click"; category: string }
  | { name: "model_select"; modelId: string }
  | { name: "attachment_add"; attachmentId: string; variantId?: string }
  | { name: "attachment_remove"; attachmentId: string; variantId?: string }
  | { name: "addon_toggle"; addonId: string; selected: boolean }
  | { name: "builder_complete"; modelId: string; lines: number }
  | { name: "quote_add"; kind: string; refId: string }
  | { name: "quote_submit"; source: string; items: number }
  | { name: "phone_click"; location: string }
  | { name: "financing_click"; location: string };

type Dispatcher = (event: AnalyticsEvent) => void;
const dispatchers: Dispatcher[] = [];

export function registerAnalytics(fn: Dispatcher) {
  dispatchers.push(fn);
}

export function track(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer?.push({ event: event.name, ...event });
  for (const fn of dispatchers) fn(event);
  if (process.env.NODE_ENV === "development") console.debug("[analytics]", event);
}
