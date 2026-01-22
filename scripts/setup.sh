#!/usr/bin/env bash
set -e

# Ghostodon monorepo setup (bash)
# Usage:
#   ./scripts/setup.sh
#   ./scripts/setup.sh -- --fetch --build

echo ""
echo "=== Ghostodon setup ==="
echo ""

if command -v corepack >/dev/null 2>&1; then
  echo "corepack detected. Enabling..."
  corepack enable || true
  corepack prepare pnpm@9.15.0 --activate || corepack prepare pnpm@latest --activate || true
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found. Install Node.js, then rerun." >&2
  exit 1
fi

node "$(cd "$(dirname "$0")/.." && pwd)/scripts/setup.mjs" "$@"
