"use client";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  targetName: string;
  currentName: string;
  items: string[];
  onRemoveAndSwitch: () => void;
  onKeepCurrent: () => void;
}

export function ModelChangeDialog({ targetName, currentName, items, onRemoveAndSwitch, onKeepCurrent }: Props) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center" role="alertdialog" aria-modal="true" aria-labelledby="mc-title" aria-describedby="mc-desc">
      <button type="button" aria-label="Keep current model" onClick={onKeepCurrent} className="absolute inset-0 bg-charcoal/50" />
      <div className="relative w-full max-w-md rounded-card border border-line bg-white p-6 shadow-lift">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-warning"><AlertTriangle className="size-5" aria-hidden /></span>
          <div>
            <h2 id="mc-title" className="text-lg font-bold text-charcoal">Some attachments don&apos;t fit the {targetName}</h2>
            <p id="mc-desc" className="mt-1 text-sm text-grey">These items are not compatible with the {targetName} and will need to be removed if you switch:</p>
          </div>
        </div>
        <ul className="mt-4 space-y-1 rounded-card bg-light p-3 text-sm text-charcoal">
          {items.map((i) => <li key={i}>• {i}</li>)}
        </ul>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Button onClick={onRemoveAndSwitch}>Remove incompatible items</Button>
          <Button onClick={onKeepCurrent} variant="secondary">Keep {currentName}</Button>
        </div>
      </div>
    </div>
  );
}
