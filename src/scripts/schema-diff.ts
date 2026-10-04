/**
 * Print the SQL statements the dev schema push would run against the current database, without executing them.
 *   PAYLOAD_PUSH=false npx payload run src/scripts/schema-diff.ts            # print
 *   PAYLOAD_PUSH=false OUT=push.sql npx payload run src/scripts/schema-diff.ts  # write to a file to apply by hand (sqlite3 -bail payload.db < push.sql)
 */
import { getPayload } from "payload";
import config from "@payload-config";
import { pushSQLiteSchema } from "drizzle-kit/api";

const payload = await getPayload({ config });
const db = payload.db as unknown as { schema: Record<string, unknown>; drizzle: never };
const { statementsToExecute, hasDataLoss, warnings } = await pushSQLiteSchema(db.schema, db.drizzle);
console.log(`-- ${statementsToExecute.length} statement(s); dataLoss=${hasDataLoss}; warnings=${JSON.stringify(warnings)}`);
for (const s of statementsToExecute) console.log(s.length > 400 && !process.env.FULL ? s.slice(0, 400) + " …" : s);
if (process.env.OUT) { const { writeFileSync } = await import("node:fs"); writeFileSync(process.env.OUT, statementsToExecute.map((s) => s.trim().replace(/;?$/, ";")).join("\n") + "\n"); console.log(`written to ${process.env.OUT}`); }
process.exit(0);
