/**
 * Builder packages: remove the placeholder "Dealer PDI / Setup" add-on and "Extended Warranty" option, and add the
 * two 50-hour service packages (pre-paid in shop, or a kit shipped with the machine). Re-runnable.
 *   npx payload run src/scripts/seed-service-packages.ts   (stop the dev server first: SQLite is single-writer)
 */
import { getPayload } from "payload";
import config from "@payload-config";
import { addons as seedAddons } from "../data/addons";

const payload = await getPayload({ config });
const log = (m: string) => payload.logger.info(m);

for (const name of ["Dealer PDI / Setup"]) {
  const r = await payload.delete({ collection: "addons", where: { name: { equals: name } } });
  log(`removed add-on "${name}" (${r.docs.length})`);
}
for (const name of ["Extended Warranty (4 Year)"]) {
  const r = await payload.delete({ collection: "warranties", where: { name: { equals: name } } });
  log(`removed warranty "${name}" (${r.docs.length})`);
}

for (const a of seedAddons.filter((x) => x.type === "service")) {
  const data = { name: a.name, type: a.type, icon: a.icon, shortDescription: a.shortDescription, fullDescription: a.fullDescription, price: a.price, quoteRequired: !!a.quoteRequired, allModels: true, selectable: a.selectable, defaultSelected: a.defaultSelected, sortOrder: a.sortOrder };
  const ex = await payload.find({ collection: "addons", where: { name: { equals: a.name } }, limit: 1 });
  if (ex.docs[0]) { await payload.update({ collection: "addons", id: ex.docs[0].id, data }); log(`updated "${a.name}"`); }
  else { await payload.create({ collection: "addons", data }); log(`created "${a.name}"`); }
}
const all = await payload.find({ collection: "addons", limit: 50, sort: "sortOrder" });
log(`add-ons now: ${all.docs.map((d) => `${d.name} [${d.type}]`).join(" · ")}`);
process.exit(0);
