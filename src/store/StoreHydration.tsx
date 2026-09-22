"use client";
import { useEffect } from "react";
import { useQuote } from "./quote";
import { useBuilder } from "./builder";

/** Rehydrates persisted stores after mount to avoid SSR/localStorage mismatches. */
export function StoreHydration() {
  useEffect(() => {
    useQuote.persist.rehydrate();
    useBuilder.persist.rehydrate();
  }, []);
  return null;
}
