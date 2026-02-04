import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Input, UserCard } from '@ghostodon/ui';
import SurfaceOverlay from '../components/SurfaceOverlay';
import { useGhostodon } from '../lib/useClient';
import { useInspectorStore } from '@ghostodon/state';

type TrendItem = {
  name: string;
  hint: string;
  url?: string;
};

type PeopleItem = {
  id?: string;
  name: string;
  handle: string;
  summary: string;
  avatarUrl: string;
};

const mockTrends: TrendItem[] = [
  { name: 'ghostodon', hint: 'Rising' },
  { name: 'designsystems', hint: 'Hot' },
  { name: 'workflow', hint: 'Weekly' },
  { name: 'productivity', hint: 'Climbing' },
  { name: 'motion', hint: 'New' },
  { name: 'typography', hint: 'Trending' },
];

const mockPeople: PeopleItem[] = [
  {
    name: 'Avery Doe',
    handle: 'avery',
    summary: 'Design lead. Systems, tokens, and UI kits.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Jules Park',
    handle: 'jules',
    summary: 'Product strategist. Signal-first timelines.',
    avatarUrl: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Nova Lane',
    handle: 'nova',
    summary: 'Creative technologist. Playful UI prototypes.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
];

const formatter = new Intl.NumberFormat('en', { notation: 'compact' });

export default function ExplorePage() {
  const { client, sessionKey } = useGhostodon();
  const setInspector = useInspectorStore((s) => s.setInspector);
  const [q, setQ] = useState('');
  const needle = q.trim().toLowerCase();

  const isConnected = Boolean(client);
  const hasQuery = needle.length > 0;

  const searchQ = useQuery({
    queryKey: ['explore-search', needle, sessionKey],
    queryFn: async () => {
      if (!client) return null;
      return client.search.query(needle, { limit: 6, resolve: true });
    },
    enabled: isConnected && hasQuery,
  });

  const trendsQ = useQuery({
    queryKey: ['explore-trends', sessionKey],
    queryFn: async () => {
      if (!client) return [];
      return client.trends.tags({ limit: 6 });
    },
    enabled: isConnected && !hasQuery,
  });

  const directoryQ = useQuery({
    queryKey: ['explore-directory', sessionKey],
    queryFn: async () => {
      if (!client) return [];
      return client.directory.list({ limit: 6, order: 'active' });
    },
    enabled: isConnected && !hasQuery,
  });

  const trendItems = useMemo<TrendItem[]>(() => {
    if (!isConnected) {
      return mockTrends.filter((t) => t.name.toLowerCase().includes(needle));
    }

    if (hasQuery) {
      const tags = searchQ.data?.hashtags ?? [];
      return tags.map((tag) => ({
        name: tag.name,
        hint: 'Search match',
        url: tag.url,
      }));
    }

    return (trendsQ.data ?? []).map((tag) => {
      const history = tag.history?.[0];
      const hint = history?.uses ? `${formatter.format(history.uses)} posts` : 'Trending now';
      return { name: tag.name, url: tag.url, hint };
    });
  }, [hasQuery, isConnected, needle, searchQ.data?.hashtags, trendsQ.data]);

  const peopleItems = useMemo<PeopleItem[]>(() => {
    if (!isConnected) {
      return mockPeople.filter(
        (p) => p.name.toLowerCase().includes(needle) || p.handle.toLowerCase().includes(needle)
      );
    }

    if (hasQuery) {
      return (searchQ.data?.accounts ?? []).map((account) => ({
        id: account.id,
        name: account.displayName || account.acct,
        handle: account.acct,
        summary: account.noteHtml ? account.noteHtml.replace(/<[^>]+>/g, '') : `@${account.acct}`,
        avatarUrl: account.avatar,
      }));
    }

    return (directoryQ.data ?? []).map((account) => ({
      id: account.id,
      name: account.displayName || account.acct,
      handle: account.acct,
      summary: account.noteHtml ? account.noteHtml.replace(/<[^>]+>/g, '') : `@${account.acct}`,
      avatarUrl: account.avatar,
    }));
  }, [directoryQ.data, hasQuery, isConnected, needle, searchQ.data?.accounts]);

  return (
    <div className="flex flex-col gap-3">
      <div className="ghost-card relative overflow-hidden p-4">
        <SurfaceOverlay />
        <div className="text-[12px] font-black uppercase tracking-[0.2em] text-white/90">Explore</div>
        <div className="mt-2 text-[13px] text-white/65">
          {isConnected ? 'Live trends and suggested accounts.' : 'Preview trends and accounts (connect for live data).'}
        </div>
        <div className="mt-3 flex flex-col gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter trends or people…" />
          {isConnected && hasQuery && searchQ.isFetching ? (
            <div className="text-[11px] text-white/40">Searching…</div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="ghost-card ghost-trends relative overflow-hidden p-4">
          <SurfaceOverlay />
          <div className="portal-kicker">Trends</div>
          <div className="mt-2 text-[12px] text-white/55">Topics gaining momentum right now.</div>
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
            {trendItems.length === 0 ? (
              <div className="text-[12px] text-white/40">No trends found.</div>
            ) : null}
          </div>
        </div>

        <div className="ghost-card relative overflow-hidden p-4">
          <SurfaceOverlay />
          <div className="portal-kicker">Suggested</div>
          <div className="mt-2 text-[12px] text-white/55">People to follow based on activity.</div>
          <div className="mt-3 flex flex-col gap-2">
            {peopleItems.map((p) => (
              <UserCard
                key={p.handle}
                name={p.name}
                handle={p.handle}
                summary={p.summary}
                avatarUrl={p.avatarUrl}
                actions={
                  <>
                    <Button
                      size="sm"
                      onClick={() => setInspector({ type: 'profile', acctOrId: p.id ?? p.handle })}
                    >
                      View
                    </Button>
                  </>
                }
                onClick={() => setInspector({ type: 'profile', acctOrId: p.id ?? p.handle })}
              />
            ))}
            {peopleItems.length === 0 ? (
              <div className="text-[12px] text-white/40">No people found.</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
