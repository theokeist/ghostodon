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

export async function listFollowers(masto: any, id: string, params: PageParams = {}): Promise<GAccount[]> {
  try {
    const api = masto?.v1?.accounts;
    if (!api) throw new Error('accounts API not available');
    const listFollowers = api.listFollowers ?? api.followers?.list ?? api.followers;
    if (typeof listFollowers !== 'function') throw new Error('accounts.followers not available');
    const raw = await listFollowers.call(api, id, {
      limit: params.limit,
      maxId: params.maxId,
      minId: params.minId,
      sinceId: params.sinceId,
    });
    return raw.map(normalizeAccount);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "accounts.followers failed");
  }
}

export async function listFollowing(masto: any, id: string, params: PageParams = {}): Promise<GAccount[]> {
  try {
    const api = masto?.v1?.accounts;
    if (!api) throw new Error('accounts API not available');
    const listFollowing = api.listFollowing ?? api.following?.list ?? api.following;
    if (typeof listFollowing !== 'function') throw new Error('accounts.following not available');
    const raw = await listFollowing.call(api, id, {
      limit: params.limit,
      maxId: params.maxId,
      minId: params.minId,
      sinceId: params.sinceId,
    });
    return raw.map(normalizeAccount);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "accounts.following failed");
  }
}

// Raw escape hatch (used internally by auth.manualConnect)
export async function verifyCredentialsRaw(masto: any): Promise<any> {
  return masto.v1.accounts.verifyCredentials();
}
