import { GhostodonError, wrapError } from "./errors.js";
import type { GStatus } from "./types.js";
import { normalizeStatus } from "./normalize.js";

export async function postStatus(
  masto: any,
  payload: {
    status: string;
    visibility?: "public" | "unlisted" | "private" | "direct";
    spoilerText?: string;
    sensitive?: boolean;
    language?: string;
    inReplyToId?: string;
    mediaIds?: string[];
  }
): Promise<GStatus> {
  try {
    const raw = await masto.v1.statuses.create({
      status: payload.status,
      visibility: payload.visibility,
      spoilerText: payload.spoilerText,
      sensitive: payload.sensitive,
      language: payload.language,
      inReplyToId: payload.inReplyToId,
      mediaIds: payload.mediaIds,
    });
    return normalizeStatus(raw);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "compose.post failed");
  }
}

/**
 * Upload media using /api/v2/media (async processing). Returns an attachment id.
 */
export async function mediaUpload(
  masto: any,
  args: { file: Blob; mimeType: string; description?: string }
): Promise<{ id: string }>
{
  try {
    // Masto.js has v2.media.create, but the exact method name varies by version.
    // We support both patterns.
    if (masto?.v2?.media?.create) {
      const res = await masto.v2.media.create({
        file: args.file,
        description: args.description,
      });
      return { id: String(res.id) };
    }

    // Fallback: direct fetch to /api/v2/media
    const url = new URL("/api/v2/media", masto?.config?.url ?? masto?.url ?? "").toString();
    if (!url) throw new GhostodonError({ code: "CONFIG_ERROR", message: "mediaUpload: missing base URL" });

    const form = new FormData();
    form.append("file", args.file, "upload");
    if (args.description) form.append("description", args.description);

    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${masto?.config?.accessToken ?? masto?.accessToken ?? ""}` },
      body: form,
    });

    if (!res.ok) {
      throw new GhostodonError({ code: "HTTP_ERROR", status: res.status, message: `mediaUpload failed: ${res.status}` });
    }
    const json: any = await res.json();
    return { id: String(json.id) };
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "compose.mediaUpload failed");
  }
}
