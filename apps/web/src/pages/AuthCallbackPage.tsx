import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '@ghostodon/core';
import { BrandLockup } from '@ghostodon/ui';
import { useSessionStore } from '@ghostodon/state';

const OAUTH_KEY = 'ghostodon.oauth';

type StoredOAuth = {
  origin: string;
  redirectUri: string;
  scopes: string[];
  app: any;
  state: string;
  verifier: string;
  createdAt: number;
};

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const setSession = useSessionStore((s) => s.setSession);

  const [status, setStatus] = useState<string>('Finishing OAuth…');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const err = params.get('error');
        if (err) throw new Error(`OAuth error: ${err}`);
        const code = params.get('code');
        const state = params.get('state');
        if (!code || !state) throw new Error('Missing code/state in callback.');

        const raw = localStorage.getItem(OAUTH_KEY);
        if (!raw) throw new Error('OAuth state not found (storage cleared?). Go back to Login and try again.');
        const stored = JSON.parse(raw) as StoredOAuth;
        if (stored.state !== state) throw new Error('OAuth state mismatch. Refusing to continue.');

        setStatus('Exchanging code for token…');
        const { token } = await auth.pkceFinish({
          app: stored.app,
          origin: stored.origin,
          redirectUri: stored.redirectUri,
          code,
          verifier: stored.verifier,
        });

        setStatus('Verifying session…');
        const { account } = await auth.manualConnect({ origin: stored.origin, token });

        // persist session
        setSession({ origin: stored.origin, token, accountId: account.id, acct: account.acct });
        localStorage.removeItem(OAUTH_KEY);

        setStatus('Connected. Redirecting…');
        navigate('/home', { replace: true });
      } catch (e: any) {
        setError(e?.message ?? String(e));
        setStatus('OAuth failed');
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-[720px]">
      <div className="ghost-card p-5">
        <BrandLockup subtitle="oauth callback" />
        <div className="mt-3 text-[13px] text-white/70">{status}</div>
        {error ? (
          <div className="mt-4 ghost-card border-red-400/40 bg-red-500/10 p-4 text-[12px] text-red-100">
            {error}
          </div>
        ) : null}
        {error ? (
          <div className="mt-4 text-[12px] text-white/60">
            Go back to <a href="/login" className="underline text-[rgba(var(--g-accent),0.95)]">Login</a> and retry.
          </div>
        ) : null}
      </div>
    </div>
  );
}
