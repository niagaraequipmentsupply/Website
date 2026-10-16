import { revalidatePath } from "next/cache";
import { bumpContentVersion } from "@/lib/content-version";
import { queueIndexNow, urlsForDoc } from "@/lib/indexnow";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload";

/** Purge the whole site cache whenever catalogue content changes so edits show immediately. */
const purge = () => {
  bumpContentVersion();
  try { revalidatePath("/", "layout"); } catch { /* not in a request scope (e.g. seed script) */ }
};
/** Also tell the IndexNow engines which public pages changed (no-op unless INDEXNOW_KEY is set on the production host). */
const notify = (collection: string, doc: Record<string, unknown>) => { try { queueIndexNow(urlsForDoc(collection, doc)); } catch { /* best effort */ } };
export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, collection }) => { purge(); notify(collection.slug, doc); return doc; };
export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, collection }) => { purge(); notify(collection.slug, doc); return doc; };
export const revalidateGlobal: GlobalAfterChangeHook = ({ doc }) => { purge(); notify("globals", {}); return doc; };
