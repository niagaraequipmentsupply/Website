/**
 * Phone numbers as the CRM wants them: E.164 (+19055550123). Canadian and US numbers typed without a country code
 * get +1; anything typed with a leading + is kept when it has 8–15 digits. Extensions ("ext 4", "x4") are dropped.
 */
export function normalizePhone(raw: string | undefined | null): string | undefined {
  if (!raw) return undefined;
  const base = raw.trim().split(/\s*(?:ext\.?|x|extension|#)\s*\d+\s*$/i)[0] ?? raw;
  const plus = base.trim().startsWith("+");
  const digits = base.replace(/\D/g, "");
  if (plus) return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : undefined;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return undefined;
}

/** (905) 555-0123 for +1 numbers; other countries stay in E.164. */
export function formatPhone(e164: string): string {
  const m = e164.match(/^\+1(\d{3})(\d{3})(\d{4})$/);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : e164;
}
