# @ghostodon/core

Thin, documented Mastodon-only API surface for Ghostodon.

Design goals:
- **Don’t** call `masto` directly from the app; call this package.
- Keep types **stable** (normalize to Ghostodon types).
- Support **OAuth PKCE** and **Manual Token** connection (fallback).
- Streaming support with correct **streaming host discovery** via instance configuration.

## Install (pnpm workspace)

```bash
pnpm --filter @ghostodon/core add masto
```

## Quick start (Manual token)

```ts
import { auth, createClient } from "@ghostodon/core";

const session = await auth.manualConnect({
  origin: "https://mastodon.social",
  token: "PASTE_TOKEN"
});

const client = createClient(session);
const home = await client.timelines.home({ limit: 20 });
console.log(home[0]?.account.acct);
```

## Quick start (OAuth PKCE)

```ts
import { auth } from "@ghostodon/core";

// 1) register or reuse app per origin
const app = await auth.registerApp({
  origin: "https://mastodon.social",
  appName: "Ghostodon",
  redirectUri: "http://127.0.0.1:5173/auth/callback",
  scopes: ["read", "write", "follow"]
});

// 2) build authorize URL
const { authorizeUrl, state, verifier } = await auth.pkceStart({
  app,
  origin: "https://mastodon.social",
  redirectUri: "http://127.0.0.1:5173/auth/callback",
  scopes: ["read", "write", "follow"]
});

// Redirect the user to authorizeUrl.
// Save {state, verifier} in your UI state.

// 3) In callback, exchange code -> token
const { token } = await auth.pkceFinish({
  app,
  origin: "https://mastodon.social",
  redirectUri: "http://127.0.0.1:5173/auth/callback",
  code: "CODE_FROM_CALLBACK",
  verifier
});
```

## Bird’s-eye patterns

- **Radar columns**: call `timelines.home/public/list()` with pagination.
- **Signals**: `notifications.list()` plus streaming `notification` events.
- **Inspector thread view**: `statuses.get()` + `statuses.context()`.

## Docs
- `docs/CORE_API.md` – full function surface + usage.

> Note: This package uses the official Mastodon HTTP APIs and Masto.js as the transport client.
