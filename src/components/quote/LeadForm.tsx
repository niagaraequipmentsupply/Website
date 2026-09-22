"use client";
import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useQuote } from "@/store/quote";
import { calculateTotals } from "@/lib/pricing";
import { useCatalogue } from "@/components/CatalogueProvider";
import { track } from "@/lib/analytics";
import type { LeadPayload } from "@/lib/types";

interface Props {
  source: LeadPayload["source"];
  title?: string;
  includeItems?: boolean;
  submitLabel?: string;
  messageLabel?: string;
  /** Pre-filled message, e.g. "I'm interested in the R32 PRO". */
  defaultMessage?: string;
  compact?: boolean;
}

const field = "h-11 w-full rounded-btn border border-line bg-white px-3 text-[15px] text-charcoal placeholder:text-grey/70 focus:border-electric";

export function LeadForm({ source, title, includeItems = false, submitLabel = "Send Quote Request", messageLabel = "Tell us about the job (optional)", defaultMessage, compact }: Props) {
  const { catalogue, taxRate, phone, phoneHref } = useCatalogue();
  const items = useQuote((s) => s.items);
  const clear = useQuote((s) => s.clear);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string>();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("website")) return; // honeypot
    setStatus("sending");
    setError(undefined);
    const payload: LeadPayload = {
      source,
      contact: {
        name: String(fd.get("name") ?? ""), company: String(fd.get("company") ?? "") || undefined, email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""), location: String(fd.get("location") ?? "") || undefined, message: String(fd.get("message") ?? "") || undefined,
      },
      items: includeItems ? items : undefined,
      builds: includeItems ? items.filter((i) => i.kind === "build").map((i) => (i.kind === "build" ? { configuration: i.configuration, totals: calculateTotals(i.configuration, catalogue, taxRate) } : null)).filter((x): x is NonNullable<typeof x> => !!x) : undefined,
      page: typeof window !== "undefined" ? window.location.pathname : undefined,
      submittedAt: new Date().toISOString(),
    };
    try {
      const res = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error ?? "Request failed");
      track({ name: "quote_submit", source, items: items.length });
      if (includeItems) clear();
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please call us.");
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-card border border-green-200 bg-green-50 p-6 text-center" role="status">
        <CheckCircle2 className="mx-auto size-10 text-success" aria-hidden />
        <p className="mt-2 text-lg font-bold text-charcoal">Request received</p>
        <p className="mt-1 text-sm text-grey">Thanks. A Niagara Equipment Supply specialist will follow up shortly. Need it faster? Call <a href={phoneHref} className="font-semibold text-navy">{phone}</a>.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-card border border-line bg-white p-5 md:p-6" aria-labelledby="lead-title">
      {title && <h2 id="lead-title" className="display mb-4 text-2xl text-charcoal">{title}</h2>}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-charcoal">Name *<input name="name" required autoComplete="name" className={`${field} mt-1`} /></label>
        <label className="text-sm font-semibold text-charcoal">Company<input name="company" autoComplete="organization" className={`${field} mt-1`} /></label>
        <label className="text-sm font-semibold text-charcoal">Email *<input name="email" type="email" required autoComplete="email" className={`${field} mt-1`} /></label>
        <label className="text-sm font-semibold text-charcoal">Phone *<input name="phone" type="tel" required autoComplete="tel" className={`${field} mt-1`} /></label>
        <label className="text-sm font-semibold text-charcoal sm:col-span-2">City / job site location<input name="location" autoComplete="address-level2" className={`${field} mt-1`} placeholder="e.g. Niagara Falls, ON" /></label>
        <label className="text-sm font-semibold text-charcoal sm:col-span-2">{messageLabel}<textarea name="message" rows={compact ? 3 : 4} defaultValue={defaultMessage} className={`${field} mt-1 h-auto py-2`} placeholder="Machine, attachments, timeline, financing needs…" /></label>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      </div>
      {error && <p className="mt-3 text-sm font-semibold text-red-700" role="alert">{error}</p>}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] text-grey">By submitting you agree to be contacted about your request. No spam.</p>
        <Button type="submit" size="lg" arrow disabled={status === "sending"}>{status === "sending" ? "Sending…" : submitLabel}</Button>
      </div>
    </form>
  );
}
