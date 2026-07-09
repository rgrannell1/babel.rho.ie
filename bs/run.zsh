#!/usr/bin/env zsh
# Serve the built site locally.
exec deno run --allow-net --allow-read jsr:@std/http/file-server dist
