import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BrandLockup, Button, Input } from '@ghostodon/ui';
import SurfaceOverlay from '../components/SurfaceOverlay';

function normalizeOrigin(raw: string): string {
  const v = raw.trim();
  if (!v) return '';
  const withScheme = v.includes('://') ? v : `https://${v}`;
  const u = new URL(withScheme);
  return `${u.protocol}//${u.host}`;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const prefill = params.get('origin') ?? '';
  const [originInput, setOriginInput] = useState(prefill);
  const origin = useMemo(() => normalizeOrigin(originInput), [originInput]);

  const signupUrl = useMemo(() => {
    if (!origin) return '';
    return new URL('/auth/sign_up', origin).toString();
  }, [origin]);

  return (
    <div className="portal-wrap">
      <section className="portal-hero">
        <BrandLockup subtitle="choose your instance" />
        <div className="portal-title">Create an account</div>
        <div className="portal-lede">
          Mastodon accounts live on an <span className="text-white/85">instance</span>. Pick one, sign up there, then come back and connect.
        </div>
        <div className="portal-cta">
          <Link to="/login" className="ghost-action" style={{ textDecoration: 'none' }}>
            Already have an account? Login
          </Link>
        </div>
      </section>

      <div className="portal-grid">
        <div className="ghost-card portal-panel relative overflow-hidden">
          <SurfaceOverlay />
          <div className="portal-kicker">Instance</div>
          <div className="portal-help">We normalize to <span className="text-white/85">https://&lt;host&gt;</span>. Rules and moderation differ per instance.</div>
          <div className="mt-3">
            <Input value={originInput} onChange={(e) => setOriginInput(e.target.value)} placeholder="mastodon.social" spellCheck={false} />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              disabled={!signupUrl}
              onClick={() => {
                if (!signupUrl) return;
                window.open(signupUrl, '_blank', 'noopener,noreferrer');
              }}
            >
              Open signup
            </Button>
            <Button
              variant="ghost"
              disabled={!origin}
              onClick={() => {
                if (!origin) return;
                navigate(`/login?origin=${encodeURIComponent(origin)}`);
              }}
            >
              Continue to login
            </Button>
          </div>

          {origin ? (
            <div className="portal-footnote">
              Signup URL: <span className="break-all text-white/80">{signupUrl}</span>
            </div>
          ) : null}
        </div>

        <div className="ghost-card portal-panel relative overflow-hidden">
          <SurfaceOverlay />
          <div className="portal-kicker">Picking an instance</div>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[13px] text-white/70">
            <li>Check rules + content policy. Moderation style varies.</li>
            <li>Small instances feel personal; big ones are noisier.</li>
            <li>You can follow anyone across instances — that’s the point.</li>
          </ul>
          <div className="portal-footnote">If your instance uses a different signup path, register manually and return here to connect.</div>
        </div>
      </div>
    </div>
  );
}
