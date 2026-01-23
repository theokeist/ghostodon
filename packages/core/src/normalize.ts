import type { GAccount, GMedia, GNotification, GSearchResult, GStatus, GContext, GInstance } from "./types.js";

// These normalizers keep your UI insulated from Masto.js entity shapes.
// We keep `raw` for escape hatches.

export function normalizeAccount(a: any): GAccount {
  const avatar =
    a?.avatar ??
    a?.avatar_static ??
    a?.avatarStatic ??
    a?.avatar_url ??
    a?.avatarUrl ??
    "";
  const header =
    a?.header ??
    a?.header_static ??
    a?.headerStatic ??
    a?.header_url ??
    a?.headerUrl;

  return {
    id: String(a?.id ?? ""),
    acct: String(a?.acct ?? ""),
    displayName: String(a?.displayName ?? a?.display_name ?? ""),
    avatar: String(avatar ?? ""),
    header: header ? String(header) : undefined,
    url: a?.url ? String(a.url) : undefined,
    noteHtml: a?.note ? String(a.note) : undefined,
    followersCount: asNum(a?.followersCount ?? a?.followers_count),
    followingCount: asNum(a?.followingCount ?? a?.following_count),
    statusesCount: asNum(a?.statusesCount ?? a?.statuses_count),
    locked: typeof a?.locked === 'boolean' ? a.locked : undefined,
    bot: typeof a?.bot === 'boolean' ? a.bot : undefined,
    raw: a,
  };
}

export function normalizeMedia(m: any): GMedia {
  const url =
    m?.url ??
    m?.media_url ??
    m?.mediaUrl ??
    m?.remote_url ??
    m?.remoteUrl;
  const previewUrl =
    m?.previewUrl ??
    m?.preview_url ??
    m?.preview ??
    m?.previewUrl;

  return {
    id: String(m?.id ?? ""),
    type: m?.type ? String(m.type) : undefined,
    url: url ? String(url) : undefined,
    previewUrl: previewUrl ? String(previewUrl) : undefined,
    description: m?.description ?? null,
    raw: m,
  };
}

function asNum(v: any): number | undefined {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : undefined;
}

export function normalizeStatus(s: any): GStatus {
  const account = normalizeAccount(s?.account);
  const media = Array.isArray(s?.mediaAttachments)
    ? s.mediaAttachments.map(normalizeMedia)
    : Array.isArray(s?.media_attachments)
      ? s.media_attachments.map(normalizeMedia)
      : [];

  const reblogRaw = s?.reblog ?? s?.rebloggedStatus ?? null;

  return {
    id: String(s?.id ?? ""),
    createdAt: String(s?.createdAt ?? s?.created_at ?? ""),
    editedAt: s?.edited_at ? String(s.edited_at) : (s?.editedAt ? String(s.editedAt) : undefined),
    url: s?.url ? String(s.url) : undefined,
    contentHtml: String(s?.content ?? ""),
    spoilerText: s?.spoilerText
      ? String(s.spoilerText)
      : s?.spoiler_text
        ? String(s.spoiler_text)
        : undefined,
    sensitive: typeof s?.sensitive === "boolean" ? s.sensitive : undefined,
    visibility: (s?.visibility ?? undefined) as any,
    inReplyToId: s?.in_reply_to_id ? String(s.in_reply_to_id) : (s?.inReplyToId ? String(s.inReplyToId) : undefined),
    reblog: reblogRaw ? normalizeStatus(reblogRaw) : undefined,
    repliesCount: asNum(s?.replies_count ?? s?.repliesCount),
    reblogsCount: asNum(s?.reblogs_count ?? s?.reblogsCount),
    favouritesCount: asNum(s?.favourites_count ?? s?.favouritesCount),
    account,
    media,
    language: s?.language ? String(s.language) : undefined,
    raw: s,
  };
}

export function normalizeContext(c: any): GContext {
  return {
    ancestors: Array.isArray(c?.ancestors) ? c.ancestors.map(normalizeStatus) : [],
    descendants: Array.isArray(c?.descendants) ? c.descendants.map(normalizeStatus) : [],
  };
}

export function normalizeNotification(n: any): GNotification {
  return {
    id: String(n?.id ?? ""),
    type: String(n?.type ?? ""),
    createdAt: String(n?.createdAt ?? n?.created_at ?? ""),
    account: n?.account ? normalizeAccount(n.account) : undefined,
    status: n?.status ? normalizeStatus(n.status) : undefined,
    raw: n,
  };
}

export function normalizeSearchResult(r: any): GSearchResult {
  return {
    accounts: Array.isArray(r?.accounts) ? r.accounts.map(normalizeAccount) : [],
    statuses: Array.isArray(r?.statuses) ? r.statuses.map(normalizeStatus) : [],
    hashtags: Array.isArray(r?.hashtags)
      ? r.hashtags.map((h: any) => ({ name: String(h?.name ?? ""), url: h?.url ? String(h.url) : undefined, raw: h }))
      : [],
    raw: r,
  };
}

export function normalizeInstance(i: any): GInstance {
  const streamingBase = i?.configuration?.urls?.streaming ? String(i.configuration.urls.streaming) : undefined;
  return {
    title: i?.title ? String(i.title) : undefined,
    version: i?.version ? String(i.version) : undefined,
    descriptionHtml: i?.description ? String(i.description) : (i?.shortDescription ? String(i.shortDescription) : undefined),
    streamingBase,
    raw: i,
  };
}
