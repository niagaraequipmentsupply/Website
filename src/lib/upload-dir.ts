import path from "node:path";

/**
 * Where Payload stores uploaded files. Locally this is ./media and ./documents in the repo.
 * On a host with a persistent volume set UPLOAD_DIR (e.g. /data/uploads) so files survive deploys.
 */
export function uploadDir(name: string): string {
  const base = process.env.UPLOAD_DIR;
  return base ? path.join(base, name) : name;
}
