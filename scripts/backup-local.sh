#!/usr/bin/env bash
# Pull a copy of the live database and uploads from the Railway volume to ./backups/<date>/ on this Mac.
# Needs the Railway CLI logged in and linked to the nes-website project (railway status).
#   npm run backup:local            # database + uploads
#   npm run backup:local -- --db    # database only (seconds)
set -euo pipefail
cd "$(dirname "$0")/.."

stamp=$(date +%F_%H%M)
dest="backups/$stamp"
mkdir -p "$dest"

echo "→ database"
railway ssh -- tar czf - -C /data payload.db | tar xzf - -C "$dest"
sqlite3 "$dest/payload.db" "select 'leads: '||count(*) from leads; select 'machines: '||count(*) from machines;" 2>/dev/null || true

if [ "${1:-}" != "--db" ]; then
  echo "→ uploads (media + documents, this takes a few minutes)"
  railway ssh -- tar czf - -C /data uploads | tar xzf - -C "$dest"
fi

du -sh "$dest"
echo "Backup written to $dest"
