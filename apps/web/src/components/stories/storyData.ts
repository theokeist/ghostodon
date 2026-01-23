import type { GStatus } from '@ghostodon/core';

type StoryAccount = {
  id: string;
  acct: string;
  displayName?: string;
  avatar: string;
  hasStory: boolean;
  coverUrl?: string;
  lastStatusAt?: string;
  storyCount: number;
};

type StoryMedia = {
  id: string;
  url?: string;
  previewUrl?: string;
  description?: string | null;
};

type StoryAccountSnapshot = {
  id: string;
  acct: string;
  displayName?: string;
  avatar: string;
  header?: string;
};

function parseDate(value?: string): number {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function pickAccount(a: any): StoryAccountSnapshot {
  const avatar =
    a?.avatar ??
    a?.avatar_static ??
    a?.avatarStatic ??
    a?.avatar_url ??
    a?.avatarUrl ??
    '';
  const header =
    a?.header ??
    a?.header_static ??
    a?.headerStatic ??
    a?.header_url ??
    a?.headerUrl;

  return {
    id: String(a?.id ?? ''),
    acct: String(a?.acct ?? ''),
    displayName: a?.displayName ?? a?.display_name,
    avatar: String(avatar ?? ''),
    header: header ? String(header) : undefined,
  };
}

function normalizeMedia(m: any): StoryMedia {
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
    id: String(m?.id ?? ''),
    url: url ? String(url) : undefined,
    previewUrl: previewUrl ? String(previewUrl) : undefined,
    description: m?.description ?? null,
  };
}

export function getStoryMedia(status: any): StoryMedia[] {
  const media =
    status?.media ??
    status?.media_attachments ??
    status?.mediaAttachments ??
    [];
  if (!Array.isArray(media)) return [];
  return media.map(normalizeMedia);
}

function pickCover(status: GStatus): string | undefined {
  const media = getStoryMedia(status);
  const account = pickAccount(status.account);
  if (media.length === 0) return account.header || account.avatar;
  const first = media[0];
  return first.previewUrl || first.url || account.header || account.avatar;
}

export function buildStoriesFromStatuses(statuses: GStatus[]): StoryAccount[] {
  const map = new Map<string, StoryAccount>();

  for (const s0 of statuses) {
    const s = (s0 as any).reblog ?? s0;
    const a = pickAccount(s.account);
    if (!a.id && !a.acct) continue;

    const key = a.id || a.acct;
    const media = getStoryMedia(s);
    const hasStory = media.length > 0;
    const createdAt = parseDate(s.createdAt);

    const prev = map.get(key);
    if (!prev) {
      map.set(key, {
        id: a.id || a.acct,
        acct: a.acct,
        displayName: a.displayName,
        avatar: a.avatar,
        hasStory,
        coverUrl: pickCover(s),
        lastStatusAt: s.createdAt,
        storyCount: hasStory ? 1 : 0,
      });
      continue;
    }

    if (hasStory) prev.storyCount += 1;
    if (hasStory && !prev.hasStory) prev.hasStory = true;

    const prevDate = parseDate(prev.lastStatusAt);
    if (createdAt >= prevDate) {
      prev.lastStatusAt = s.createdAt;
      prev.coverUrl = pickCover(s) || prev.coverUrl;
    }
  }

  return Array.from(map.values());
}
