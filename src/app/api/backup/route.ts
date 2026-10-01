import { spawn } from "node:child_process";
import { Readable } from "node:stream";
import { timingSafeEqual } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createClient } from "@libsql/client";
import { uploadDir } from "@/lib/upload-dir";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Backup endpoint: streams a .tar.gz with a consistent SQLite snapshot (`VACUUM INTO`) and, with `?include=uploads`,
 * the media and documents folders. Protected by BACKUP_TOKEN (Authorization: Bearer …). Pulled nightly by
 * .github/workflows/backup.yml; usable manually with curl.
 */
function authorized(req: Request): boolean {
  const expected = process.env.BACKUP_TOKEN;
  if (!expected) return false;
  const given = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  const a = Buffer.from(given), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(req: Request) {
  if (!authorized(req)) return new Response("Unauthorized", { status: 401 });
  const includeUploads = new URL(req.url).searchParams.get("include") === "uploads";
  const dbUri = process.env.DATABASE_URI || "file:./payload.db";

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "nes-backup-"));
  const snapshot = path.join(tmp, "payload.db");
  try {
    const client = createClient({ url: dbUri });
    await client.execute(`VACUUM INTO '${snapshot.replace(/'/g, "''")}'`);
    client.close();
  } catch (err) {
    fs.rmSync(tmp, { recursive: true, force: true });
    console.error("[backup] snapshot failed", err);
    return new Response("Snapshot failed", { status: 500 });
  }

  const args = ["-czf", "-", "-C", tmp, "payload.db"];
  if (includeUploads) {
    for (const name of ["media", "documents"]) {
      const dir = path.resolve(uploadDir(name));
      if (fs.existsSync(dir)) args.push("-C", path.dirname(dir), path.basename(dir));
    }
  }
  const child = spawn("tar", args, { stdio: ["ignore", "pipe", "pipe"] });
  child.stderr.on("data", (d) => console.error("[backup] tar:", String(d)));
  child.on("close", () => fs.rmSync(tmp, { recursive: true, force: true }));
  child.on("error", (err) => { console.error("[backup] tar failed", err); fs.rmSync(tmp, { recursive: true, force: true }); });

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(Readable.toWeb(child.stdout) as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/gzip",
      "Content-Disposition": `attachment; filename="nes-backup-${stamp}-${includeUploads ? "full" : "db"}.tar.gz"`,
      "Cache-Control": "no-store",
    },
  });
}
