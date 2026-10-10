#!/usr/bin/env bash
# Re-send leads marked "CRM sync failed" to GoHighLevel on the live site (or specific lead ids).
#   npm run ghl:resync            # everything marked failed
#   npm run ghl:resync -- 12 15   # just those lead ids
# Needs BACKUP_TOKEN in .env.local (the same value as on Railway). SITE_URL overrides the target, e.g. SITE_URL=http://localhost:3000.
set -euo pipefail
cd "$(dirname "$0")/.."
TOKEN=$(grep -E '^BACKUP_TOKEN=' .env.local | cut -d= -f2- | tr -d '"' )
URL=${SITE_URL:-https://niagaraequipment.com}
body="{}"; if [ "$#" -gt 0 ]; then ids=$(printf '%s,' "$@"); body="{\"ids\":[${ids%,}]}"; fi
curl -sS -X POST "$URL/api/leads/resync" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "$body" | python3 -m json.tool
