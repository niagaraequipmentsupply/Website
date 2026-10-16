/**
 * Submit every URL in the live sitemap to IndexNow in one request (run after a large content change or a relaunch).
 * usage: npm run indexnow:all [-- https://niagaraequipment.com]
 * Reads INDEXNOW_KEY from .env.local; the site must be serving /<key>.txt.
 */
export {};
try { process.loadEnvFile(".env.local"); } catch { /* env already in the shell */ }
const base = (process.argv[2] ?? "https://niagaraequipment.com").replace(/\/$/, "");
const key = process.env.INDEXNOW_KEY?.trim();
if (!key) { console.error("INDEXNOW_KEY is not set"); process.exit(1); }
const xml = await (await fetch(`${base}/sitemap.xml`, { headers: { "user-agent": "Mozilla/5.0 (compatible; NES-IndexNow/1.0)" } })).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()).filter((u) => u.startsWith(base));
if (!urls.length) { console.error("no URLs found in the sitemap"); process.exit(1); }
const check = await fetch(`${base}/${key}.txt`);
if (check.status !== 200 || (await check.text()).trim() !== key) { console.error(`key file not served at ${base}/${key}.txt (status ${check.status}); deploy first`); process.exit(1); }
const res = await fetch("https://api.indexnow.org/indexnow", { method: "POST", headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify({ host: new URL(base).host, key, keyLocation: `${base}/${key}.txt`, urlList: urls.slice(0, 10000) }) });
console.log(`submitted ${urls.length} URLs → HTTP ${res.status} ${res.status === 200 || res.status === 202 ? "(accepted)" : await res.text()}`);
