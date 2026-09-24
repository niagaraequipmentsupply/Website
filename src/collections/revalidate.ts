import { revalidatePath } from "next/cache";
import { bumpContentVersion } from "@/lib/content-version";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

/** Purge the whole site cache whenever catalogue content changes so edits show immediately. */
const purge = () => {
  bumpContentVersion();
  try { revalidatePath("/", "layout"); } catch { /* not in a request scope (e.g. seed script) */ }
};
export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc }) => { purge(); return doc; };
export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc }) => { purge(); return doc; };
export const revalidateGlobal: GlobalAfterChangeHook = ({ doc }) => { purge(); return doc; };
