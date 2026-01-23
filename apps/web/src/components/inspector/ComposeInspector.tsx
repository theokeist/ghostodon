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
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string>('');
  const [attachments, setAttachments] = useState<{ id: string; name: string }[]>([]);

  const canPost = useMemo(
    () => (text.trim().length > 0 || attachments.length > 0) && Boolean(client) && !busy && !uploading,
    [text, attachments.length, client, busy, uploading]
  );

  async function onAddMedia(files: FileList | null) {
    if (!files || !client) return;
    setUploading(true);
    setMsg('Uploading media…');
    try {
      const next: { id: string; name: string }[] = [];
      for (const file of Array.from(files)) {
        const res = await client.compose.mediaUpload({ file, mimeType: file.type || 'application/octet-stream' });
        next.push({ id: res.id, name: file.name });
      }
      setAttachments((prev) => [...prev, ...next]);
      setMsg('Media uploaded.');
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

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
        mediaIds: attachments.map((a) => a.id),
      });
      setMsg('Posted.');
      setText('');
      setCw('');
      setAttachments([]);
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

      <div className="rounded-[14px] border border-white/10 bg-black/20 p-3">
        <div className="text-[11px] font-semibold text-[rgba(var(--g-accent),0.9)]">Media</div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <label className="ghost-action cursor-pointer">
            Add media
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                void onAddMedia(e.target.files);
                e.currentTarget.value = '';
              }}
            />
          </label>
          {uploading ? <span className="text-[11px] text-white/50">Uploading…</span> : null}
        </div>
        {attachments.length ? (
          <div className="mt-3 flex flex-col gap-2 text-[12px] text-white/60">
            {attachments.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-[10px] border border-white/10 bg-black/30 px-2 py-1">
                <span className="truncate">{a.name}</span>
                <button
                  type="button"
                  className="text-[10px] uppercase tracking-[0.16em] text-white/50 hover:text-white"
                  onClick={() => setAttachments((prev) => prev.filter((it) => it.id !== a.id))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-2 text-[11px] text-white/40">Upload images or videos before posting.</div>
        )}
      </div>

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
