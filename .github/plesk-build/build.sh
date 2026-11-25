#!/usr/bin/env bash
# Jalankan di Linux x86_64 atau Ubuntu WSL. Argumen: folder repositori, folder hasil.
set -euo pipefail

repo=$(realpath "${1:-.}")
out=$(realpath -m "${2:-$PWD}")
test "$(uname -s)-$(uname -m)" = Linux-x86_64 || { echo "Gunakan Linux x86_64." >&2; exit 1; }
rev=$(git -c safe.directory="$repo" -C "$repo" rev-parse --verify "${GALLERY_SOURCE_SHA:?Set GALLERY_SOURCE_SHA}^{commit}")
mkdir -p "$out"
stage=$(mktemp -d /tmp/seni-religi-build.XXXXXXXX)
pid=""
cleanup() {
  if [[ -n "$pid" ]]; then kill "$pid" 2>/dev/null || true; fi
  if [[ "$(dirname "$(realpath "$stage")")" = /tmp && "$(basename "$stage")" = seni-religi-build.* ]]; then
    rm -rf -- "$stage"
  fi
}
trap cleanup EXIT
mkdir "$stage/app" "$stage/test"
git -c safe.directory="$repo" -C "$repo" archive "$rev" | tar -xf - -C "$stage/app"

# Gunakan versi yang sama dengan Plesk dan verifikasi unduhan resmi sebelum dipakai.
cd "$stage"
node_release=node-v22.23.5-linux-x64
curl -fsSLO --retry 2 "https://nodejs.org/dist/v22.23.5/$node_release.tar.xz"
curl -fsSL --retry 2 https://nodejs.org/dist/v22.23.5/SHASUMS256.txt | awk -v f="$node_release.tar.xz" '$2==f' > checksums
sha256sum --check checksums
tar -xf "$node_release.tar.xz"
export PATH="$stage/$node_release/bin:$PATH"
export NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SANITY_DATASET=production

cd "$stage/app"
# Ambil hanya ID proyek dan versi API publik. Rahasia runtime tetap dikelola di hosting.
python3 - "$repo/.env.local" <<'PY'
import os, re, sys
from pathlib import Path

p = Path(sys.argv[1])
keys = ("NEXT_PUBLIC_SANITY_PROJECT_ID", "NEXT_PUBLIC_SANITY_API_VERSION")
values = {}
if p.exists():
    for line in p.read_text(encoding="utf-8-sig").splitlines():
        k, _, v = line.partition("=")
        if k in keys:
            values[k] = v.split("#", 1)[0].strip().strip("'\042")
for k in keys:
    if os.environ.get(k):
        values[k] = os.environ[k]
if not re.fullmatch(r"[a-z0-9-]+", values.get(keys[0], "")):
    sys.exit("Isi NEXT_PUBLIC_SANITY_PROJECT_ID di environment atau .env.local repositori.")
if keys[1] in values and not re.fullmatch(r"[0-9]{4}-[0-9]{2}-[0-9]{2}", values[keys[1]]):
    sys.exit("NEXT_PUBLIC_SANITY_API_VERSION harus berbentuk YYYY-MM-DD.")
values["NEXT_PUBLIC_SANITY_DATASET"] = "production"
Path(".env.production.local").write_text("".join(f"{k}={v}\n" for k,v in values.items()))
PY

# Terapkan konfigurasi khusus Plesk hanya pada salinan build.
mv next.config.ts plesk-base-config.ts
cat > next.config.ts <<'TS'
import config from "./plesk-base-config";
export default {
  ...config,
  output: "standalone" as const,
};
TS
npm ci --include=dev --no-audit --no-fund
npm run build
rt="$stage/app/.next/standalone"
cp -a public "$rt/public"
cp -a .next/static "$rt/.next/static"
python3 "$GALLERY_VERIFY_DIR/sanitize-runtime.py" "$rt" "$stage/app" "$repo"
tar --exclude='./.env*' -czf "$stage/release.tar.gz" -C "$rt" .
cp "$stage/release.tar.gz" "$out/candidate-${rev:0:7}.tar.gz"
tar -xzf "$stage/release.tar.gz" -C "$stage/test"
cd "$stage/test"
if [[ -n "$(find . \( -name '.env' -o -name '.env.local' -o -name '.env.production*' -o -name '.npmrc' \) -print)" ]]; then
  echo "Konfigurasi privat terdeteksi dalam paket." >&2
  exit 1
fi
runtime_size=$(du -sm . | cut -f1)
port=$(node -e "const s=require('node:net').createServer();s.listen(0,'127.0.0.1',()=>{console.log(s.address().port);s.close()})")
HOSTNAME=127.0.0.1 PORT="$port" NODE_ENV=production node server.js > "$stage/server.log" 2>&1 &
pid=$!
base="http://127.0.0.1:$port"
for n in {1..30}; do
  if ! kill -0 "$pid" 2>/dev/null; then cat "$stage/server.log"; exit 1; fi
  if curl -fsS --max-time 3 -o /dev/null "$base/" 2>/dev/null; then break; fi
  sleep 1
done
for path in / /aktivitas /prestasi /studio /sitemap.xml /googled76516f4abe12856.html; do
  curl -fsSL --max-time 20 -w "$path %{http_code}\n" "$base$path" -o "$stage/http-body"
  if [[ "$path" = / ]]; then grep -qi 'seni religi' "$stage/http-body"; fi
  if [[ "$path" = /sitemap.xml ]]; then grep -q '<urlset' "$stage/http-body"; fi
  if [[ "$path" = /googled76516f4abe12856.html ]]; then cmp "$stage/http-body" "public$path"; fi
done
css=$(find .next/static -name '*.css' -print -quit)
test -n "$css"
curl -fsS --max-time 20 -o /dev/null "$base/_next/${css#.next/}"
curl -fsS --max-time 20 -o /dev/null "$base/_next/image?url=%2Flogo.png&w=640&q=75"

python3 "$GALLERY_VERIFY_DIR/check-prestasi.py" "$base"
test -f node_modules/@img/sharp-linux-x64/package.json
test -z "$(find node_modules -type d -name '*win32*' -print -quit)"
test -z "$(find . -type l -print -quit)"
printf 'Verified the Linux x64 standalone with nine rendered achievements, homepage, news, Studio, sitemap, and image optimizer.\n'
