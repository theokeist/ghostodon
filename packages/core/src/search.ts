import { wrapError } from "./errors.js";
import type { GSearchResult } from "./types.js";
import { normalizeSearchResult } from "./normalize.js";

export async function searchQuery(
  masto: any,
  q: string,
  params: { type?: "accounts" | "hashtags" | "statuses"; limit?: number; resolve?: boolean } = {}
): Promise<GSearchResult> {
  try {
    const raw = await masto.v2.search.fetch({
      q,
      type: params.type,
      limit: params.limit,
      resolve: params.resolve,
    });
    return normalizeSearchResult(raw);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "search.query failed");
  }
}
