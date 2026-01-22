import * as React from 'react';
import type { GStatus } from '@ghostodon/core';
import { useStoriesStore, useInspectorStore } from '@ghostodon/state';
import { cn } from '@ghostodon/ui';
import { buildStoriesFromStatuses } from './storyData';

/**
 * Facebook-style preview:
 * - Card tiles with cover media + name overlay.
 * - Includes a "Create story" CTA.
 */
export default function StoriesRailFacebook(props: { statuses: GStatus[]; className?: string }) {
  const openStory = useStoriesStore((s) => s.openStory);
  const setInspector = useInspectorStore((s) => s.setInspector);

  const stories = React.useMemo(() => {
    return props.statuses ? buildStoriesFromStatuses(props.statuses) : [];
  }, [props.statuses]);

  if (!props.statuses || stories.length === 0) return null;

  return (
    <div className={cn('ghost-stories fb ghost-stories-fb', props.className)}>
      <div className="ghost-stories-fb-grid">
        <button
          type="button"
          className="ghost-story-card ghost-story-card--create"
          onClick={() => setInspector({ type: 'compose' })}
        >
          <div className="ghost-story-card-cover ghost-story-card-cover--create" />
          <div className="ghost-story-card-meta">
            <div className="ghost-story-card-plus">+</div>
            <div className="ghost-story-card-title">Create story</div>
          </div>
        </button>
        {stories.slice(0, 12).map((a) => (
          <button
            key={a.id}
            type="button"
            className="ghost-story-card"
            onClick={() => openStory(a.id || a.acct)}
            title={`Open story: @${a.acct}`}
          >
            <div className="ghost-story-card-cover">
              <img src={a.coverUrl || a.avatar} alt="" loading="lazy" decoding="async" />
            </div>
            <div className="ghost-story-card-meta">
              <div className="ghost-story-card-name">{(a.displayName || a.acct).slice(0, 18)}</div>
              <div className="ghost-story-card-handle">@{a.acct}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
