import { wrapError } from "./errors.js";
import type { GTag } from "./types.js";
import { normalizeTag } from "./normalize.js";

export async function listTrendTags(masto: any, params: { limit?: number } = {}): Promise<GTag[]> {
  try {
    const raw = await masto.v1.trends.tags.list({
      limit: params.limit ?? null,
    });
    return raw.map(normalizeTag);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "trends.tags failed");
  }
}
