/**
 * Launch content clean-up for the blog:
 *  1. Clear any personal author profile from posts (the site bylines the service team, not an individual) and remove
 *     the author records so no personal name or Person schema appears on the site.
 *  2. Retire the two fictional sample posts (the invented "field call" and the invented "RS06 recall") as drafts.
 *  3. Remove unverifiable claims from the remaining starter posts and fix a transport-width figure.
 * Re-runnable.   npx payload run src/scripts/seed-authors.ts
 */
import { getPayload } from "payload";
import config from "@payload-config";

const payload = await getPayload({ config });
const log = (m: string) => console.log(`[seed-authors] ${m}`);

// ---- 1. No personal authors ------------------------------------------------------------------------------------
const BYLINE = "Niagara Equipment Supply service team";
const existingAuthors = await payload.find({ collection: "authors", limit: 50, depth: 0 });

// ---- 2 + 3. Posts ---------------------------------------------------------------------------------------------
const RETIRE = new Set(["field-call-r18-quick-coupler-leak", "rs06-overheating-fan-recall"]);
const EDITS: Record<string, [string, string][]> = {
  "rippa-first-25-hour-service": [
    ["Owners on the RIPPA forum report doing a full fluid change at 22 to 25 hours and finding fine metal in the hydraulic oil with nothing alarming. Get it out early and the system runs clean for years.", "Change the fluids at 25 hours and that first batch of wear metal comes out before it circulates through the pump and valves for another hundred hours."],
    ["Main relief / breakout pressure against spec, because some machines leave the factory set low", "Main relief pressure against the factory spec"],
    ["Here's exactly what our technicians change at 25 hours", "Here's what we change at 25 hours"],
  ],
  "haul-rippa-mini-excavator-pickup-trailer": [
    ["1,650 to 4,300 lb operating weight", "1,630 to 4,400 lb operating weight"],
    ["Every compact RIPPA has retractable tracks. The R06 ECO narrows to 2 ft 5 in, the R13 PRO to 2 ft 9 in, the R10 and R15 to just under 3 ft, and the R18 PRO to 3 ft 3 in.", "Every compact RIPPA has retractable tracks. The R06 ECO narrows to 2 ft 5 in, the R13 PRO to 2 ft 9 in, the R10 ECO to just under 3 ft, and the R15 ECO and R18 PRO to about 3 ft 3 in."],
  ],
};

type Node = { type?: string; text?: string; children?: Node[] } & Record<string, unknown>;
const replaceText = (node: Node, pairs: [string, string][]): number => {
  let n = 0;
  if (typeof node.text === "string") for (const [from, to] of pairs) if (node.text.includes(from)) { node.text = node.text.replace(from, to); n++; }
  for (const child of node.children ?? []) n += replaceText(child, pairs);
  return n;
};

const posts = await payload.find({ collection: "posts", limit: 200, depth: 0, draft: true });
for (const p of posts.docs) {
  const data: Record<string, unknown> = { writer: null, author: BYLINE };
  const edits = EDITS[p.slug];
  if (edits) {
    const content = JSON.parse(JSON.stringify(p.content)) as { root: Node };
    const n = replaceText(content.root, edits);
    if (n) data.content = content;
    for (const [from, to] of edits) if (p.excerpt?.includes(from)) data.excerpt = p.excerpt.replace(from, to);
    log(`${p.slug}: ${n} text edit(s)`);
  }
  if (RETIRE.has(p.slug)) { data._status = "draft"; log(`${p.slug}: unpublished (draft)`); }
  await payload.update({ collection: "posts", id: p.id, data: data as never, ...(RETIRE.has(p.slug) ? {} : {}) });
}
log(`${posts.docs.length} posts updated with the team byline`);
for (const a of existingAuthors.docs) { await payload.delete({ collection: "authors", id: a.id }); log(`removed author profile #${a.id}`); }

process.exit(0);
