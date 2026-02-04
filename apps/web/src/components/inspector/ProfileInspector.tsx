import React from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { Button, Input } from '@ghostodon/ui';
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
  const [tab, setTab] = React.useState<'overview' | 'followers' | 'following'>('overview');
  const [followersQuery, setFollowersQuery] = React.useState('');
  const [followingQuery, setFollowingQuery] = React.useState('');

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

  const followersQ = useInfiniteQuery({
    queryKey: ['account-followers', accountQ.data?.id, sessionKey],
    enabled: Boolean(client) && Boolean(accountQ.data?.id) && tab === 'followers',
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      if (!client) throw new Error('Not connected');
      if (!accountQ.data?.id) return [];
      return client.accounts.followers(accountQ.data.id, { limit: 30, maxId: pageParam });
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      if (lastPage.length < 30) return undefined;
      const lastId = lastPage.at(-1)?.id;
      if (!lastId) return undefined;
      const prevLastId = allPages.at(-2)?.at(-1)?.id;
      if (prevLastId === lastId) return undefined;
      return lastId;
    },
    staleTime: 30_000,
  });

  const followingQ = useInfiniteQuery({
    queryKey: ['account-following', accountQ.data?.id, sessionKey],
    enabled: Boolean(client) && Boolean(accountQ.data?.id) && tab === 'following',
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      if (!client) throw new Error('Not connected');
      if (!accountQ.data?.id) return [];
      return client.accounts.following(accountQ.data.id, { limit: 30, maxId: pageParam });
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      if (lastPage.length < 30) return undefined;
      const lastId = lastPage.at(-1)?.id;
      if (!lastId) return undefined;
      const prevLastId = allPages.at(-2)?.at(-1)?.id;
      if (prevLastId === lastId) return undefined;
      return lastId;
    },
    staleTime: 30_000,
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
  const filteredFollowers = React.useMemo(() => {
    const list = (followersQ.data?.pages ?? []).flat();
    const needle = followersQuery.trim().toLowerCase();
    if (!needle) return list;
    return list.filter((f) => `${f.displayName ?? ''} ${f.acct}`.toLowerCase().includes(needle));
  }, [followersQ.data, followersQuery]);

  const filteredFollowing = React.useMemo(() => {
    const list = (followingQ.data?.pages ?? []).flat();
    const needle = followingQuery.trim().toLowerCase();
    if (!needle) return list;
    return list.filter((f) => `${f.displayName ?? ''} ${f.acct}`.toLowerCase().includes(needle));
  }, [followingQ.data, followingQuery]);

  const followersAutoRef = useAutoLoadMore(
    () => {
      if (tab === 'followers' && followersQ.hasNextPage && !followersQ.isFetchingNextPage) {
        void followersQ.fetchNextPage();
      }
    },
    tab === 'followers' && Boolean(followersQ.hasNextPage)
  );

  const followingAutoRef = useAutoLoadMore(
    () => {
      if (tab === 'following' && followingQ.hasNextPage && !followingQ.isFetchingNextPage) {
        void followingQ.fetchNextPage();
      }
    },
    tab === 'following' && Boolean(followingQ.hasNextPage)
  );

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
              <img src={a.header} alt="" className="h-full w-full object-cover opacity-90" loading="lazy" decoding="async" />
            </div>
          ) : null}

          <div className="p-3">
            <div className="flex items-start gap-3">
              <img
                src={a.avatar}
                alt=""
                className="h-16 w-16 border-2 border-white/20 bg-black/30 object-cover"
                style={{ borderRadius: 'var(--g-radius)' }}
                loading="lazy"
                decoding="async"
              />
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

                <details className="ghost-accordion mt-3">
                  <summary>About</summary>
                  {a.noteHtml ? (
                    <div
                      className="mt-2 prose prose-invert prose-p:my-2 prose-a:text-[rgba(var(--g-accent),0.95)] max-w-none text-[13px]"
                      dangerouslySetInnerHTML={{ __html: a.noteHtml }}
                    />
                  ) : (
                    <div className="mt-2 text-[12px] text-white/50">No bio provided.</div>
                  )}
                </details>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="ghost-tabbar">
        <button
          type="button"
          className={tab === 'overview' ? 'ghost-tabbar-item ghost-tabbar-item--active' : 'ghost-tabbar-item'}
          onClick={() => setTab('overview')}
        >
          Overview
        </button>
        <button
          type="button"
          className={tab === 'followers' ? 'ghost-tabbar-item ghost-tabbar-item--active' : 'ghost-tabbar-item'}
          onClick={() => setTab('followers')}
        >
          Followers
        </button>
        <button
          type="button"
          className={tab === 'following' ? 'ghost-tabbar-item ghost-tabbar-item--active' : 'ghost-tabbar-item'}
          onClick={() => setTab('following')}
        >
          Following
        </button>
        <Button size="sm" onClick={() => setInspector({ type: 'compose' })}>
          New
        </Button>
      </div>

      {tab === 'overview' ? (
        <div className="flex flex-col gap-3">
          <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[rgba(var(--g-accent),0.92)]">Recent posts</div>
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
      ) : null}

      {tab === 'followers' ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[rgba(var(--g-accent),0.92)]">
              Followers ({a?.followersCount ?? 0})
            </div>
            <Input
              value={followersQuery}
              onChange={(e) => setFollowersQuery(e.target.value)}
              placeholder="Filter followers…"
            />
          </div>
          {filteredFollowers.map((f) => (
            <button
              key={f.id}
              type="button"
              className="ghost-card ghost-surface-row p-2 text-left"
              onClick={() => setInspector({ type: 'profile', acctOrId: f.id || f.acct })}
            >
              <div className="flex items-center gap-2">
                <img
                  src={f.avatar}
                  alt=""
                  className="h-10 w-10 border-2 border-white/20 bg-black/30 object-cover"
                  style={{ borderRadius: 'var(--g-radius)' }}
                  loading="lazy"
                  decoding="async"
                />
                <div className="min-w-0">
                  <div className="text-[12px] font-black uppercase tracking-[0.12em] text-white/90 truncate">
                    {f.displayName || f.acct}
                  </div>
                  <div className="text-[11px] text-white/50 truncate">@{f.acct}</div>
                </div>
              </div>
            </button>
          ))}
          {followersQ.isFetching ? <div className="text-[12px] text-white/40">Loading followers…</div> : null}
          {!followersQ.isFetching && filteredFollowers.length === 0 ? (
            <div className="text-[12px] text-white/40">No followers to show.</div>
          ) : null}
          <div className="mt-2">
            {followersQ.hasNextPage ? (
              <Button
                onClick={() => followersQ.fetchNextPage()}
                disabled={followersQ.isFetchingNextPage}
              >
                {followersQ.isFetchingNextPage ? 'Loading…' : 'Load more'}
              </Button>
            ) : filteredFollowers.length > 0 ? (
              <div className="text-[11px] text-white/35">End of followers.</div>
            ) : null}
          </div>
          <div ref={followersAutoRef} />
        </div>
      ) : null}

      {tab === 'following' ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div className="text-[12px] font-black uppercase tracking-[0.22em] text-[rgba(var(--g-accent),0.92)]">
              Following ({a?.followingCount ?? 0})
            </div>
            <Input
              value={followingQuery}
              onChange={(e) => setFollowingQuery(e.target.value)}
              placeholder="Filter following…"
            />
          </div>
          {filteredFollowing.map((f) => (
            <button
              key={f.id}
              type="button"
              className="ghost-card ghost-surface-row p-2 text-left"
              onClick={() => setInspector({ type: 'profile', acctOrId: f.id || f.acct })}
            >
              <div className="flex items-center gap-2">
                <img
                  src={f.avatar}
                  alt=""
                  className="h-10 w-10 border-2 border-white/20 bg-black/30 object-cover"
                  style={{ borderRadius: 'var(--g-radius)' }}
                  loading="lazy"
                  decoding="async"
                />
                <div className="min-w-0">
                  <div className="text-[12px] font-black uppercase tracking-[0.12em] text-white/90 truncate">
                    {f.displayName || f.acct}
                  </div>
                  <div className="text-[11px] text-white/50 truncate">@{f.acct}</div>
                </div>
              </div>
            </button>
          ))}
          {followingQ.isFetching ? <div className="text-[12px] text-white/40">Loading following…</div> : null}
          {!followingQ.isFetching && filteredFollowing.length === 0 ? (
            <div className="text-[12px] text-white/40">No following to show.</div>
          ) : null}
          <div className="mt-2">
            {followingQ.hasNextPage ? (
              <Button
                onClick={() => followingQ.fetchNextPage()}
                disabled={followingQ.isFetchingNextPage}
              >
                {followingQ.isFetchingNextPage ? 'Loading…' : 'Load more'}
              </Button>
            ) : filteredFollowing.length > 0 ? (
              <div className="text-[11px] text-white/35">End of following.</div>
            ) : null}
          </div>
          <div ref={followingAutoRef} />
        </div>
      ) : null}
    </div>
  );
}
