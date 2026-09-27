/**
 * Attach cover images to blog posts from seed-assets/posts/<slug>.jpg (generated with Higgsfield). Re-runnable.
 *   npx payload run src/scripts/seed-post-covers.ts
 */
import path from "path";
import fs from "fs";
import { getPayload } from "payload";
import config from "@payload-config";

const DIR = path.resolve("seed-assets/posts");
const payload = await getPayload({ config });
const posts = await payload.find({ collection: "posts", limit: 500, depth: 0, draft: true });
let n = 0;
for (const p of posts.docs) {
  const file = path.join(DIR, `${p.slug}.jpg`);
  if (!fs.existsSync(file)) { payload.logger.info(`no cover for ${p.slug}`); continue; }
  const filename = `post-${p.slug}.jpg`;
  const ex = await payload.find({ collection: "media", where: { filename: { equals: filename } }, limit: 1 });
  let id = ex.docs[0]?.id;
  if (!id) { const tmp = path.join(DIR, filename); fs.copyFileSync(file, tmp); try { id = (await payload.create({ collection: "media", data: { alt: p.title }, filePath: tmp })).id; } finally { fs.rmSync(tmp, { force: true }); } }
  await payload.update({ collection: "posts", id: p.id, data: { cover: id } });
  n++; payload.logger.info(`${p.slug} → media #${id}`);
}
payload.logger.info(`Set ${n} post covers`);
process.exit(0);
