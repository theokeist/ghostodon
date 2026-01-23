import * as React from 'react';
import type { GStatus } from '@ghostodon/core';
import { useStoriesStore } from '@ghostodon/state';
import { cn } from '@ghostodon/ui';
import { buildStoriesFromStatuses } from './storyData';

function formatTime(value?: string): string {
  if (!value) return '';
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(dt);
}

/**
 * WhatsApp-style preview:
 * - Vertical list with segmented ring and update time.
 */
export default function StoriesRailWhatsApp(props: { statuses: GStatus[]; className?: string }) {
  const openStory = useStoriesStore((s) => s.openStory);

  const stories = React.useMemo(() => {
    return props.statuses ? buildStoriesFromStatuses(props.statuses) : [];
  }, [props.statuses]);

  if (!props.statuses || stories.length === 0) return null;

  return (
    <div className={cn('ghost-stories wa ghost-stories-wa', props.className)}>
      <div className="ghost-stories-wa-list">
        {stories.slice(0, 20).map((a) => {
          const time = formatTime(a.lastStatusAt);
          const segments = Math.min(6, Math.max(1, a.storyCount || 1));
          return (
            <button
              key={a.id}
              type="button"
              className="ghost-story-wa-item"
              onClick={() => openStory(a.id || a.acct)}
              title={`Open story: @${a.acct}`}
            >
              <div className="ghost-story-wa-ring" style={{ ['--seg' as any]: segments }}>
                <div className="ghost-story-wa-inner">
                  <img src={a.avatar} alt="" className="ghost-story-wa-avatar" loading="lazy" decoding="async" />
                </div>
              </div>
              <div className="ghost-story-wa-meta">
                <div className="ghost-story-wa-name">{a.displayName || a.acct}</div>
                <div className="ghost-story-wa-sub">
                  {a.storyCount ? `${a.storyCount} updates` : 'New'} {time ? `· ${time}` : ''}
                </div>
              </div>
              <div className="ghost-story-wa-time">{time}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
