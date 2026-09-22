import { machines } from "./machines";
import { attachments } from "./attachments";
import { addons } from "./addons";
import { warranties } from "./warranties";
import type { Catalogue } from "@/lib/pricing";

/** Single catalogue object passed into pricing/compatibility logic. Swap for a fetch() later. */
export const catalogue: Catalogue = { machines, attachments, addons, warranties };
export { machines, attachments, addons, warranties };
