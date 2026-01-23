import React, { useEffect, useState } from 'react';
import { Button } from '@ghostodon/ui';
import { useInspectorStore, useSessionStore, useThemeStore, useUiPrefsStore, type ThemeName } from '@ghostodon/state';

type SettingsTab = 'general' | 'timeline' | 'accounts' | 'server' | 'ghostodon';

export default function SettingsInspector() {
  const pin = useInspectorStore((s) => s.pin);
  const setPin = useInspectorStore((s) => s.setPin);
  const clearSession = useSessionStore((s) => s.clearSession);

  const storyStyle = useUiPrefsStore((s) => s.storyStyle);
  const setStoryStyle = useUiPrefsStore((s) => s.setStoryStyle);
  const theme = useThemeStore((s) => s.theme);
  const noise = useThemeStore((s) => s.noise);
  const setTheme = useThemeStore((s) => s.setTheme);
  const setNoise = useThemeStore((s) => s.setNoise);
  const [tab, setTab] = useState<SettingsTab>('general');

  // Apply theme classes here too (so it updates even if you never hit App effect)
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove(
      'theme-brutal',
      'theme-candy',
      'theme-corporate',
      'theme-startups'
    );
    html.classList.add(`theme-${theme}`);
    document.body.classList.toggle('effects-noise', noise);
  }, [theme, noise]);

  function ThemeRow(props: { id: ThemeName; label: string; hint: string }) {
    const active = theme === props.id;
    return (
      <button
        className={
          'w-full rounded-[12px] border px-3 py-2 text-left transition ' +
          (active
            ? 'border-[rgba(var(--g-accent),0.38)] bg-[rgba(var(--g-accent),0.10)]'
            : 'border-white/10 bg-white/5 hover:bg-white/7')
        }
        onClick={() => setTheme(props.id)}
      >
        <div className="flex items-center justify-between">
          <div className="text-[12px] font-semibold text-white/85">{props.label}</div>
          {active ? <div className="text-[10px] text-[rgba(var(--g-accent),0.95)]">ACTIVE</div> : null}
        </div>
        <div className="mt-1 text-[11px] text-white/45">{props.hint}</div>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-[14px] border border-white/10 bg-black/20 p-3">
        <div className="portal-kicker">Settings</div>
        <div className="mt-2 portal-tabs">
          {([
            { id: 'general', label: 'General' },
            { id: 'timeline', label: 'Timeline' },
            { id: 'accounts', label: 'Accounts' },
            { id: 'server', label: 'Server rules' },
            { id: 'ghostodon', label: 'Ghostodon' },
          ] as const).map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={'portal-tab ' + (tab === opt.id ? 'portal-tab--active' : '')}
              onClick={() => setTab(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'general' ? (
        <div className="flex flex-col gap-3">
          <div className="rounded-[14px] border border-white/10 bg-white/5 p-3">
            <div className="text-[11px] font-semibold text-[rgba(var(--g-accent),0.9)]">Always on (local)</div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-[12px] text-white/60">Pinned inspector</div>
              <input type="checkbox" checked={pin} onChange={(e) => setPin(e.target.checked)} />
            </div>
            <div className="mt-2 text-[11px] text-white/40">
              These are always allowed and stored locally by Ghostodon.
            </div>
          </div>

          <div className="rounded-[14px] border border-white/10 bg-black/20 p-3">
            <div className="text-[11px] font-semibold text-[rgba(var(--g-accent),0.9)]">Theme</div>
            <div className="mt-2 flex flex-col gap-2">
              <ThemeRow id="brutal" label="Brutal" hint="Baseline brutalist shell with sharp geometry." />
              <ThemeRow id="candy" label="Candy" hint="Playful neon candy shell with glossy accents." />
              <ThemeRow id="corporate" label="Corporate" hint="Neutral slate, clean grids, subdued accents." />
              <ThemeRow id="startups" label="Startups" hint="Bold tech gradients and energetic highlights." />
            </div>
            <label className="mt-3 flex items-center gap-2 text-[12px] text-white/60">
              <input type="checkbox" checked={noise} onChange={(e) => setNoise(e.target.checked)} />
              Noise overlay
            </label>
          </div>

          <div className="rounded-[14px] border border-white/10 bg-black/20 p-3">
            <div className="text-[11px] font-semibold text-[rgba(var(--g-accent),0.9)]">Stories</div>
            <div className="mt-2 text-[12px] text-white/55">Preview style</div>
            <div className="mt-2 ghost-seg">
              {([
                { id: 'instagram', label: 'Instagram' },
                { id: 'facebook', label: 'Facebook' },
                { id: 'whatsapp', label: 'WhatsApp' },
              ] as const).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={storyStyle === opt.id ? 'ghost-seg-on' : 'ghost-seg-off'}
                  onClick={() => setStoryStyle(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="mt-2 text-[11px] text-white/40">Applies to stories rail + viewer polish.</div>
          </div>
        </div>
      ) : null}

      {tab === 'timeline' ? (
        <div className="flex flex-col gap-3">
          <div className="rounded-[14px] border border-white/10 bg-black/20 p-3">
            <div className="text-[11px] font-semibold text-[rgba(var(--g-accent),0.9)]">Timeline defaults</div>
            <div className="mt-2 text-[12px] text-white/60">
              Configure what is always visible in the feed. These preferences are local to Ghostodon.
            </div>
            <div className="mt-3 flex flex-col gap-2 text-[12px] text-white/55">
              <label className="flex items-center justify-between">
                <span>Auto-load more posts</span>
                <input type="checkbox" checked readOnly />
              </label>
              <label className="flex items-center justify-between">
                <span>Compact density</span>
                <input type="checkbox" disabled />
              </label>
            </div>
            <div className="mt-2 text-[11px] text-white/40">More timeline controls are coming soon.</div>
          </div>

          <div className="rounded-[14px] border border-white/10 bg-black/20 p-3">
            <div className="text-[11px] font-semibold text-[rgba(var(--g-accent),0.9)]">Explore & trends</div>
            <div className="mt-2 text-[12px] text-white/60">
              Trends are currently sourced from search results and cached in the client.
            </div>
          </div>
        </div>
      ) : null}

      {tab === 'accounts' ? (
        <div className="flex flex-col gap-3">
          <div className="rounded-[14px] border border-white/10 bg-black/20 p-3">
            <div className="text-[11px] font-semibold text-[rgba(var(--g-accent),0.9)]">Account surfaces</div>
            <div className="mt-2 text-[12px] text-white/60">
              Manage how accounts are shown. Server policies may limit what can be displayed.
            </div>
            <div className="mt-3 flex flex-col gap-2 text-[12px] text-white/55">
              <label className="flex items-center justify-between">
                <span>Show follower counts</span>
                <input type="checkbox" checked readOnly />
              </label>
              <label className="flex items-center justify-between">
                <span>Show following counts</span>
                <input type="checkbox" checked readOnly />
              </label>
            </div>
            <div className="mt-2 text-[11px] text-white/40">Lists and follower views are in progress.</div>
          </div>
        </div>
      ) : null}

      {tab === 'server' ? (
        <div className="rounded-[14px] border border-white/10 bg-black/20 p-3">
          <div className="text-[11px] font-semibold text-[rgba(var(--g-accent),0.9)]">Server rules</div>
          <div className="mt-2 text-[12px] text-white/60">
            These options are governed by your Mastodon server. Ghostodon will respect server-side limits and policies.
          </div>
          <ul className="mt-3 space-y-2 text-[12px] text-white/50">
            <li>• Privacy scopes and visibility defaults.</li>
            <li>• Media sensitivity + content warnings.</li>
            <li>• Rate limits, discovery, and timeline access.</li>
          </ul>
          <div className="mt-3 text-[11px] text-white/40">Connect to a server to see its specific policies.</div>
        </div>
      ) : null}

      {tab === 'ghostodon' ? (
        <div className="flex flex-col gap-3">
          <div className="rounded-[14px] border border-white/10 bg-black/20 p-3">
            <div className="text-[11px] font-semibold text-[rgba(var(--g-accent),0.9)]">Ghostodon rules</div>
            <div className="mt-2 text-[12px] text-white/60">
              These settings are enforced by the app, regardless of server rules.
            </div>
            <ul className="mt-3 space-y-2 text-[12px] text-white/50">
              <li>• Story viewer polish and preview layouts.</li>
              <li>• UI shortcuts, panel layout, and inspector behavior.</li>
              <li>• Client-side theme and visual density.</li>
            </ul>
          </div>

          <div className="rounded-[14px] border border-white/10 bg-black/20 p-3">
            <div className="text-[11px] font-semibold text-[rgba(var(--g-accent),0.9)]">Danger zone</div>
            <div className="mt-2">
              <Button variant="danger" onClick={() => clearSession()}>
                Clear session
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="text-[11px] text-white/40">Brand: small lockup + theme tokens are in @ghostodon/ui.</div>
    </div>
  );
}
