/** One-off: pluralise attachment type labels already in the database so menu + headings read naturally. */
import { getPayload } from "payload";
import config from "@payload-config";
const map: Record<string, string> = { Bucket: "Buckets", Thumb: "Thumbs", Auger: "Augers", Rake: "Rakes", Breaker: "Breakers", Cutter: "Cutters", Snow: "Snow Equipment", Grapple: "Grapples" };
const payload = await getPayload({ config });
const { docs } = await payload.find({ collection: "attachments", limit: 500, depth: 0, draft: true });
let n = 0;
for (const d of docs) {
  const next = map[d.attachmentType];
  if (next) { await payload.update({ collection: "attachments", id: d.id, data: { attachmentType: next } }); n++; }
}
payload.logger.info(`Updated ${n} attachment types`);
process.exit(0);
