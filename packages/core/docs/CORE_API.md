# Ghostodon Core API

This is the **public function surface** for `@ghostodon/core`.

The app should import only from `@ghostodon/core` and treat it as a stable boundary.
Internally, `@ghostodon/core` uses **Masto.js** (`createRestAPIClient`) for Mastodon REST. citeturn1view0

## Top-level exports

- `createClient(session)` → `GhostodonClient`
- `auth.*` → OAuth PKCE + manual connect helpers
- Types: `Session`, `GStatus`, `GAccount`, `GNotification`, ...

## Session

A session is the minimal material required to access an account.

```ts
export type Session = {
  origin: string;
  token: string;
  accountId: string;
  acct: string;
};
```

### `auth.manualConnect({ origin, token })`
Validates a token and returns a complete `Session` (including `accountId`).

### `auth.registerApp({ origin, appName, redirectUri, scopes })`
Registers OAuth app credentials. Store per-origin.

### `auth.pkceStart({ app, origin, redirectUri, scopes })`
Returns `{ authorizeUrl, state, verifier }`. Persist `state` and `verifier` until callback.

### `auth.pkceFinish({ app, origin, redirectUri, code, verifier })`
Returns `{ token }`.

## Client namespaces

### `client.instance.get()`
Gets instance metadata and tries to read `configuration.urls.streaming` for correct streaming host discovery (recommended by Mastodon streaming docs). citeturn0search4

### `client.timelines.*`
- `home(params)`
- `public({ local?: boolean, ...page })`
- `list(listId, page)`

### `client.statuses.*`
- `get(id)`
- `context(id)`
- `favourite(id)`, `unfavourite(id)`
- `reblog(id)`, `unreblog(id)`
- `bookmark(id)`, `unbookmark(id)`

### `client.compose.*`
- `post(payload)`
- `mediaUpload({ file, mimeType, description })`

### `client.notifications.*`
- `list(page)`
- `dismiss(id)`, `dismissAll()`

### `client.search.query(q, params)`
Uses `/api/v2/search`.

### `client.lists.*`
CRUD + add/remove accounts.

### `client.stream.open({ stream, onEvent })`
Opens a websocket to `/api/v1/streaming` on the discovered streaming host.
Docs recommend `configuration.urls.streaming` from instance endpoint or following redirect. citeturn0search4turn0search2

## Error model

All functions throw `GhostodonError`:

```ts
throw new GhostodonError({
  code: "HTTP_ERROR",
  status: 401,
  message: "Unauthorized",
  cause
});
```

## Integration with state management

- **Zustand**: store session tokens, active account, theme, dashboard layout.
- **TanStack Query**: store timelines, thread data, notifications, search results.

When streaming events arrive, update TanStack Query caches (e.g., `queryClient.setQueryData`).
