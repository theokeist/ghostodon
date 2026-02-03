import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, InfoCard, Input } from '@ghostodon/ui';
import { useGhostodon } from '../lib/useClient';
import { useInspectorStore, useStoriesStore } from '@ghostodon/state';
import StatusCardWithComments from '../components/StatusCardWithComments';
import SurfaceOverlay from '../components/SurfaceOverlay';

type SearchTab = 'statuses' | 'accounts' | 'hashtags';

export default function SearchPage() {
  const { client, sessionKey } = useGhostodon();
  const setInspector = useInspectorStore((s) => s.setInspector);
  const openStory = useStoriesStore((s) => s.openStory);

  const [q, setQ] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [tab, setTab] = useState<SearchTab>('statuses');

  const canSearch = Boolean(client) && submitted.trim().length > 0;

  const query = useQuery({
    queryKey: ['search', submitted.trim(), tab, sessionKey],
    queryFn: async () => {
      if (!client) throw new Error('Not connected');
      return client.search.query(submitted.trim(), {
        type: tab,
        limit: 20,
        resolve: true,
      });
    },
    enabled: canSearch,
  });

  const results = query.data;
  const accounts = results?.accounts ?? [];
  const statuses = results?.statuses ?? [];
  const hashtags = results?.hashtags ?? [];

  const trendItems = useMemo(() => {
    if (hashtags.length) {
      return hashtags.slice(0, 6).map((h) => ({
        name: h.name,
        url: h.url,
        hint: 'Active now',
      }));
    }
    return [
      { name: 'productivity', hint: 'Climbing' },
      { name: 'designops', hint: 'New posts' },
      { name: 'opensource', hint: 'Hot' },
      { name: 'artifacts', hint: 'New' },
      { name: 'startup', hint: 'Trending' },
      { name: 'workflow', hint: 'Weekly' },
    ];
  }, [hashtags]);

  const hint = useMemo(() => {
    if (!client) return 'Connect first (Login / manual token).';
    if (!submitted) return 'Type a query and hit Enter.';
    if (query.isFetching) return 'Searching…';
    if (query.isError) return (query.error as Error).message;
    if (tab === 'accounts') return `${accounts.length} accounts`;
    if (tab === 'hashtags') return `${hashtags.length} tags`;
    return `${statuses.length} posts`;
  }, [client, submitted, query.isFetching, query.isError, query.error, tab, accounts.length, hashtags.length, statuses.length]);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="ghost-card relative overflow-hidden p-4">
          <SurfaceOverlay />
          <div className="portal-kicker">Search</div>
          <div className="mt-2 flex flex-col gap-2">
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(q);
              }}
            >
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search: @accounts, hashtags, keywords…"
              />
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" type="submit">Go</Button>
                <Button
                  size="sm"
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    setQ('');
                    setSubmitted('');
                  }}
                >
                  Clear
                </Button>

                <div className="ml-auto text-[12px] text-white/50">{hint}</div>
              </div>
            </form>

            <div className="portal-tabs">
              <button
                className={"portal-tab " + (tab === 'statuses' ? 'portal-tab--active' : '')}
                onClick={() => setTab('statuses')}
                type="button"
              >
                Posts
              </button>
              <button
                className={"portal-tab " + (tab === 'accounts' ? 'portal-tab--active' : '')}
                onClick={() => setTab('accounts')}
                type="button"
              >
                Accounts
              </button>
              <button
                className={"portal-tab " + (tab === 'hashtags' ? 'portal-tab--active' : '')}
                onClick={() => setTab('hashtags')}
                type="button"
              >
                Hashtags
              </button>
            </div>
          </div>
        </div>

        <div className="ghost-card ghost-trends relative overflow-hidden p-4">
          <SurfaceOverlay />
          <div className="portal-kicker">Trends</div>
          <div className="mt-2 text-[12px] text-white/55">Live pulse from tags & conversations.</div>
          <div className="mt-3 flex flex-col gap-2">
            {trendItems.map((trend) => (
              <a
                key={trend.name}
                className="ghost-trends-item relative overflow-hidden"
                href={trend.url || '#'}
                target={trend.url ? '_blank' : undefined}
                rel={trend.url ? 'noreferrer' : undefined}
              >
                <SurfaceOverlay />
                <div className="ghost-trends-tag">#{trend.name}</div>
                <div className="ghost-trends-meta">{trend.hint}</div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <InfoCard
          title="Signal"
          status="Live"
          tone="success"
          hoverTone="warning"
          content="Track the hottest tags and conversations as they spike."
        />
        <InfoCard
          title="People"
          status="Focus"
          tone="default"
          hoverTone="success"
          content="Jump into accounts that match your query and follow in one click."
        />
        <InfoCard
          title="Threads"
          status="Scan"
          tone="warning"
          hoverTone="default"
          content="Skim results fast, open threads, and reply without losing context."
        />
      </div>

      {!client ? (
        <div className="ghost-card relative overflow-hidden p-4">
          <SurfaceOverlay />
          <div className="text-[12px] text-white/65">You are not connected.</div>
          <div className="mt-2 flex items-center gap-2">
            <Button onClick={() => (window.location.href = '/login')}>Login</Button>
            <Button variant="ghost" onClick={() => (window.location.href = '/register')}>Register</Button>
          </div>
        </div>
      ) : null}

      {tab === 'statuses' ? (
        <div className="flex flex-col gap-3">
          {statuses.map((s) => (
            <StatusCardWithComments
              key={s.id}
              status={s}
              onOpen={() => setInspector({ type: 'thread', statusId: s.id })}
              onProfile={(acctOrId) => setInspector({ type: 'profile', acctOrId })}
              onReply={() => setInspector({ type: 'compose', replyToId: s.id })}
            />
          ))}
          {!query.isFetching && submitted && statuses.length === 0 ? (
            <div className="text-[12px] text-white/40">No posts found.</div>
          ) : null}
        </div>
      ) : null}

      {tab === 'accounts' ? (
        <div className="flex flex-col gap-3">
          {accounts.map((a) => (
            <button
              key={a.id}
              type="button"
              className="ghost-card relative overflow-hidden p-4 text-left hover:opacity-95"
              onClick={() => setInspector({ type: 'profile', acctOrId: a.id || a.acct })}
            >
              <SurfaceOverlay />
              <div className="flex items-start gap-3">
                <img
                  src={a.avatar}
                  alt=""
                  className="h-12 w-12 border-2 border-white/20 bg-black/30 object-cover"
                  style={{ borderRadius: 'var(--g-radius)' }}
                  loading="lazy"
                  decoding="async"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-black uppercase tracking-[0.14em] text-white/90 truncate">
                    {a.displayName || a.acct}
                  </div>
                  <div className="mt-1 font-mono text-[12px] text-white/60 truncate">@{a.acct}</div>
                  {a.noteHtml ? (
                    <div
                      className="mt-2 prose prose-invert prose-p:my-1 max-w-none text-[12px] text-white/70"
                      dangerouslySetInnerHTML={{ __html: a.noteHtml }}
                    />
                  ) : null}
                </div>
              </div>
            </button>
          ))}
          {!query.isFetching && submitted && accounts.length === 0 ? (
            <div className="text-[12px] text-white/40">No accounts found.</div>
          ) : null}
        </div>
      ) : null}

      {tab === 'hashtags' ? (
        <div className="flex flex-col gap-3">
          {hashtags.map((h) => (
            <a
              key={h.name}
              className="ghost-card relative overflow-hidden p-4 block hover:opacity-95"
              href={h.url || '#'}
              target={h.url ? '_blank' : undefined}
              rel={h.url ? 'noreferrer' : undefined}
            >
              <SurfaceOverlay />
              <div className="text-[13px] font-black uppercase tracking-[0.14em] text-white/90">#{h.name}</div>
              <div className="mt-1 text-[12px] text-white/55">Open tag on server</div>
            </a>
          ))}
          {!query.isFetching && submitted && hashtags.length === 0 ? (
            <div className="text-[12px] text-white/40">No hashtags found.</div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
