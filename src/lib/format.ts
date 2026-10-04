const cad = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
export const formatPrice = (value?: number) => (value === undefined ? "Request pricing" : cad.format(value));
export const formatPriceOr = (value: number | undefined, fallback: string) => (value === undefined ? fallback : cad.format(value));
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Meta description that never exceeds `max` characters: cut at the last full sentence when possible, else at a word. */
export function metaDescription(text: string, max = 160): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const sentence = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  if (sentence >= 80) return cut.slice(0, sentence + 1);
  const word = cut.lastIndexOf(" ");
  return `${cut.slice(0, word > 100 ? word : max - 1).replace(/[,;:\s]+$/, "")}…`;
}
