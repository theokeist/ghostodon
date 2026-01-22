import React from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { Button } from '@ghostodon/ui';
import { useGhostodon } from '../../lib/useClient';
import { useInspectorStore, useStoriesStore } from '@ghostodon/state';
import StatusCardWithComments from '../StatusCardWithComments';
import { useAutoLoadMore } from '../../lib/useAutoLoadMore';

function isIdLike(v: string): boolean {
  // Mastodon account IDs are numeric strings.
  return /^\d+$/.test(v);
}

export default function ProfileInspector(props: { acctOrId: string }) {
  const { client, sessionKey } = useGhostodon();
  const setInspector = useInspectorStore((s) => s.setInspector);
  const openStory = useStoriesStore((s) => s.openStory);

  const accountQ = useQuery({
    queryKey: ['account', props.acctOrId, sessionKey],
    queryFn: async () => {
      if (!client) throw new Error('Not connected');
      const q = props.acctOrId.replace(/^@/, '').trim();
      if (isIdLike(q)) {
        return client.accounts.get(q);
      }

      // accounts.lookup may fail for remote accounts not yet known to the instance.
      // Fallback to /api/v2/search with resolve=true, which can webfinger/resolve.
      // This matches the user's intuition of "load previous query first" (resolve account, then load statuses).
      try {
        return await client.accounts.lookup(q);
      } catch {
        const res = await client.search.query(q, { type: 'accounts', resolve: true, limit: 1 });
        const a = res.accounts?.[0];
        if (!a?.id) throw new Error('Account not found');
        return a;
      }
    },
    enabled: Boolean(client) && Boolean(props.acctOrId)
  });

  const statusesQ = useInfiniteQuery({
    queryKey: ['account-statuses', accountQ.data?.id, sessionKey],
    enabled: Boolean(client) && Boolean(accountQ.data?.id),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      if (!client) throw new Error('Not connected');
      if (!accountQ.data?.id) return [];
      return client.accounts.statuses(accountQ.data.id, {
        limit: pageParam ? 10 : 20,
        maxId: pageParam,
        excludeReplies: false,
        excludeReblogs: false
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      // Stop when API returns fewer items than requested or when we detect no progress.
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

  if (!client) {
    return <div className="ghost-card p-4 text-[12px] text-white/60">Connect first.</div>;
  }

  const a = accountQ.data;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" onClick={() => { accountQ.refetch(); statusesQ.refetch(); }}>
          Refresh
        </Button>
        {a?.url ? (
          <a className="ghost-action" href={a.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
            Open in browser
          </a>
        ) : null}
        <div className="text-[11px] text-white/40">{accountQ.isFetching || statusesQ.isFetching ? 'Loading…' : 'Ready'}</div>
      </div>

      {accountQ.isError ? (
        <div className="ghost-card p-3 text-[13px]" style={{ borderColor: 'rgba(255,70,70,0.55)', background: 'rgba(255,70,70,0.10)' }}>
          <div className="text-red-100">{(accountQ.error as Error).message}</div>
        </div>
      ) : null}

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

      <div className="mt-2 flex items-center justify-between">
        <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[rgba(var(--g-accent),0.92)]">Recent posts</div>
        <Button size="sm" onClick={() => setInspector({ type: 'compose' })}>New</Button>
      </div>

      <div className="flex flex-col gap-3">
        {(statusesQ.data?.pages ?? []).flat().map((s) => (
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
        {!statusesQ.isFetching && ((statusesQ.data?.pages ?? []).flat().length ?? 0) === 0 ? (
          <div className="text-[12px] text-white/40">No posts.</div>
        ) : null}

        <div className="mt-2">
          {statusesQ.hasNextPage ? (
            <Button
              onClick={() => statusesQ.fetchNextPage()}
              disabled={statusesQ.isFetchingNextPage}
            >
              {statusesQ.isFetchingNextPage ? 'Loading…' : 'Load more'}
            </Button>
          ) : (
            <div className="text-[11px] text-white/35">End of profile posts.</div>
          )}
        </div>
        <div ref={autoRef} />
      </div>
    </div>
  );
}
