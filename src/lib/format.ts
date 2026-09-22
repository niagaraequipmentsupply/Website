const cad = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
export const formatPrice = (value?: number) => (value === undefined ? "Request pricing" : cad.format(value));
export const formatPriceOr = (value: number | undefined, fallback: string) => (value === undefined ? fallback : cad.format(value));
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
