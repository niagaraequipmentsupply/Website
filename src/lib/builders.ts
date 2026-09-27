import type { CategorySlug } from "@/lib/types";

/** The machine builders: one flow per machine family, same steps (model → attachments → protection → review). */
export interface BuilderKind {
  kind: "excavator" | "skid-steer";
  href: string;
  category: CategorySlug;
  attachmentCategory: "excavator-attachments" | "skid-steer-attachments";
  /** "Excavator" */
  label: string;
  /** "excavator" */
  noun: string;
  compareHref: string;
  browseHref: string;
}
export const BUILDERS: Record<BuilderKind["kind"], BuilderKind> = {
  excavator: { kind: "excavator", href: "/builder/excavator", category: "excavators", attachmentCategory: "excavator-attachments", label: "Excavator", noun: "excavator", compareHref: "/inventory/excavators#compare", browseHref: "/attachments/excavator-attachments" },
  "skid-steer": { kind: "skid-steer", href: "/builder/skid-steer", category: "skid-steers", attachmentCategory: "skid-steer-attachments", label: "Skid Steer", noun: "skid steer", compareHref: "/inventory/skid-steers#compare", browseHref: "/attachments/skid-steer-attachments" },
};
export const builderForCategory = (category: string): BuilderKind | undefined => Object.values(BUILDERS).find((b) => b.category === category);
export const builderForAttachmentCategory = (category: string): BuilderKind | undefined => Object.values(BUILDERS).find((b) => b.attachmentCategory === category);
/** Builder link for a machine, or undefined when its family has no builder or it is not builder-enabled. */
export const builderHref = (m: { category: string; slug: string; builderEnabled?: boolean }): string | undefined => {
  const b = builderForCategory(m.category);
  return b && m.builderEnabled ? `${b.href}?model=${m.slug}` : undefined;
};
