import React, { useMemo, useState } from 'react';
import { Button } from '@ghostodon/ui';
import { useGhostodon } from '../../lib/useClient';
import { useInspectorStore } from '@ghostodon/state';

export default function ComposeInspector(props: { replyToId?: string }) {
  const { client } = useGhostodon();
  const setInspector = useInspectorStore((s) => s.setInspector);

  const [text, setText] = useState('');
  const [cw, setCw] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>('');

  const canPost = useMemo(() => text.trim().length > 0 && Boolean(client) && !busy, [text, client, busy]);

  async function submit() {
    if (!client) {
      setMsg('Not connected');
      return;
    }
    setBusy(true);
    setMsg('Posting…');
    try {
      await client.compose.post({
        status: text,
        spoilerText: cw || undefined,
        inReplyToId: props.replyToId,
      });
      setMsg('Posted.');
      setText('');
      setCw('');
      setInspector({ type: 'none' });
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {!client ? (
        <div className="rounded-[14px] border border-white/10 bg-white/5 p-3 text-[12px] text-white/60">
          Connect first.
        </div>
      ) : null}

      {props.replyToId ? (
        <div className="text-[11px] text-white/40">Replying to {props.replyToId}</div>
      ) : null}

      <div className="flex items-center gap-2">
        <label className="text-[11px] text-white/50">CW</label>
        <input
          className="h-8 flex-1 rounded-[10px] border border-white/10 bg-white/5 px-2 text-[12px] text-white/80 focus:outline-none focus:ring-2 focus:ring-[rgba(var(--g-accent),0.40)]"
          value={cw}
          onChange={(e) => setCw(e.target.value)}
          placeholder="content warning (optional)"
        />
      </div>

      <textarea
        className="min-h-[140px] w-full rounded-[14px] border border-white/10 bg-black/20 p-3 text-[13px] text-white/80 focus:outline-none focus:ring-2 focus:ring-[rgba(var(--g-accent),0.40)]"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write…"
      />

      <div className="flex items-center gap-2">
        <Button onClick={submit} disabled={!canPost}>
          {busy ? 'Posting…' : 'Post'}
        </Button>
        <Button variant="ghost" onClick={() => setInspector({ type: 'none' })}>
          Cancel
        </Button>
        <div className="ml-auto text-[11px] text-white/40">{text.length} chars</div>
      </div>

      {msg ? (
        <div className="rounded-[14px] border border-white/10 bg-white/5 p-3 text-[12px] text-white/70">
          {msg}
        </div>
      ) : null}

      <div className="rounded-[14px] border border-white/10 bg-black/20 p-3 text-[11px] text-white/40">
        Media upload is supported in <span className="text-white/60">@ghostodon/core</span> (async v2). UI wiring is next.
      </div>
    </div>
  );
}
