import { wrapError } from "./errors.js";
import type { GAccount, GStatus, PageParams } from "./types.js";
import { normalizeAccount, normalizeStatus } from "./normalize.js";

export async function verifyCredentials(masto: any): Promise<GAccount> {
  try {
    const raw = await masto.v1.accounts.verifyCredentials();
    return normalizeAccount(raw);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "accounts.verify failed");
  }
}

export async function lookupAccount(masto: any, query: string): Promise<GAccount> {
  try {
    // masto.js API has had different call signatures over time:
    // - some versions accept lookup(acct: string)
    // - others accept lookup({ acct: string })
    // Be defensive so profile loading doesn't randomly break on users' machines.
    const lookup = masto?.v1?.accounts?.lookup;
    if (typeof lookup !== 'function') {
      throw new Error('masto.v1.accounts.lookup is not available');
    }

    let raw: any;
    try {
      raw = await lookup(query);
    } catch {
      raw = await lookup({ acct: query });
    }
    return normalizeAccount(raw);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "accounts.lookup failed");
  }
}

export async function getAccount(masto: any, id: string): Promise<GAccount> {
  try {
    const raw = await masto.v1.accounts.fetch(id);
    return normalizeAccount(raw);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "accounts.get failed");
  }
}

export async function listAccountStatuses(
  masto: any,
  id: string,
  params: (PageParams & {
    pinned?: boolean;
    excludeReplies?: boolean;
    excludeReblogs?: boolean;
    onlyMedia?: boolean;
  }) = {}
): Promise<GStatus[]> {
  try {
    const raw = await masto.v1.accounts.listStatuses(id, {
      limit: params.limit,
      maxId: params.maxId,
      minId: params.minId,
      sinceId: params.sinceId,
      pinned: params.pinned ?? null,
      excludeReplies: params.excludeReplies ?? null,
      excludeReblogs: params.excludeReblogs ?? null,
      onlyMedia: params.onlyMedia ?? null,
    });
    return raw.map(normalizeStatus);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "accounts.statuses failed");
  }
}

// Raw escape hatch (used internally by auth.manualConnect)
export async function verifyCredentialsRaw(masto: any): Promise<any> {
  return masto.v1.accounts.verifyCredentials();
}
