import { wrapError } from "./errors.js";
import type { GContext, GStatus } from "./types.js";
import { normalizeContext, normalizeStatus } from "./normalize.js";

export async function getStatus(masto: any, id: string): Promise<GStatus> {
  try {
    const raw = await masto.v1.statuses.fetch(id);
    return normalizeStatus(raw);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "statuses.get failed");
  }
}

export async function getContext(masto: any, id: string): Promise<GContext> {
  try {
    const raw = await masto.v1.statuses.fetchContext(id);
    return normalizeContext(raw);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "statuses.context failed");
  }
}

export async function favourite(masto: any, id: string): Promise<GStatus> {
  try {
    const raw = await masto.v1.statuses.favourite(id);
    return normalizeStatus(raw);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "statuses.favourite failed");
  }
}

export async function unfavourite(masto: any, id: string): Promise<GStatus> {
  try {
    const raw = await masto.v1.statuses.unfavourite(id);
    return normalizeStatus(raw);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "statuses.unfavourite failed");
  }
}

export async function reblog(masto: any, id: string): Promise<GStatus> {
  try {
    const raw = await masto.v1.statuses.reblog(id);
    return normalizeStatus(raw);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "statuses.reblog failed");
  }
}

export async function unreblog(masto: any, id: string): Promise<GStatus> {
  try {
    const raw = await masto.v1.statuses.unreblog(id);
    return normalizeStatus(raw);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "statuses.unreblog failed");
  }
}

export async function bookmark(masto: any, id: string): Promise<GStatus> {
  try {
    const raw = await masto.v1.statuses.bookmark(id);
    return normalizeStatus(raw);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "statuses.bookmark failed");
  }
}

export async function unbookmark(masto: any, id: string): Promise<GStatus> {
  try {
    const raw = await masto.v1.statuses.unbookmark(id);
    return normalizeStatus(raw);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "statuses.unbookmark failed");
  }
}
