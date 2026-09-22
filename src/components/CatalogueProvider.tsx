"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { Catalogue } from "@/lib/pricing";
import type { FinancingConfig } from "@/lib/types";

export interface CatalogueContextValue {
  catalogue: Catalogue;
  financing: FinancingConfig;
  taxRate?: number;
  taxLabel: string;
  phone: string;
  phoneHref: string;
}

const Ctx = createContext<CatalogueContextValue | null>(null);

export function CatalogueProvider({ value, children }: { value: CatalogueContextValue; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalogue(): CatalogueContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCatalogue must be used inside CatalogueProvider");
  return v;
}
