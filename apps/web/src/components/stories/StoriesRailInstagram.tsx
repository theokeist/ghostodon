import * as React from 'react';
import type { GStatus } from '@ghostodon/core';
import { useStoriesStore } from '@ghostodon/state';
import { cn } from '@ghostodon/ui';

type StoryAccount = {
  id: string;
  acct: string;
  displayName?: string;
  avatar: string;
  hasStory: boolean;
};

function buildStoriesFromStatuses(statuses: GStatus[]): StoryAccount[] {
  const map = new Map<string, StoryAccount>();

  for (const s0 of statuses) {
    const s = (s0 as any).reblog ?? s0;
    const a = s.account;
    if (!a) continue;

    const key = a.id || a.acct;
    const hasStory = (s.media?.length ?? 0) > 0;

    const prev = map.get(key);
    if (!prev) {
      map.set(key, {
        id: a.id || a.acct,
        acct: a.acct,
        displayName: a.displayName,
        avatar: a.avatar,
        hasStory,
      });
    } else if (hasStory && !prev.hasStory) {
      prev.hasStory = true;
    }
  }

  return Array.from(map.values());
}

/**
 * Stories rail for the feed.
 *
 * Mastodon has no native stories; we synthesize them from recent media posts.
 * Ring indicates: this account had media in the most recent fetched chunk.
 */
export default function StoriesRail(props: { statuses?: GStatus[]; className?: string }) {
  const openStory = useStoriesStore((s) => s.openStory);

  const stories = React.useMemo(() => {
    return props.statuses ? buildStoriesFromStatuses(props.statuses) : [];
  }, [props.statuses]);

  if (!props.statuses || stories.length === 0) return null;

  return (
    <div className={cn('ghost-stories', props.className)}>
      <div className="ghost-stories-inner">
        {stories.slice(0, 24).map((a) => (
          <button
            key={a.id}
            type="button"
            className="ghost-story"
            onClick={() => openStory(a.id || a.acct)}
            title={`Open story: @${a.acct}`}
          >
            <div className={cn('ghost-story-ring', a.hasStory ? 'ghost-story-ring--on' : 'ghost-story-ring--off')}>
              <div className="ghost-story-ring-inner">
                <img src={a.avatar} alt="" className="ghost-story-avatar" loading="lazy" />
              </div>
            </div>
            <div className="ghost-story-label">{(a.displayName || a.acct).slice(0, 14)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
