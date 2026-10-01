import type { BuilderConfiguration, FinanceSelection } from "@/lib/types";

/**
 * Shareable builder links: the configuration is packed into a short base64url string (`?b=`) so a customer can send
 * their build to a partner or come back to it on another device. No server state involved.
 */
interface Packed { m?: string; c?: string; a?: [string, string | undefined, number][]; o?: string[]; w?: string; d?: string; f?: FinanceSelection }

const toB64Url = (s: string) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64Url = (s: string) => decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (s.length % 4)) % 4))));

export function encodeBuild(cfg: BuilderConfiguration): string {
  const p: Packed = {
    m: cfg.selectedModelId, c: cfg.selectedConfigurationId,
    a: cfg.attachmentSelections.map((s) => [s.attachmentId, s.variantId, s.quantity]),
    o: cfg.addonSelections, w: cfg.warrantySelectionId, d: cfg.deliverySelectionId, f: cfg.financeSelection,
  };
  return toB64Url(JSON.stringify(p));
}

const FINANCE: FinanceSelection[] = ["cash", "finance", "lease"];

export function decodeBuild(value: string | null | undefined): BuilderConfiguration | null {
  if (!value) return null;
  try {
    const p = JSON.parse(fromB64Url(value)) as Packed;
    if (!p || typeof p !== "object" || typeof p.m !== "string") return null;
    return {
      selectedModelId: p.m,
      selectedConfigurationId: typeof p.c === "string" ? p.c : undefined,
      attachmentSelections: Array.isArray(p.a) ? p.a.filter((x) => Array.isArray(x) && typeof x[0] === "string").map((x) => ({ attachmentId: x[0], variantId: typeof x[1] === "string" ? x[1] : undefined, quantity: Math.max(1, Math.min(99, Number(x[2]) || 1)) })) : [],
      addonSelections: Array.isArray(p.o) ? p.o.filter((x): x is string => typeof x === "string") : [],
      warrantySelectionId: typeof p.w === "string" ? p.w : undefined,
      deliverySelectionId: typeof p.d === "string" ? p.d : undefined,
      financeSelection: FINANCE.includes(p.f as FinanceSelection) ? (p.f as FinanceSelection) : "finance",
    };
  } catch { return null; }
}
