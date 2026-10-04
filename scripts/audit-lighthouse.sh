#!/usr/bin/env bash
# Lighthouse 12 on the local production build. usage: lh.sh BASE OUTDIR  (mobile + desktop for the key templates)
set -u
BASE=${1:-http://localhost:3001}; OUT=${2:-./lh}; mkdir -p "$OUT"
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
pages=( "/" "/inventory/excavators/r13-pro" "/inventory/excavators" "/builder/excavator" "/service" "/blog/rippa-first-25-hour-service" "/service-area/niagara-falls" "/financing" )
printf "%-48s %-7s %5s %5s %5s %5s | %7s %6s %6s %7s\n" page form perf a11y bp seo LCP CLS TBT SI
for p in "${pages[@]}"; do
  for form in mobile desktop; do
    name=$(echo "${p}-${form}" | tr '/?=' '___'); name=${name:-home}
    extra=""; [ "$form" = desktop ] && extra="--preset=desktop"
    npx lighthouse@12 "$BASE$p" --quiet --chrome-flags="--headless=new --no-sandbox" --output=json --output-path="$OUT/$name.json" $extra --only-categories=performance,accessibility,best-practices,seo >/dev/null 2>&1
    python3 - "$OUT/$name.json" "$p" "$form" <<'EOF'
import json,sys
try: d=json.load(open(sys.argv[1]))
except Exception as e: print(f"{sys.argv[2]:<48} {sys.argv[3]:<7} FAILED {e}"); sys.exit()
c=d["categories"]; a=d["audits"]
s=lambda k: int(round((c[k]["score"] or 0)*100))
print(f"{sys.argv[2]:<48} {sys.argv[3]:<7} {s('performance'):5} {s('accessibility'):5} {s('best-practices'):5} {s('seo'):5} | {a['largest-contentful-paint']['numericValue']/1000:6.2f}s {a['cumulative-layout-shift']['numericValue']:6.3f} {a['total-blocking-time']['numericValue']:5.0f}ms {a['speed-index']['numericValue']/1000:6.2f}s")
fails=[k for k,v in a.items() if v.get("score") is not None and v["score"]<0.9 and v.get("scoreDisplayMode") in ("binary","numeric") and k not in ("largest-contentful-paint","cumulative-layout-shift","total-blocking-time","speed-index","first-contentful-paint","interactive","max-potential-fid","server-response-time")]
if fails: print("      failing audits:", ", ".join(fails[:12]))
EOF
  done
done
