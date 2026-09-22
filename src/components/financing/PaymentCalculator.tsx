"use client";
import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { useCatalogue } from "@/components/CatalogueProvider";
import { machinePrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";

const TERMS = [24, 36, 48, 60, 72];
const field = "h-11 w-full rounded-btn border border-line bg-white px-3 text-[15px] text-charcoal focus:border-electric";

/**
 * Illustrative payment calculator. The customer sets the rate and term themselves (defaults come from the
 * Financing global when the dealer has configured them), so no lender terms are implied.
 */
export function PaymentCalculator() {
  const { catalogue, financing } = useCatalogue();
  const priced = useMemo(() => catalogue.machines.filter((m) => machinePrice(m) !== undefined).sort((a, b) => a.category.localeCompare(b.category) || a.sortOrder - b.sortOrder), [catalogue]);
  const [machineId, setMachineId] = useState<string>("");
  const [amount, setAmount] = useState<number>(priced[0] ? (machinePrice(priced[0]) ?? 0) : 25000);
  const [down, setDown] = useState<number>(financing.downPaymentPercent ?? 10);
  const [term, setTerm] = useState<number>(financing.termMonths ?? 60);
  const [rate, setRate] = useState<number>(financing.annualRate ?? 7.99);

  const onMachine = (id: string) => {
    setMachineId(id);
    const m = priced.find((x) => x.id === id);
    if (m) setAmount(machinePrice(m) ?? 0);
  };

  const principal = Math.max(0, amount * (1 - down / 100));
  const r = rate / 100 / 12;
  const monthly = principal <= 0 ? 0 : r === 0 ? principal / term : (principal * r) / (1 - Math.pow(1 + r, -term));
  const totalCost = monthly * term + amount * (down / 100);

  return (
    <div className="rounded-card border border-line bg-white p-5 md:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-tint text-navy"><Calculator className="size-6" aria-hidden /></span>
        <div>
          <h3 className="display text-2xl text-charcoal">Payment Estimator</h3>
          <p className="text-sm text-grey">Play with the numbers to see what a machine could cost per month. For illustration only.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-charcoal sm:col-span-2">
          Start from a model (optional)
          <select value={machineId} onChange={(e) => onMachine(e.target.value)} className={`${field} mt-1`}>
            <option value="">Enter an amount below</option>
            {priced.map((m) => <option key={m.id} value={m.id}>{m.brand} {m.modelName} — from {formatPrice(machinePrice(m))}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-charcoal">
          Equipment price (CAD)
          <input type="number" min={0} step={500} value={amount} onChange={(e) => { setMachineId(""); setAmount(Number(e.target.value)); }} className={`${field} mt-1`} />
        </label>
        <label className="text-sm font-semibold text-charcoal">
          Down payment (%)
          <input type="number" min={0} max={90} step={5} value={down} onChange={(e) => setDown(Number(e.target.value))} className={`${field} mt-1`} />
        </label>
        <label className="text-sm font-semibold text-charcoal">
          Term
          <select value={term} onChange={(e) => setTerm(Number(e.target.value))} className={`${field} mt-1`}>
            {TERMS.map((t) => <option key={t} value={t}>{t} months</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-charcoal">
          Interest rate (% APR)
          <input type="number" min={0} max={30} step={0.25} value={rate} onChange={(e) => setRate(Number(e.target.value))} className={`${field} mt-1`} />
        </label>
      </div>
      <div className="mt-5 grid gap-3 rounded-card bg-tint p-4 sm:grid-cols-3">
        <div><p className="text-[11px] font-bold uppercase tracking-wide text-grey">Estimated monthly</p><p className="display text-3xl text-navy" aria-live="polite">{formatPrice(Math.round(monthly))}</p></div>
        <div><p className="text-[11px] font-bold uppercase tracking-wide text-grey">Amount financed</p><p className="text-lg font-bold text-charcoal">{formatPrice(Math.round(principal))}</p></div>
        <div><p className="text-[11px] font-bold uppercase tracking-wide text-grey">Total of payments</p><p className="text-lg font-bold text-charcoal">{formatPrice(Math.round(totalCost))}</p></div>
      </div>
      <p className="mt-3 text-[12px] text-grey">Estimate excludes taxes, fees and any deferred-payment interest. Actual rates and terms are set by the lender on approved credit. {financing.disclaimer}</p>
      <Button href="#apply" size="sm" arrow className="mt-4">Get a real quote on these numbers</Button>
    </div>
  );
}
