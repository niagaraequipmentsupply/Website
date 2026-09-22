"use client";
import { useState, type FormEvent } from "react";
import { CheckCircle2, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { LeadPayload } from "@/lib/types";

const field = "h-11 w-full rounded-btn border border-line bg-white px-3 text-[15px] text-charcoal placeholder:text-grey/70 focus:border-electric";

/** "Want to learn how to fix something on your RIPPA?" — community content requests, posted to /api/lead as content-request. */
export function ContentRequest({ compact }: { compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("website")) return;
    setStatus("sending");
    const payload: LeadPayload = {
      source: "content-request",
      contact: { name: String(fd.get("name") ?? "") || "Anonymous", email: String(fd.get("email") ?? "") || "noreply@content-request.local", phone: "n/a", message: `[${fd.get("machine") || "any model"}] ${fd.get("request")}` },
      page: typeof window !== "undefined" ? window.location.pathname : undefined, submittedAt: new Date().toISOString(),
    };
    try {
      const res = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch { setStatus("error"); }
  };
  if (status === "done") {
    return <div className="rounded-card border border-green-200 bg-green-50 p-5 text-center" role="status"><CheckCircle2 className="mx-auto size-8 text-success" aria-hidden /><p className="mt-2 font-bold text-charcoal">Thanks, we&apos;ll add it to the list.</p><p className="text-sm text-grey">Popular requests get filmed first. Follow us on YouTube so you see it when it lands.</p></div>;
  }
  return (
    <form onSubmit={onSubmit} className={`rounded-card border-2 border-navy bg-white ${compact ? "p-4" : "p-5 md:p-6"}`}>
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-navy text-white"><MessageSquarePlus className="size-6" aria-hidden /></span>
        <div>
          <h3 className="display text-2xl text-charcoal">Want to learn how to fix something on your RIPPA?</h3>
          <p className="text-sm text-grey">Tell us what you&apos;re stuck on. We turn the most-requested jobs into guides and videos.</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-semibold text-charcoal sm:col-span-2">What do you want to see?<textarea name="request" required rows={3} className={`${field} mt-1 h-auto py-2`} placeholder="e.g. How to adjust track tension on my R18 PRO, what hydraulic oil to use in winter, how to install a thumb…" /></label>
        <label className="text-sm font-semibold text-charcoal">Your machine (optional)<input name="machine" className={`${field} mt-1`} placeholder="R15 ECO, RS07, other brand…" /></label>
        <label className="text-sm font-semibold text-charcoal">Email (optional, we&apos;ll tell you when it&apos;s up)<input name="email" type="email" className={`${field} mt-1`} /></label>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <input type="hidden" name="name" value="" />
      </div>
      {status === "error" && <p className="mt-2 text-sm font-semibold text-red-700" role="alert">Couldn&apos;t send that. Try again or message us on Instagram.</p>}
      <Button type="submit" size="md" arrow className="mt-4" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Request this topic"}</Button>
    </form>
  );
}
