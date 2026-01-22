import { GhostodonError, wrapError } from "./errors.js";
import type { Session, GAccount } from "./types.js";
import { normalizeAccount } from "./normalize.js";
import { createClient } from "./client.js";

export type OAuthApp = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  name: string;
  website?: string;
  raw?: unknown;
};

function base64Url(bytes: Uint8Array): string {
  const bin = String.fromCharCode(...bytes);
  const b64 = btoa(bin);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sha256(input: string): Promise<Uint8Array> {
  const enc = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return new Uint8Array(digest);
}

function randomString(len = 64): string {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

/**
 * Register an OAuth app on an instance.
 *
 * Uses the Mastodon API method: POST /api/v1/apps
 */
export async function registerApp(args: {
  origin: string;
  appName: string;
  redirectUri: string;
  scopes: string[];
  website?: string;
}): Promise<OAuthApp> {
  try {
    const url = new URL("/api/v1/apps", args.origin).toString();

    const body = new URLSearchParams();
    body.set("client_name", args.appName);
    body.set("redirect_uris", args.redirectUri);
    body.set("scopes", args.scopes.join(" "));
    if (args.website) body.set("website", args.website);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) {
      throw new GhostodonError({
        code: "HTTP_ERROR",
        status: res.status,
        message: `registerApp failed: ${res.status} ${res.statusText}`,
      });
    }
    const json: any = await res.json();
    return {
      clientId: String(json.client_id),
      clientSecret: String(json.client_secret),
      redirectUri: args.redirectUri,
      name: args.appName,
      website: args.website,
      raw: json,
    };
  } catch (e) {
    throw wrapError(e, "AUTH_ERROR", "registerApp failed");
  }
}

/**
 * Start OAuth Authorization Code flow with PKCE.
 *
 * Mastodon supports PKCE (S256).
 */
export async function pkceStart(args: {
  app: OAuthApp;
  origin: string;
  redirectUri: string;
  scopes: string[];
}): Promise<{ authorizeUrl: string; state: string; verifier: string }> {
  try {
    const state = randomString(32);
    const verifier = randomString(64);
    const challenge = base64Url(await sha256(verifier));

    const u = new URL("/oauth/authorize", args.origin);
    u.searchParams.set("response_type", "code");
    u.searchParams.set("client_id", args.app.clientId);
    u.searchParams.set("redirect_uri", args.redirectUri);
    u.searchParams.set("scope", args.scopes.join(" "));
    u.searchParams.set("state", state);
    u.searchParams.set("code_challenge", challenge);
    u.searchParams.set("code_challenge_method", "S256");

    return { authorizeUrl: u.toString(), state, verifier };
  } catch (e) {
    throw wrapError(e, "AUTH_ERROR", "pkceStart failed");
  }
}

/**
 * Finish PKCE flow: exchange authorization code to token.
 *
 * Uses POST /oauth/token
 */
export async function pkceFinish(args: {
  app: OAuthApp;
  origin: string;
  redirectUri: string;
  code: string;
  verifier: string;
}): Promise<{ token: string }> {
  try {
    const url = new URL("/oauth/token", args.origin).toString();

    const body = new URLSearchParams();
    body.set("grant_type", "authorization_code");
    body.set("client_id", args.app.clientId);
    body.set("client_secret", args.app.clientSecret);
    body.set("redirect_uri", args.redirectUri);
    body.set("code", args.code);
    body.set("code_verifier", args.verifier);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) {
      throw new GhostodonError({
        code: "HTTP_ERROR",
        status: res.status,
        message: `pkceFinish failed: ${res.status} ${res.statusText}`,
      });
    }
    const json: any = await res.json();
    return { token: String(json.access_token) };
  } catch (e) {
    throw wrapError(e, "AUTH_ERROR", "pkceFinish failed");
  }
}

/**
 * Manual token connect (fallback): verifies token and returns a complete Session.
 */
export async function manualConnect(args: {
  origin: string;
  token: string;
}): Promise<Session & { account: GAccount }> {
  try {
    const client = createClient({ origin: args.origin, token: args.token, accountId: "", acct: "" } as any);
    const acctRaw = await client.accounts.verifyRaw();
    const account = normalizeAccount(acctRaw);

    const session: Session = {
      origin: args.origin,
      token: args.token,
      accountId: account.id,
      acct: account.acct,
    };

    return { ...session, account };
  } catch (e) {
    throw wrapError(e, "AUTH_ERROR", "manualConnect failed");
  }
}
