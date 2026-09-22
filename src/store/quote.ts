"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { BuilderConfiguration, QuoteItem } from "@/lib/types";
import { track } from "@/lib/analytics";

const uid = () => Math.random().toString(36).slice(2, 10);

interface QuoteState {
  items: QuoteItem[];
  lastAddedAt?: number;
  addMachine: (machineId: string, quantity?: number, configurationId?: string) => void;
  addAttachment: (attachmentId: string, variantId?: string, quantity?: number) => void;
  addBuild: (name: string, configuration: BuilderConfiguration) => void;
  updateQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useQuote = create<QuoteState>()(
  persist(
    (set, get) => ({
      items: [],
      addMachine: (machineId, quantity = 1, configurationId) => {
        const existing = get().items.find((i) => i.kind === "machine" && i.machineId === machineId && i.configurationId === configurationId);
        if (existing && existing.kind === "machine") {
          set({ items: get().items.map((i) => (i.id === existing.id ? { ...existing, quantity: existing.quantity + quantity } : i)), lastAddedAt: Date.now() });
        } else {
          set({ items: [...get().items, { id: uid(), kind: "machine", machineId, configurationId, quantity }], lastAddedAt: Date.now() });
        }
        track({ name: "quote_add", kind: "machine", refId: machineId });
      },
      addAttachment: (attachmentId, variantId, quantity = 1) => {
        const existing = get().items.find((i) => i.kind === "attachment" && i.attachmentId === attachmentId && i.variantId === variantId);
        if (existing && existing.kind === "attachment") {
          set({ items: get().items.map((i) => (i.id === existing.id ? { ...existing, quantity: existing.quantity + quantity } : i)), lastAddedAt: Date.now() });
        } else {
          set({ items: [...get().items, { id: uid(), kind: "attachment", attachmentId, variantId, quantity }], lastAddedAt: Date.now() });
        }
        track({ name: "quote_add", kind: "attachment", refId: attachmentId });
      },
      addBuild: (name, configuration) => {
        set({ items: [...get().items, { id: uid(), kind: "build", name, configuration, createdAt: new Date().toISOString() }], lastAddedAt: Date.now() });
        track({ name: "quote_add", kind: "build", refId: configuration.selectedModelId ?? "none" });
      },
      updateQuantity: (id, quantity) =>
        set({ items: get().items.map((i) => (i.id === id && i.kind !== "build" ? { ...i, quantity: Math.max(1, quantity) } : i)) }),
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      clear: () => set({ items: [] }),
    }),
    { name: "nes-quote", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);

export const quoteCount = (items: QuoteItem[]) => items.reduce((n, i) => n + (i.kind === "build" ? 1 : i.quantity), 0);
