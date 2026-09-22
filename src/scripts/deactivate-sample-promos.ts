/** Deactivate the seeded SAMPLE 0% promo so no "0% APR" badges show. Re-enable in /admin when a real offer exists. */
import { getPayload } from "payload";
import config from "@payload-config";
const payload = await getPayload({ config });
const { docs } = await payload.find({ collection: "finance-promos", where: { badge: { equals: "0% APR" } }, limit: 10 });
for (const d of docs) await payload.update({ collection: "finance-promos", id: d.id, data: { active: false, featured: false } });
payload.logger.info(`Deactivated ${docs.length} promo(s)`);
process.exit(0);
