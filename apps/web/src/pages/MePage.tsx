import React from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { Button } from '@ghostodon/ui';
import { useGhostodon } from '../lib/useClient';
import { useInspectorStore, useSessionStore, useStoriesStore } from '@ghostodon/state';
import StatusCardWithComments from '../components/StatusCardWithComments';
import { useAutoLoadMore } from '../lib/useAutoLoadMore';

export default function MePage() {
  const { client, sessionKey } = useGhostodon();
  const session = useSessionStore((s) => s.session);
  const setInspector = useInspectorStore((s) => s.setInspector);
  const openStory = useStoriesStore((s) => s.openStory);

  const accountQ = useQuery({
    queryKey: ['me-account', session?.accountId, sessionKey],
    enabled: Boolean(client) && Boolean(session?.accountId),
    queryFn: async () => {
      if (!client) throw new Error('Not connected');
      if (!session?.accountId) throw new Error('No session');
      return client.accounts.get(session.accountId);
    }
  });

  const statusesQ = useInfiniteQuery({
    queryKey: ['me-statuses', session?.accountId, sessionKey],
    enabled: Boolean(client) && Boolean(session?.accountId),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      if (!client) throw new Error('Not connected');
      if (!session?.accountId) return [];
      return client.accounts.statuses(session.accountId, {
        limit: pageParam ? 10 : 20,
        maxId: pageParam,
        excludeReplies: false,
        excludeReblogs: false
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      const expected = allPages.length === 1 ? 20 : 10;
      if (lastPage.length < expected) return undefined;
      const lastId = lastPage.at(-1)?.id;
      if (!lastId) return undefined;
      const prevLastId = allPages.at(-2)?.at(-1)?.id;
      if (prevLastId === lastId) return undefined;
      return lastId;
    },
    staleTime: 30_000
  });

  const autoRef = useAutoLoadMore(
    () => {
      if (statusesQ.hasNextPage && !statusesQ.isFetchingNextPage) void statusesQ.fetchNextPage();
    },
    Boolean(statusesQ.hasNextPage)
  );

  if (!client || !session) {
    return (
      <div className="ghost-card p-4 text-[13px] text-white/60">
        Connect first.
      </div>
    );
  }

  const a = accountQ.data;
  const posts = (statusesQ.data?.pages ?? []).flat();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[rgba(var(--g-accent),0.92)]">
          Your profile
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => { accountQ.refetch(); statusesQ.refetch(); }}>
            Refresh
          </Button>
          <Button size="sm" onClick={() => setInspector({ type: 'compose' })}>New</Button>
        </div>
      </div>

      {a ? (
        <div className="ghost-card overflow-hidden">
          {a.header ? (
            <div className="h-[140px] w-full overflow-hidden border-b-2 border-white/15">
              <img src={a.header} alt="" className="h-full w-full object-cover opacity-90" />
            </div>
          ) : null}
          <div className="p-4">
            <div className="flex items-start gap-3">
              <img src={a.avatar} alt="" className="h-16 w-16 border-2 border-white/20 bg-black/30 object-cover" style={{ borderRadius: 'var(--g-radius)' }} />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-black uppercase tracking-[0.18em] text-white/90 truncate">
                  {a.displayName || a.acct}
                </div>
                <div className="mt-1 font-mono text-[12px] text-white/60 truncate">@{a.acct}</div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
                  <div className="ghost-card p-2">
                    <div className="text-white/40 uppercase tracking-[0.18em]">Posts</div>
                    <div className="text-white/85 font-black">{a.statusesCount ?? '—'}</div>
                  </div>
                  <div className="ghost-card p-2">
                    <div className="text-white/40 uppercase tracking-[0.18em]">Following</div>
                    <div className="text-white/85 font-black">{a.followingCount ?? '—'}</div>
                  </div>
                  <div className="ghost-card p-2">
                    <div className="text-white/40 uppercase tracking-[0.18em]">Followers</div>
                    <div className="text-white/85 font-black">{a.followersCount ?? '—'}</div>
                  </div>
                </div>

                {a.noteHtml ? (
                  <div
                    className="mt-3 prose prose-invert prose-p:my-2 prose-a:text-[rgba(var(--g-accent),0.95)] max-w-none text-[13px]"
                    dangerouslySetInnerHTML={{ __html: a.noteHtml }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="text-[12px] font-black uppercase tracking-[0.22em] text-white/70">Your posts</div>

      <div className="flex flex-col gap-3">
        {posts.map((s) => (
          <StatusCardWithComments
            key={s.id}
            status={s}
            onOpen={() => setInspector({ type: 'thread', statusId: s.id })}
            onProfile={(acctOrId) => setInspector({ type: 'profile', acctOrId })}
            onReply={() => setInspector({ type: 'compose', replyToId: s.id })}
            hasStory={(s.media?.length ?? 0) > 0}
            onStory={() => openStory(s.account.id || s.account.acct)}
          />
        ))}
        {!statusesQ.isFetching && posts.length === 0 ? (
          <div className="text-[12px] text-white/40">No posts.</div>
        ) : null}

        <div className="mt-2">
          {statusesQ.hasNextPage ? (
            <Button onClick={() => statusesQ.fetchNextPage()} disabled={statusesQ.isFetchingNextPage}>
              {statusesQ.isFetchingNextPage ? 'Loading…' : 'Load more'}
            </Button>
          ) : (
            <div className="text-[11px] text-white/35">End.</div>
          )}
        </div>
      </div>
      <div ref={autoRef} />
    </div>
  );
}
