import type { Machine } from "@/lib/types";

/**
 * Items every new machine in a category ships with at no charge. They are shown as "included" in the builder,
 * removed from the add-on attachment list, and written on the quote so the customer sees them at $0.
 */
export interface IncludedItem { label: string; detail: string; /** Matches attachment family names to hide from the selector. */ matches: RegExp }

export const INCLUDED_BY_CATEGORY: Record<string, IncludedItem[]> = {
  excavators: [
    { label: "Hydraulic thumb", detail: "Fitted, plumbed and tested before delivery", matches: /\bthumb\b/i },
    { label: "Quick coupler", detail: "Tool-free bucket and attachment changes", matches: /\bquick coupler\b/i },
  ],
};

export const includedWith = (machine?: Machine): IncludedItem[] => (machine ? INCLUDED_BY_CATEGORY[machine.category] ?? [] : []);
export const isIncludedAttachment = (machine: Machine | undefined, attachmentName: string): boolean => includedWith(machine).some((i) => i.matches.test(attachmentName));
