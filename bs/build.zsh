#!/usr/bin/env zsh
# Bundle the app to dist/ with content-hashed asset filenames.
set -euo pipefail

fingerprint() {
  local file="$1"
  local hash="${$(sha256sum "$file")%% *}"
  hash="${hash[1,8]}"
  local dir="${file:h}"
  local ext="${file:e}"
  local stem="${file:t:r}"
  local target="${dir}/${stem}-${hash}.${ext}"
  mv "$file" "$target"
  print -r -- "${target:t}"
}

rm -rf dist
mkdir -p dist

cp prose.md dist/prose.md
prose_asset="$(fingerprint dist/prose.md)"

cp src/styles.css dist/styles.css
styles_asset="$(fingerprint dist/styles.css)"

cp node_modules/katex/dist/katex.min.css dist/katex.min.css
katex_asset="$(fingerprint dist/katex.min.css)"

rsync -a --delete node_modules/katex/dist/fonts dist/

deno run -A npm:esbuild src/app.ts --bundle --format=esm \
  --alias:cycle=../../cycle/src/mod.ts \
  --define:ABOUT_TEXT_URL="'${prose_asset}'" \
  --outfile=dist/app.js
app_asset="$(fingerprint dist/app.js)"

sed \
  -e "s|href=\"katex.min.css\"|href=\"${katex_asset}\"|" \
  -e "s|href=\"styles.css\"|href=\"${styles_asset}\"|" \
  -e "s|src=\"app.js\"|src=\"${app_asset}\"|" \
  src/index.html > dist/index.html
