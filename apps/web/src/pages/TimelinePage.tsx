import React, { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Button } from '@ghostodon/ui';
import type { GStatus } from '@ghostodon/core';
import { useGhostodon } from '../lib/useClient';
import { useInspectorStore, useStoriesStore } from '@ghostodon/state';
import StatusCardWithComments from '../components/StatusCardWithComments';
import StoriesRail from '../components/stories/StoriesRail';
import { useAutoLoadMore } from '../lib/useAutoLoadMore';

function statusBase(s: GStatus): GStatus {
  return (s as any).reblog ?? s;
}

export default function TimelinePage(props: { mode: 'home' | 'local' | 'federated' }) {
  const { client, sessionKey } = useGhostodon();
  const setInspector = useInspectorStore((s) => s.setInspector);
  const openStory = useStoriesStore((s) => s.openStory);

  const queryKey = useMemo(() => ['timeline', props.mode, sessionKey], [props.mode, sessionKey]);

  const FIRST = 20;
  const MORE = 10;

  const q = useInfiniteQuery({
    queryKey,
    enabled: Boolean(client),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      if (!client) throw new Error('Not connected');
      const limit = pageParam ? MORE : FIRST;
      if (props.mode === 'home') return client.timelines.home({ limit, maxId: pageParam });
      if (props.mode === 'local') return client.timelines.public({ local: true, limit, maxId: pageParam });
      return client.timelines.public({ local: false, limit, maxId: pageParam });
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length === 0) return undefined;

      const expected = allPages.length === 1 ? FIRST : MORE;
      if (lastPage.length < expected) return undefined;

      const lastId = lastPage.at(-1)?.id;
      if (!lastId) return undefined;

      const prevLastId = allPages.at(-2)?.at(-1)?.id;
      if (prevLastId === lastId) return undefined;

      return lastId;
    },
    staleTime: 15_000,
  });

  const pages = q.data?.pages ?? [];
  const items = pages.flat() as GStatus[];

  const firstChunk = pages[0] as GStatus[] | undefined;

  // Story presence set: anyone who posted media in the first chunk gets a ring in the feed.
  const storySet = useMemo(() => {
    const set = new Set<string>();
    for (const s0 of firstChunk ?? []) {
      const s = statusBase(s0);
      if ((s.media?.length ?? 0) > 0) set.add(s.account.id || s.account.acct);
    }
    return set;
  }, [firstChunk]);

  const autoRef = useAutoLoadMore(
    () => {
      if (q.hasNextPage && !q.isFetchingNextPage) void q.fetchNextPage();
    },
    Boolean(client) && Boolean(q.hasNextPage)
  );

  if (!client) {
    return (
      <div className="ghost-card p-4">
        <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[rgba(var(--g-accent),0.92)]">Not connected</div>
        <div className="mt-2 text-[12px] text-white/65">
          Use the brutalist portal: OAuth (recommended) or manual token (fallback).
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button onClick={() => (window.location.href = '/login')}>Open Login</Button>
          <Button variant="ghost" onClick={() => (window.location.href = '/register')}>Register</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" onClick={() => q.refetch()} disabled={q.isFetching}>
          Refresh
        </Button>
        <div className="text-[12px] text-white/40">
          {q.isFetching ? 'Fetching…' : q.isError ? (q.error as Error).message : `${items.length} items`}
        </div>
      </div>

      {q.isError ? (
        <div className="ghost-card p-3 text-[13px] text-red-100" style={{ borderColor: 'rgba(255,70,70,0.55)', background: 'rgba(255,70,70,0.10)' }}>
          {(q.error as Error).message}
        </div>
      ) : null}

      {/* 1) Stories in-feed: avatars first, then the feed below */}
      <StoriesRail statuses={firstChunk} />

      <div className="flex flex-col gap-3">
        {items.map((s) => {
          const base = statusBase(s);
          const key = base.account.id || base.account.acct;
          const hasStory = storySet.has(key);
          return (
            <StatusCardWithComments
              key={s.id}
              status={s}
              onOpen={() => setInspector({ type: 'thread', statusId: base.id })}
              onProfile={(acctOrId) => setInspector({ type: 'profile', acctOrId })}
              onReply={() => setInspector({ type: 'compose', replyToId: base.id })}
              hasStory={hasStory}
              onStory={() => openStory(base.account.id || base.account.acct)}
            />
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="text-[11px] text-white/35">
          {q.isFetchingNextPage ? 'Loading more…' : q.hasNextPage ? 'Scroll or load more.' : 'End.'}
        </div>
        {q.hasNextPage ? (
          <Button onClick={() => q.fetchNextPage()} disabled={q.isFetchingNextPage}>
            {q.isFetchingNextPage ? 'Loading…' : `Load +${MORE}`}
          </Button>
        ) : null}
      </div>

      {/* Sentinel for scroll-to-load */}
      <div ref={autoRef} />
    </div>
  );
}
