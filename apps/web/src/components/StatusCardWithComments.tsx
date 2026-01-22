import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { GStatus } from '@ghostodon/core';
import { StatusCard } from '@ghostodon/ui';
import { useGhostodon } from '../lib/useClient';

/**
 * App-layer wrapper that adds lazy comment preview (thread descendants) to StatusCard.
 *
 * Why lazy? Fetching context for every status in a timeline is expensive and rate-limit prone.
 * This wrapper only queries when the user expands comments.
 */
export default function StatusCardWithComments(props: {
  status: GStatus;
  selected?: boolean;
  onOpen?: () => void;
  onProfile?: (acctOrId: string) => void;
  onReply?: () => void;
  onBoost?: () => void;
  onFav?: () => void;
  /** If true, render a story ring on the avatar (feed-level heuristic). */
  hasStory?: boolean;
  /** Open story viewer for this account. */
  onStory?: () => void;
  className?: string;
}) {
  const { client, sessionKey } = useGhostodon();
  const qc = useQueryClient();
  const base = props.status.reblog ?? props.status;
  const [open, setOpen] = React.useState(false);

  const contextQueryKey = ['contextPreview', base.id, sessionKey] as const;

  const prefetch = React.useCallback(() => {
    if (!client) return;
    // Prefetch thread context so expanding comments feels instant.
    void qc.prefetchQuery({
      queryKey: contextQueryKey,
      staleTime: 60_000,
      queryFn: async () => client.statuses.context(base.id)
    });
  }, [client, qc, contextQueryKey, base.id]);

  const q = useQuery({
    queryKey: contextQueryKey,
    enabled: Boolean(client) && open,
    staleTime: 60_000,
    queryFn: async () => {
      if (!client) throw new Error('Not connected');
      return client.statuses.context(base.id);
    },
  });

  const previewItems = (q.data?.descendants ?? []).slice(0, 2).map((d) => ({
    id: d.id,
    createdAt: d.createdAt,
    account: {
      id: d.account.id,
      acct: d.account.acct,
      displayName: d.account.displayName,
      avatar: d.account.avatar,
    },
    contentHtml: d.contentHtml,
  }));

  return (
    <StatusCard
      status={props.status}
      selected={props.selected}
      onOpen={props.onOpen}
      onProfile={props.onProfile}
      onReply={props.onReply}
      onBoost={props.onBoost}
      onFav={props.onFav}
      hasStory={props.hasStory}
      onStory={props.onStory}
      className={props.className}
      commentPreview={{
        count: typeof base.repliesCount === 'number' ? base.repliesCount : undefined,
        open,
        loading: q.isFetching,
        error: q.isError ? (q.error as Error).message : undefined,
        items: previewItems,
      }}
      onPrefetchComments={prefetch}
      onToggleComments={() => setOpen((v) => !v)}
    />
  );
}
