"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AttachmentSelection, BuilderConfiguration, FinanceSelection } from "@/lib/types";
import { track } from "@/lib/analytics";

export interface PendingModelChange {
  targetModelId: string;
  incompatible: AttachmentSelection[];
}

interface BuilderState extends BuilderConfiguration {
  savedAt?: string;
  /** Which builder the saved build belongs to ("excavator" | "skid-steer"); switching builders starts a fresh build. */
  builderKind?: string;
  setBuilderKind: (kind: string) => void;
  /** True once localStorage has been read. */
  hydrated: boolean;
  pruneUnknown: (machineIds: Set<string>, attachmentIds: Set<string>, addonIds: Set<string>, warrantyIds: Set<string>) => void;
  pendingModelChange?: PendingModelChange;
  selectModel: (modelId: string) => void;
  setConfiguration: (configurationId?: string) => void;
  /** Called when a model change would invalidate selections. */
  requestModelChange: (change: PendingModelChange) => void;
  confirmModelChange: (removeIncompatible: boolean) => void;
  cancelModelChange: () => void;
  addAttachment: (attachmentId: string, variantId?: string) => void;
  removeAttachment: (attachmentId: string, variantId?: string) => void;
  setAttachmentQuantity: (attachmentId: string, variantId: string | undefined, quantity: number) => void;
  toggleAddon: (addonId: string) => void;
  setWarranty: (id?: string) => void;
  setDelivery: (id?: string) => void;
  setFinance: (f: FinanceSelection) => void;
  markSaved: () => void;
  reset: () => void;
}

const initial: BuilderConfiguration = {
  selectedModelId: undefined,
  selectedConfigurationId: undefined,
  attachmentSelections: [],
  addonSelections: [],
  warrantySelectionId: undefined,
  deliverySelectionId: undefined,
  financeSelection: "finance",
};

const key = (a: string, v?: string) => `${a}|${v ?? ""}`;

export const useBuilder = create<BuilderState>()(
  persist(
    (set, get) => ({
      ...initial,
      hydrated: false,
      pruneUnknown: (machineIds, attachmentIds, addonIds, warrantyIds) => {
        const s = get();
        const next: Partial<BuilderConfiguration> = {};
        if (s.selectedModelId && !machineIds.has(s.selectedModelId)) { next.selectedModelId = undefined; next.selectedConfigurationId = undefined; }
        const atts = s.attachmentSelections.filter((a) => attachmentIds.has(a.attachmentId));
        if (atts.length !== s.attachmentSelections.length) next.attachmentSelections = atts;
        const adds = s.addonSelections.filter((a) => addonIds.has(a));
        if (adds.length !== s.addonSelections.length) next.addonSelections = adds;
        if (s.warrantySelectionId && !warrantyIds.has(s.warrantySelectionId)) next.warrantySelectionId = undefined;
        if (Object.keys(next).length) set(next);
      },
      selectModel: (modelId) => {
        set({ selectedModelId: modelId, selectedConfigurationId: undefined, pendingModelChange: undefined });
        track({ name: "model_select", modelId });
      },
      setConfiguration: (selectedConfigurationId) => set({ selectedConfigurationId }),
      requestModelChange: (change) => set({ pendingModelChange: change }),
      confirmModelChange: (removeIncompatible) => {
        const p = get().pendingModelChange;
        if (!p) return;
        const drop = new Set(p.incompatible.map((s) => key(s.attachmentId, s.variantId)));
        set({
          selectedModelId: p.targetModelId,
          selectedConfigurationId: undefined,
          attachmentSelections: removeIncompatible ? get().attachmentSelections.filter((s) => !drop.has(key(s.attachmentId, s.variantId))) : get().attachmentSelections,
          pendingModelChange: undefined,
        });
        track({ name: "model_select", modelId: p.targetModelId });
      },
      cancelModelChange: () => set({ pendingModelChange: undefined }),
      addAttachment: (attachmentId, variantId) => {
        const exists = get().attachmentSelections.some((s) => s.attachmentId === attachmentId && s.variantId === variantId);
        if (exists) return;
        set({ attachmentSelections: [...get().attachmentSelections, { attachmentId, variantId, quantity: 1 }] });
        track({ name: "attachment_add", attachmentId, variantId });
      },
      removeAttachment: (attachmentId, variantId) => {
        set({ attachmentSelections: get().attachmentSelections.filter((s) => !(s.attachmentId === attachmentId && (variantId === undefined || s.variantId === variantId))) });
        track({ name: "attachment_remove", attachmentId, variantId });
      },
      setAttachmentQuantity: (attachmentId, variantId, quantity) =>
        set({ attachmentSelections: get().attachmentSelections.map((s) => (s.attachmentId === attachmentId && s.variantId === variantId ? { ...s, quantity: Math.max(1, quantity) } : s)) }),
      toggleAddon: (addonId) => {
        const on = get().addonSelections.includes(addonId);
        set({ addonSelections: on ? get().addonSelections.filter((x) => x !== addonId) : [...get().addonSelections, addonId] });
        track({ name: "addon_toggle", addonId, selected: !on });
      },
      setWarranty: (id) => set({ warrantySelectionId: id }),
      setDelivery: (id) => set({ deliverySelectionId: id }),
      setFinance: (financeSelection) => set({ financeSelection }),
      markSaved: () => set({ savedAt: new Date().toISOString() }),
      reset: () => set({ ...initial, savedAt: undefined, pendingModelChange: undefined }),
      setBuilderKind: (kind) => { if (get().builderKind !== kind) set({ ...initial, savedAt: undefined, pendingModelChange: undefined, builderKind: kind }); },
    }),
    {
      name: "nes-builder",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      onRehydrateStorage: () => () => { useBuilder.setState({ hydrated: true }); },
      partialize: (s) => ({
        selectedModelId: s.selectedModelId, selectedConfigurationId: s.selectedConfigurationId, attachmentSelections: s.attachmentSelections, addonSelections: s.addonSelections,
        warrantySelectionId: s.warrantySelectionId, deliverySelectionId: s.deliverySelectionId, financeSelection: s.financeSelection, savedAt: s.savedAt,
      }),
    },
  ),
);

export const toConfiguration = (s: BuilderConfiguration): BuilderConfiguration => ({
  selectedModelId: s.selectedModelId,
  selectedConfigurationId: s.selectedConfigurationId,
  attachmentSelections: s.attachmentSelections,
  addonSelections: s.addonSelections,
  warrantySelectionId: s.warrantySelectionId,
  deliverySelectionId: s.deliverySelectionId,
  financeSelection: s.financeSelection,
});
