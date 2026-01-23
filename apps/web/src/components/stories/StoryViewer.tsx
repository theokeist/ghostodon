import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import type { GAccount, GStatus } from '@ghostodon/core';
import { Button } from '@ghostodon/ui';
import { useGhostodon } from '../../lib/useClient';
import { getStoryMedia } from './storyData';
import { useInspectorStore, useStoriesStore, useUiPrefsStore } from '@ghostodon/state';

function isIdLike(v: string): boolean {
  return /^\d+$/.test(v);
}

async function resolveAccount(client: any, acctOrId: string): Promise<GAccount> {
  const q = acctOrId.replace(/^@/, '').trim();
  if (isIdLike(q)) return client.accounts.get(q);
  try {
    return await client.accounts.lookup(q);
  } catch {
    const res = await client.search.query(q, { type: 'accounts', resolve: true, limit: 1 });
    const a = res.accounts?.[0];
    if (!a?.id) throw new Error('Account not found');
    return a;
  }
}

type Slide = {
  key: string;
  kind: 'image' | 'text';
  src?: string;
  alt?: string;
  status: GStatus;
};

function buildSlides(statuses: GStatus[]): Slide[] {
  const slides: Slide[] = [];
  for (const s0 of statuses) {
    const s = (s0 as any).reblog ?? s0;
    const media = getStoryMedia(s);
    const contentHtml = s.contentHtml ?? s.content ?? '';
    if (media.length > 0) {
      for (const m of media) {
        slides.push({
          key: `${s.id}:${m.id}`,
          kind: 'image',
          src: m.url || m.previewUrl,
          alt: m.description || '',
          status: s,
        });
      }
    } else {
      slides.push({
        key: `${s.id}:text`,
        kind: 'text',
        status: {
          ...s,
          contentHtml,
        },
      });
    }
  }
  return slides;
}

/**
 * StoryViewer
 *
 * Mastodon doesn't have native stories. We emulate an "Instagram-like" story viewer
 * by showing recent media posts from the selected account.
 */
export default function StoryViewer() {
  const storyStyle = useUiPrefsStore((s) => s.storyStyle);
  const { client, sessionKey } = useGhostodon();
  const setInspector = useInspectorStore((s) => s.setInspector);
  const open = useStoriesStore((s) => s.open);
  const acctOrId = useStoriesStore((s) => s.acctOrId);
  const index = useStoriesStore((s) => s.index);
  const setIndex = useStoriesStore((s) => s.setIndex);
  const closeStory = useStoriesStore((s) => s.closeStory);

  const accountQ = useQuery({
    queryKey: ['story-account', acctOrId, sessionKey],
    enabled: Boolean(client) && Boolean(open) && Boolean(acctOrId),
    queryFn: async () => {
      if (!client) throw new Error('Not connected');
      if (!acctOrId) throw new Error('No account');
      return resolveAccount(client, acctOrId);
    },
  });

  const storiesQ = useQuery({
    queryKey: ['story-statuses', accountQ.data?.id, sessionKey],
    enabled: Boolean(client) && Boolean(open) && Boolean(accountQ.data?.id),
    queryFn: async () => {
      if (!client) throw new Error('Not connected');
      if (!accountQ.data?.id) return [] as GStatus[];
      // Prefer media-only to feel like stories.
      const media = await client.accounts.statuses(accountQ.data.id, { onlyMedia: true, limit: 20 });
      if (media?.length) return media;
      // Fallback: last posts.
      return client.accounts.statuses(accountQ.data.id, { limit: 10 });
    },
    staleTime: 20_000,
  });

  const slides = React.useMemo(() => buildSlides(storiesQ.data ?? []), [storiesQ.data]);

  React.useEffect(() => {
    if (!open) return;
    // Clamp index when data changes.
    if (index >= slides.length && slides.length > 0) setIndex(slides.length - 1);
    if (slides.length === 0) setIndex(0);
  }, [open, index, slides.length, setIndex]);

  React.useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeStory();
      if (e.key === 'ArrowRight') setIndex(Math.min(index + 1, Math.max(0, slides.length - 1)));
      if (e.key === 'ArrowLeft') setIndex(Math.max(index - 1, 0));
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeStory, setIndex, index, slides.length]);

  if (!open) return null;

  const a = accountQ.data;
  const slide = slides[index];

  return (
    <div
      className={`ghost-storyviewer storyviewer ${storyStyle}`}
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        // Click outside closes.
        if (e.target === e.currentTarget) closeStory();
      }}
    >
      <div className="ghost-storyviewer-panel">
        <div className="ghost-storyviewer-progress" aria-hidden="true">
          {slides.map((item, i) => {
            const state = i < index ? 'is-complete' : i === index ? 'is-active' : 'is-pending';
            return <div key={item.key} className={`ghost-storyviewer-progress-item ${state}`} />;
          })}
        </div>
        <div className="ghost-storyviewer-head">
          <div className="ghost-storyviewer-title">
            {a?.avatar ? <img src={a.avatar} alt="" /> : null}
            <div className="min-w-0">
              <div className="t1">{a ? (a.displayName || a.acct) : accountQ.isFetching ? 'Loading…' : 'Story'}</div>
              <div className="t2">{a ? `@${a.acct}` : ''}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {a ? (
              <Button size="sm" variant="ghost" onClick={() => setInspector({ type: 'profile', acctOrId: a.id || a.acct })}>
                Profile
              </Button>
            ) : null}
            <Button size="sm" variant="ghost" onClick={() => storiesQ.refetch()} disabled={storiesQ.isFetching}>
              Refresh
            </Button>
            <Button size="sm" onClick={() => closeStory()}>Close</Button>
          </div>
        </div>

        <div className="ghost-storyviewer-body">
          <div className="ghost-storyviewer-slide">
            {storiesQ.isFetching ? (
              <div className="text-[12px] text-white/55">Loading story…</div>
            ) : slide ? (
              slide.kind === 'image' ? (
                <img src={slide.src} alt={slide.alt || ''} loading="lazy" decoding="async" />
              ) : (
                <div className="ghost-card p-4 max-w-[72ch]">
                  <div className="text-[12px] text-white/55">No media. Last post:</div>
                  <div
                    className="mt-2 prose prose-invert max-w-none text-[14px]"
                    dangerouslySetInnerHTML={{ __html: slide.status.contentHtml }}
                  />
                </div>
              )
            ) : (
              <div className="text-[12px] text-white/55">No story items found.</div>
            )}
          </div>
        </div>

        <div className="ghost-storyviewer-foot">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIndex(Math.max(index - 1, 0))}
              disabled={index <= 0}
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIndex(Math.min(index + 1, Math.max(0, slides.length - 1)))}
              disabled={index >= slides.length - 1}
            >
              Next
            </Button>

            {slide ? (
              <Button size="sm" onClick={() => setInspector({ type: 'thread', statusId: slide.status.id })}>
                Open Post
              </Button>
            ) : null}
          </div>

          <div className="text-[11px] text-white/45">
            {slides.length ? `${index + 1} / ${slides.length}` : '0 / 0'}
          </div>
        </div>
      </div>
    </div>
  );
}
