/** Remove all seeded sample financing promos/programs so /financing shows structure only. */
import { getPayload } from "payload";
import config from "@payload-config";
const payload = await getPayload({ config });
const { docs } = await payload.find({ collection: "finance-promos", limit: 100 });
for (const d of docs) await payload.delete({ collection: "finance-promos", id: d.id });
payload.logger.info(`Removed ${docs.length} sample promo(s)`);
process.exit(0);
