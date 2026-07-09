#!/usr/bin/env zsh
# Bundle the app to dist/ with esbuild.
mkdir -p dist
cp src/index.html src/styles.css prose.md dist/
cp node_modules/katex/dist/katex.min.css dist/
rsync -a --delete node_modules/katex/dist/fonts dist/
exec deno run -A npm:esbuild src/app.ts --bundle --format=esm \
  --alias:cycle=../../cycle/src/mod.ts --outfile=dist/app.js
