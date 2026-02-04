import { wrapError } from "./errors.js";
import type { GAccount } from "./types.js";
import { normalizeAccount } from "./normalize.js";

export async function listDirectory(
  masto: any,
  params: { limit?: number; offset?: number; order?: "active" | "new"; local?: boolean } = {}
): Promise<GAccount[]> {
  try {
    const raw = await masto.v1.directory.list({
      limit: params.limit ?? null,
      offset: params.offset ?? null,
      order: params.order ?? null,
      local: params.local ?? null,
    });
    return raw.map(normalizeAccount);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "directory.list failed");
  }
}
