/**
 * Give every equipment and attachment category a real RIPPA image for the header mega-menus and category heroes.
 * Machine categories use the lineup renders; attachment categories use the family images imported from rippagroup.
 *   npx payload run src/scripts/seed-category-images.ts
 */
import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });
const log = (m: string) => payload.logger.info(m);
const byFilename = async (name: string) => (await payload.find({ collection: "media", where: { filename: { equals: name } }, limit: 1 })).docs[0]?.id;
const attachmentImage = async (slug: string) => {
  const a = (await payload.find({ collection: "attachments", where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0];
  const img = a?.images?.[0]?.image; return typeof img === "number" ? img : (img as { id?: number } | undefined)?.id;
};
const picks: Record<string, () => Promise<number | undefined>> = {
  excavators: () => byFilename("r18-pro-render.jpg"),
  "skid-steers": () => byFilename("rs06-render.jpg"),
  loaders: () => byFilename("rl06-render.jpg"),
  "track-dumpers": () => byFilename("rd06-render.jpg"),
  "excavator-attachments": () => attachmentImage("digging-bucket-excavator"),
  "skid-steer-attachments": () => attachmentImage("4-in-1-bucket-skid-steer"),
  "loader-attachments": () => attachmentImage("loader-bucket-loader"),
};
const cats = await payload.find({ collection: "categories", limit: 50, depth: 0 });
for (const c of cats.docs) {
  if ((c.slug as string) === "backhoes") { await payload.delete({ collection: "categories", id: c.id }); log("deleted category backhoes"); continue; }
  const id = await picks[c.slug]?.();
  if (!id) { log(`no image for ${c.slug}`); continue; }
  await payload.update({ collection: "categories", id: c.id, data: { image: id } });
  log(`${c.slug} → media #${id}`);
}
process.exit(0);
