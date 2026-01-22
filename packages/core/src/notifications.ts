import { wrapError } from "./errors.js";
import type { GNotification, PageParams } from "./types.js";
import { normalizeNotification } from "./normalize.js";

export async function listNotifications(masto: any, params: PageParams = {}): Promise<GNotification[]> {
  try {
    const raw = await masto.v1.notifications.list({
      limit: params.limit ?? null,
      maxId: params.maxId ?? null,
      minId: params.minId ?? null,
      sinceId: params.sinceId ?? null,
    });
    return raw.map(normalizeNotification);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "notifications.list failed");
  }
}

export async function dismissNotification(masto: any, id: string): Promise<void> {
  try {
    await masto.v1.notifications.dismiss(id);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "notifications.dismiss failed");
  }
}

export async function dismissAllNotifications(masto: any): Promise<void> {
  try {
    await masto.v1.notifications.dismissAll();
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "notifications.dismissAll failed");
  }
}
