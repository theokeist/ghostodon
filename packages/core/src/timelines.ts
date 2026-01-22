import { wrapError } from "./errors.js";
import type { GStatus, PageParams } from "./types.js";
import { normalizeStatus } from "./normalize.js";

export async function home(masto: any, params: PageParams = {}): Promise<GStatus[]> {
  try {
    const raw = await masto.v1.timelines.home.list({
      limit: params.limit ?? null,
      maxId: params.maxId ?? null,
      minId: params.minId ?? null,
      sinceId: params.sinceId ?? null,
    });
    return raw.map(normalizeStatus);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "timelines.home failed");
  }
}

export async function publicTimeline(
  masto: any,
  params: (PageParams & { local?: boolean; remote?: boolean; onlyMedia?: boolean }) = {}
): Promise<GStatus[]> {
  try {
    const raw = await masto.v1.timelines.public.list({
      limit: params.limit ?? null,
      maxId: params.maxId ?? null,
      minId: params.minId ?? null,
      sinceId: params.sinceId ?? null,
      local: params.local ?? null,
      remote: params.remote ?? null,
      onlyMedia: params.onlyMedia ?? null,
    });
    return raw.map(normalizeStatus);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "timelines.public failed");
  }
}

export async function listTimeline(masto: any, listId: string, params: PageParams = {}): Promise<GStatus[]> {
  try {
    const resource = masto.v1.timelines.list?.$select ? masto.v1.timelines.list.$select(listId) : masto.v1.timelines.list(listId);
    const raw = await resource.list({
      limit: params.limit ?? null,
      maxId: params.maxId ?? null,
      minId: params.minId ?? null,
      sinceId: params.sinceId ?? null,
    });
    return raw.map(normalizeStatus);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "timelines.list failed");
  }
}
