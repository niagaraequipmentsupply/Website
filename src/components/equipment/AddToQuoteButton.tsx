"use client";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useQuote } from "@/store/quote";

interface Props {
  kind: "machine" | "attachment";
  id: string;
  variantId?: string;
  configurationId?: string;
  quantity?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function AddToQuoteButton({ kind, id, variantId, configurationId, quantity = 1, size = "md", className = "", label = "Add to Quote" }: Props) {
  const addMachine = useQuote((s) => s.addMachine);
  const addAttachment = useQuote((s) => s.addAttachment);
  const [added, setAdded] = useState(false);

  const onClick = () => {
    if (kind === "machine") addMachine(id, quantity, configurationId);
    else addAttachment(id, variantId, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Button onClick={onClick} size={size} className={className} aria-live="polite" icon={added ? <Check className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}>
      {added ? "Added" : label}
    </Button>
  );
}
