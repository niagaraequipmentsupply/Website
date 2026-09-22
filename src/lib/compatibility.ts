import type { Attachment, AttachmentSelection, AttachmentVariant, Machine, Addon, WarrantyOption } from "@/lib/types";

/** Is this attachment (any variant) compatible with the given machine? */
export function isAttachmentCompatible(att: Attachment, machine: Machine): boolean {
  if (att.compatibleModelIds.length > 0) return att.compatibleModelIds.includes(machine.id);
  return att.compatibleCategories.includes(machine.category);
}

export function isVariantCompatible(att: Attachment, variant: AttachmentVariant, machine: Machine): boolean {
  if (!isAttachmentCompatible(att, machine)) return false;
  if (variant.compatibleModelIds && variant.compatibleModelIds.length > 0) return variant.compatibleModelIds.includes(machine.id);
  return true;
}

export function compatibleVariants(att: Attachment, machine: Machine): AttachmentVariant[] {
  return att.variants.filter((v) => isVariantCompatible(att, v, machine));
}

export function compatibleAttachments(all: Attachment[], machine: Machine): Attachment[] {
  return all.filter((a) => isAttachmentCompatible(a, machine)).filter((a) => a.variants.length === 0 || compatibleVariants(a, machine).length > 0);
}

export function isAddonEligible(addon: Addon | WarrantyOption, machine: Machine): boolean {
  const ids = "compatibleModelIds" in addon ? addon.compatibleModelIds : addon.eligibleModelIds;
  return ids === "all" || ids.includes(machine.id);
}

/** Given a target machine, return selections that would become invalid. */
export function findIncompatibleSelections(
  selections: AttachmentSelection[],
  attachmentsById: Map<string, Attachment>,
  machine: Machine,
): AttachmentSelection[] {
  return selections.filter((sel) => {
    const att = attachmentsById.get(sel.attachmentId);
    if (!att) return true;
    if (!isAttachmentCompatible(att, machine)) return true;
    if (sel.variantId) {
      const v = att.variants.find((x) => x.id === sel.variantId);
      if (!v || !isVariantCompatible(att, v, machine)) return true;
    }
    return false;
  });
}
