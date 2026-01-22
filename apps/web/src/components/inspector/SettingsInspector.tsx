import React, { useEffect } from 'react';
import { Button } from '@ghostodon/ui';
import { useInspectorStore, useSessionStore, useThemeStore, useUiPrefsStore, type ThemeName } from '@ghostodon/state';

export default function SettingsInspector() {
  const pin = useInspectorStore((s) => s.pin);
  const setPin = useInspectorStore((s) => s.setPin);
  const clearSession = useSessionStore((s) => s.clearSession);

  const uiPreset = useUiPrefsStore((s) => s.preset);
  const storyStyle = useUiPrefsStore((s) => s.storyStyle);
  const setStoryStyle = useUiPrefsStore((s) => s.setStoryStyle);
  const setPreset = useUiPrefsStore((s) => s.setPreset);
  const theme = useThemeStore((s) => s.theme);
  const noise = useThemeStore((s) => s.noise);
  const setTheme = useThemeStore((s) => s.setTheme);
  const setNoise = useThemeStore((s) => s.setNoise);

  // Apply theme classes here too (so it updates even if you never hit App effect)
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove(
      'theme-fb',
      'theme-cyber-red',
      'theme-cyber-cyan',
      'theme-space-cadet',
      'theme-korean-flower'
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
      <div className="rounded-[14px] border border-white/10 bg-white/5 p-3">
        <div className="text-[11px] font-semibold text-[rgba(var(--g-accent),0.9)]">Inspector</div>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-[12px] text-white/60">Pinned by default</div>
          <input type="checkbox" checked={pin} onChange={(e) => setPin(e.target.checked)} />
        </div>
        <div className="mt-2 text-[11px] text-white/40">
          Pinned = right pane stays put. Auto = opens on click and can be closed easily.
        </div>
      </div>

      <div className="rounded-[14px] border border-white/10 bg-black/20 p-3">
        <div className="text-[11px] font-semibold text-[rgba(var(--g-accent),0.9)]">Theme</div>
        <div className="mt-2 flex flex-col gap-2">
          <ThemeRow id="fb" label="Facebook Blue" hint="Clean social blue + monolith graphite." />
          <ThemeRow id="space-cadet" label="Space Cadet" hint="Deep ultramarine navy + cool slate accents." />
          <ThemeRow
            id="korean-flower"
            label="Korean Flower"
            hint="Mugunghwa-inspired: pink bloom + green leaf accents (high contrast)."
          />
          <ThemeRow id="cyber-red" label="Cyber Red" hint="Hot red + noir UI (more aggressive)." />
          <ThemeRow id="cyber-cyan" label="Cyber Cyan" hint="Cold cyan + high-tech glow." />
        </div>

        <label className="mt-3 flex items-center gap-2 text-[12px] text-white/60">
          <input type="checkbox" checked={noise} onChange={(e) => setNoise(e.target.checked)} />
          Noise overlay
        </label>
      </div>

      <div className="rounded-[14px] border border-white/10 bg-black/20 p-3">
        <div className="text-[11px] font-semibold text-[rgba(var(--g-accent),0.9)]">Danger zone</div>
        <div className="mt-2">
          <Button variant="danger" onClick={() => clearSession()}>
            Clear session
          </Button>
        </div>
      </div>

      <div className="text-[11px] text-white/40">Brand: small lockup + theme tokens are in @ghostodon/ui.</div>
    </div>
  );
}
