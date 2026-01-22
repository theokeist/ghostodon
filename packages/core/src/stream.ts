import { GhostodonError, wrapError } from "./errors.js";
import type { GStreamEvent, StreamName } from "./types.js";
import { normalizeNotification, normalizeStatus } from "./normalize.js";

/**
 * Discover streaming base URL.
 *
 * Mastodon docs: prefer `configuration.urls.streaming` from the instance endpoint.
 */
export async function discoverStreamingBase(origin: string): Promise<string> {
  try {
    // Try v2 instance endpoint.
    const r = await fetch(new URL("/api/v2/instance", origin));
    if (r.ok) {
      const j: any = await r.json();
      const s = j?.configuration?.urls?.streaming;
      if (s) return String(s);
    }

    // Fallback: hit /api/v1/streaming and follow redirect.
    const r2 = await fetch(new URL("/api/v1/streaming", origin), { redirect: "follow" });
    // If it redirected, the final URL will be on streaming host.
    if (r2.url && r2.url !== new URL("/api/v1/streaming", origin).toString()) {
      const u = new URL(r2.url);
      return `${u.protocol.replace("http", "ws")}//${u.host}`;
    }

    // Final fallback: use same host
    return origin.replace(/^http/, "ws");
  } catch (e) {
    throw wrapError(e, "STREAM_ERROR", "discoverStreamingBase failed");
  }
}

export function openStream(args: {
  origin: string;
  token: string;
  stream: StreamName;
  tag?: string;
  list?: string;
  onEvent: (ev: GStreamEvent) => void;
  onError?: (err: unknown) => void;
}): { close(): void } {
  let ws: WebSocket | null = null;
  let closed = false;

  (async () => {
    try {
      const base = await discoverStreamingBase(args.origin);
      const url = new URL("/api/v1/streaming", base);
      url.searchParams.set("access_token", args.token);
      url.searchParams.set("stream", args.stream);
      if (args.tag) url.searchParams.set("tag", args.tag);
      if (args.list) url.searchParams.set("list", args.list);

      ws = new WebSocket(url.toString());

      ws.addEventListener("message", (m) => {
        try {
          const msg = JSON.parse(String(m.data)) as { event?: string; payload?: string };
          const ev = String(msg.event ?? "");
          const payload = msg.payload ? JSON.parse(msg.payload) : null;

          if (ev === "update" && payload) {
            args.onEvent({ event: "update", status: normalizeStatus(payload), raw: msg });
            return;
          }
          if (ev === "notification" && payload) {
            args.onEvent({ event: "notification", notification: normalizeNotification(payload), raw: msg });
            return;
          }
          if (ev === "delete" && typeof payload === "string") {
            args.onEvent({ event: "delete", id: payload, raw: msg });
            return;
          }

          args.onEvent({ event: ev || "message", raw: msg });
        } catch (e) {
          args.onError?.(e);
        }
      });

      ws.addEventListener("error", (e) => args.onError?.(e));
    } catch (e) {
      args.onError?.(e);
    }
  })();

  return {
    close() {
      closed = true;
      try {
        ws?.close();
      } catch {}
      ws = null;
      void closed;
    },
  };
}

export function requireBrowserWebSocket() {
  if (typeof WebSocket === "undefined") {
    throw new GhostodonError({
      code: "STREAM_ERROR",
      message: "WebSocket is not available in this environment (need browser or WebSocket polyfill).",
    });
  }
}
