import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatusCard, Button } from '@ghostodon/ui';
import { useGhostodon } from '../../lib/useClient';
import { useInspectorStore } from '@ghostodon/state';

export default function ThreadInspector(props: { statusId: string }) {
  const { client, sessionKey } = useGhostodon();
  const setInspector = useInspectorStore((s) => s.setInspector);

  const statusQ = useQuery({
    queryKey: ['status', props.statusId, sessionKey],
    queryFn: async () => {
      if (!client) throw new Error('Not connected');
      return client.statuses.get(props.statusId);
    },
    enabled: Boolean(client)
  });

  const ctxQ = useQuery({
    queryKey: ['context', props.statusId, sessionKey],
    queryFn: async () => {
      if (!client) throw new Error('Not connected');
      return client.statuses.context(props.statusId);
    },
    enabled: Boolean(client)
  });

  if (!client) {
    return (
      <div className="rounded-[14px] border border-white/10 bg-white/5 p-3 text-[12px] text-white/60">
        Connect first.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => setInspector({ type: 'compose', replyToId: props.statusId })}>
          Reply
        </Button>
        <Button size="sm" variant="ghost" onClick={() => { statusQ.refetch(); ctxQ.refetch(); }}>
          Refresh
        </Button>
        <div className="text-[11px] text-white/40">
          {statusQ.isFetching || ctxQ.isFetching ? 'Loading…' : 'Ready'}
        </div>
      </div>

      {statusQ.isError ? (
        <div className="rounded-[14px] border border-red-400/30 bg-red-500/10 p-3 text-[12px] text-red-100">
          {(statusQ.error as Error).message}
        </div>
      ) : null}

      {statusQ.data ? (
        <StatusCard
          status={statusQ.data}
          selected
          onOpen={() => {}}
          onProfile={(acctOrId) => setInspector({ type: 'profile', acctOrId })}
          onReply={() => setInspector({ type: 'compose', replyToId: statusQ.data!.id })}
        />
      ) : null}

      <div className="mt-2 text-[11px] font-semibold text-[rgba(var(--g-accent),0.9)]">Ancestors</div>
      <div className="flex flex-col gap-2">
        {ctxQ.data?.ancestors?.map((s) => (
          <StatusCard
            key={s.id}
            status={s}
            onOpen={() => setInspector({ type: 'thread', statusId: s.id })}
            onProfile={(acctOrId) => setInspector({ type: 'profile', acctOrId })}
            onReply={() => setInspector({ type: 'compose', replyToId: s.id })}
          />
        ))}
        {!ctxQ.isFetching && (ctxQ.data?.ancestors?.length ?? 0) === 0 ? (
          <div className="text-[12px] text-white/40">No ancestors.</div>
        ) : null}
      </div>

      <div className="mt-2 text-[11px] font-semibold text-[rgba(var(--g-accent),0.9)]">Replies</div>
      <div className="flex flex-col gap-2">
        {ctxQ.data?.descendants?.map((s) => (
          <StatusCard
            key={s.id}
            status={s}
            onOpen={() => setInspector({ type: 'thread', statusId: s.id })}
            onProfile={(acctOrId) => setInspector({ type: 'profile', acctOrId })}
            onReply={() => setInspector({ type: 'compose', replyToId: s.id })}
          />
        ))}
        {!ctxQ.isFetching && (ctxQ.data?.descendants?.length ?? 0) === 0 ? (
          <div className="text-[12px] text-white/40">No replies yet.</div>
        ) : null}
      </div>
    </div>
  );
}
