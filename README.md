# Ghostodon (pnpm monorepo)

PC-first Mastodon client (Web + Desktop) with a custom UI kit and workspace packages.

## Packages

- `@ghostodon/core` — API client, types, streaming discovery, PKCE helpers
- `@ghostodon/ui` — design system + shared components
- `@ghostodon/state` — Zustand stores + persistence
- `@ghostodon/plugins` — plugin registry + extension points
- `@ghostodon/desktop` — Tauri helper wrappers (safe runtime checks)
- `@ghostodon/web` — React app shell (3-pane)
- `@ghostodon/desktop-app` — Tauri wrapper app


## UX baseline (CODEX 1–5)

This repo includes a minimal baseline you can hand to CODEX:

1. **Stories in the feed** (synthetic): a horizontal rail above the timeline.
2. **Avatar story ring**: accounts with recent media in the fetched chunk show a ring.
3. **Story viewer overlay**: Instagram-like viewer that plays recent media posts.
4. **Thread + profile navigation**: open post thread (inspector) or profile from cards / viewer.
5. **Paged loading**: timelines and profile posts load **20 items first**, then **+10** (button + scroll sentinel).
   Comment preview expands with a lightweight prefetch on hover.

> Note: Mastodon has no native stories API. Ghostodon *derives* “stories” from recent media posts (`accounts.statuses?only_media=true`).


## Setup

Install pnpm (once):

```bash
npm i -g pnpm
```

Install dependencies (root):

```bash
pnpm install
```

Run web app:

```bash
pnpm dev
# or
pnpm --filter @ghostodon/web dev
```

Run Tauri desktop:

```bash
pnpm dev:desktop
```

## Adding more workspaces

### Add a new shared package

```bash
mkdir -p packages/foo/src
```

Create `packages/foo/package.json`:

```json
{
  "name": "@ghostodon/foo",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./src/index.ts"
    }
  }
}
```

Then depend on it from the web app:

```bash
pnpm --filter @ghostodon/web add @ghostodon/foo@workspace:*
```

### Add a new app

Create `apps/myapp` with its own `package.json` (name it `@ghostodon/myapp`) and it will be picked up automatically via `pnpm-workspace.yaml`.

---

Notes:
- `.npmrc` uses `node-linker=hoisted` to reduce Windows/TAURI friction.
- Internal deps use `workspace:*` for zero-version-drift.

## Setup (from repo root)

- **Cross-platform (recommended):**

```bash
pnpm setup
```

- Or run a platform script:

```bash
# Linux/macOS
./scripts/setup.sh

# Windows PowerShell
./scripts/setup.ps1
```

## Portable dependency store (optional)
If you want dependencies downloaded **into this repo folder** (useful for moving the project between machines or preparing for an offline install), this repo is configured with:

- `.npmrc`: `store-dir=.pnpm-store`

Commands:

```bash
pnpm fetch:deps         # downloads packages into .pnpm-store
pnpm install:offline    # installs using only .pnpm-store
```

Or run setup with fetching:

```bash
pnpm setup -- --fetch
```
