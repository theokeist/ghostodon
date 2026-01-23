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

function parseDate(value?: string): number {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function pickCover(status: GStatus): string | undefined {
  const media = status.media ?? [];
  if (media.length === 0) return status.account?.header || status.account?.avatar;
  const first = media[0];
  return first.previewUrl || first.url || status.account?.header || status.account?.avatar;
}

export function buildStoriesFromStatuses(statuses: GStatus[]): StoryAccount[] {
  const map = new Map<string, StoryAccount>();

  for (const s0 of statuses) {
    const s = (s0 as any).reblog ?? s0;
    const a = s.account;
    if (!a) continue;

    const key = a.id || a.acct;
    const hasStory = (s.media?.length ?? 0) > 0;
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
