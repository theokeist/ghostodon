import * as React from 'react';
import type { GStatus } from '@ghostodon/core';
import { useStoriesStore } from '@ghostodon/state';
import { cn } from '@ghostodon/ui';
import { buildStoriesFromStatuses } from './storyData';

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
                <img src={a.avatar} alt="" className="ghost-story-avatar" loading="lazy" decoding="async" />
              </div>
            </div>
            <div className="ghost-story-label">{(a.displayName || a.acct).slice(0, 14)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
