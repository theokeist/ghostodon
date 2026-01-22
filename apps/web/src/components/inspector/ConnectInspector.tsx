import React, { useMemo, useState } from 'react';
import { Button, Input } from '@ghostodon/ui';
import { auth } from '@ghostodon/core';
import { useSessionStore } from '@ghostodon/state';
import { useInspectorStore } from '@ghostodon/state';

export default function ConnectInspector() {
  const setSession = useSessionStore((s) => s.setSession);
  const current = useSessionStore((s) => s.session);
  const setInspector = useInspectorStore((s) => s.setInspector);

  const [origin, setOrigin] = useState(current?.origin ?? 'https://');
  const [token, setToken] = useState(current?.token ?? '');
  const [status, setStatus] = useState<string>('');
  const [busy, setBusy] = useState(false);

  const canConnect = useMemo(() => origin.trim().length > 8 && token.trim().length > 10, [origin, token]);

  async function connect() {
    setBusy(true);
    setStatus('Checking…');
    try {
      const s = await auth.manualConnect({ origin: origin.trim(), token: token.trim() });
      setSession({ origin: s.origin, token: s.token, accountId: s.accountId, acct: s.acct });
      setStatus(`OK: @${s.acct}`);
      setInspector({ type: 'none' });
    } catch (e) {
      setStatus((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-[12px] text-white/60">
        Manual token connect (fallback mode). Paste your instance URL + a personal access token.
        <div className="mt-1 text-[11px] text-white/40">
          OAuth PKCE will be added next. Manual mode stays for tricky instances.
        </div>
      </div>

      <label className="text-[11px] text-white/50">Instance URL</label>
      <Input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="https://mastodon.social" />

      <label className="text-[11px] text-white/50">Access token</label>
      <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="paste token" />

      <div className="flex items-center gap-2">
        <Button onClick={connect} disabled={!canConnect || busy}>
          {busy ? 'Connecting…' : 'Connect'}
        </Button>
        <Button variant="ghost" onClick={() => setInspector({ type: 'stages' })}>
          OAuth stage
        </Button>
      </div>

      {status ? (
        <div className="rounded-[14px] border border-white/10 bg-white/5 p-3 text-[12px] text-white/70">
          {status}
        </div>
      ) : null}

      <div className="rounded-[14px] border border-white/10 bg-black/20 p-3 text-[11px] text-white/40">
        Token location: <span className="text-white/60">Settings → Development → New application</span>
      </div>
    </div>
  );
}
