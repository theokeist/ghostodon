import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '@ghostodon/core';
import { BrandLockup, Button, Input } from '@ghostodon/ui';
import { useSessionStore } from '@ghostodon/state';
import SurfaceOverlay from '../components/SurfaceOverlay';

const OAUTH_KEY = 'ghostodon.oauth';

type StoredOAuth = {
  origin: string;
  redirectUri: string;
  scopes: string[];
  app: unknown;
  state: string;
  verifier: string;
  createdAt: number;
};

function normalizeOrigin(raw: string): string {
  const v = raw.trim();
  if (!v) return '';
  const withScheme = v.includes('://') ? v : `https://${v}`;
  const u = new URL(withScheme);
  // strip trailing slash
  return `${u.protocol}//${u.host}`;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const setSession = useSessionStore((s) => s.setSession);

  const prefill = params.get('origin') ?? '';

  const [originInput, setOriginInput] = useState(prefill);
  const origin = useMemo(() => normalizeOrigin(originInput), [originInput]);

  const [mode, setMode] = useState<'oauth' | 'token'>('oauth');
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const scopes = useMemo(() => ['read', 'write', 'follow'], []);
  const redirectUri = useMemo(() => `${window.location.origin}/auth/callback`, []);

  async function onOAuth() {
    setErr(null);
    if (!origin) {
      setErr('Enter a Mastodon instance (example: mastodon.social).');
      return;
    }
    setBusy(true);
    try {
      const app = await auth.registerApp({
        origin,
        appName: 'Ghostodon',
        redirectUri,
        scopes,
        website: window.location.origin,
      });
      const { authorizeUrl, state, verifier } = await auth.pkceStart({
        app,
        origin,
        redirectUri,
        scopes,
      });

      const stored: StoredOAuth = {
        origin,
        redirectUri,
        scopes,
        app,
        state,
        verifier,
        createdAt: Date.now(),
      };
      localStorage.setItem(OAUTH_KEY, JSON.stringify(stored));
      window.location.assign(authorizeUrl);
    } catch (e: any) {
      setErr(e?.message ?? String(e));
      setBusy(false);
    }
  }

  async function onToken() {
    setErr(null);
    if (!origin) {
      setErr('Enter a Mastodon instance first.');
      return;
    }
    if (!token.trim()) {
      setErr('Paste an access token.');
      return;
    }
    setBusy(true);
    try {
      const { origin: o, token: t, account } = await auth.manualConnect({ origin, token: token.trim() });
      setSession({ origin: o, token: t, accountId: account.id, acct: account.acct });
      navigate('/home', { replace: true });
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="portal-wrap">
      <section className="portal-hero">
        <BrandLockup subtitle="brutalist control client" />
        <div className="portal-title">Log in to your instance</div>
        <div className="portal-lede">
          Ghostodon is a cockpit, not a timeline clone. Connect with OAuth (recommended) or paste an access token (fallback).
        </div>
        <div className="portal-cta">
          <Link to="/register" className="ghost-action" style={{ textDecoration: 'none' }}>
            Register / Sign up
          </Link>
          <div className="text-[12px] text-white/55">
            Tip: after connect hit <span className="text-white/85">Ctrl+N</span> to compose.
          </div>
        </div>
      </section>

      <div className="portal-grid">
        <div className="ghost-card portal-panel relative overflow-hidden">
          <SurfaceOverlay />
          <div className="portal-kicker">Instance</div>
          <div className="portal-help">We normalize to <span className="text-white/85">https://&lt;host&gt;</span>.</div>
          <div className="mt-3">
            <Input
              value={originInput}
              onChange={(e) => setOriginInput(e.target.value)}
              placeholder="mastodon.social"
              spellCheck={false}
            />
          </div>

          <div className="portal-tabs">
            <button type="button" onClick={() => setMode('oauth')} className={mode === 'oauth' ? 'portal-tab portal-tab--active' : 'portal-tab'}>
              OAuth
            </button>
            <button type="button" onClick={() => setMode('token')} className={mode === 'token' ? 'portal-tab portal-tab--active' : 'portal-tab'}>
              Token
            </button>
          </div>

          {mode === 'oauth' ? (
            <div className="mt-4">
              <div className="text-[13px] text-white/70">
                OAuth opens your instance authorization page and returns you here automatically.
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button onClick={onOAuth} disabled={busy}>
                  {busy ? 'Working…' : 'Authorize'}
                </Button>
                <div className="text-[12px] text-white/55">
                  Scopes: <span className="text-white/80">{scopes.join(' ')}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <div className="text-[13px] text-white/70">
                Token mode is a fallback for restricted browsers. Create a token in instance settings and paste it below.
              </div>
              <div className="mt-3">
                <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Access token (paste)" spellCheck={false} />
              </div>
              <div className="mt-3">
                <Button onClick={onToken} disabled={busy}>
                  {busy ? 'Verifying…' : 'Connect'}
                </Button>
              </div>
            </div>
          )}

          {err ? (
            <div className="mt-4 ghost-card relative overflow-hidden p-3 text-[13px] text-red-100" style={{ borderColor: 'rgba(255,70,70,0.55)', background: 'rgba(255,70,70,0.10)' }}>
              <SurfaceOverlay />
              {err}
            </div>
          ) : null}
        </div>

        <div className="ghost-card portal-panel relative overflow-hidden">
          <SurfaceOverlay />
          <div className="portal-kicker">Why this client</div>
          <div className="portal-help">
            Bird’s-eye dashboard first. Timelines are widgets. The UI is brutal, readable, and fast.
          </div>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[13px] text-white/70">
            <li>Radar columns show activity spikes at a glance.</li>
            <li>Keyboard-first: Ctrl+1/2/3 timelines, Ctrl+N compose.</li>
            <li>Theme packs: Space Cadet / Korean Flower / Cyber Red / Cyber Cyan.</li>
          </ul>
          <div className="portal-footnote">We never handle your password. Auth happens on your instance.</div>
        </div>
      </div>
    </div>
  );
}
