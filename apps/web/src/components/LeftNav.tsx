import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, BrandLockup } from '@ghostodon/ui';
import { plugins } from '@ghostodon/plugins';
import { useInspectorStore, useSessionStore } from '@ghostodon/state';

function NavItem(props: { to: string; label: string; hint?: string; icon?: React.ReactNode }) {
  return (
    <NavLink
      to={props.to}
      className={({ isActive }) =>
        'ghost-navitem ' + (isActive ? 'ghost-navitem--active' : '')
      }
    >
      <span className="ghost-navleft">
        {props.icon ? <span className="ghost-navicon" aria-hidden="true">{props.icon}</span> : null}
        <span className="truncate">{props.label}</span>
      </span>
      {props.hint ? <span className="text-[10px] font-semibold tracking-wider text-white/40">{props.hint}</span> : null}
    </NavLink>
  );
}

function Icon(props: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d={props.d} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export default function LeftNav() {
  const setInspector = useInspectorStore((s) => s.setInspector);
  const session = useSessionStore((s) => s.session);
  const clearSession = useSessionStore((s) => s.clearSession);
  const extItems = plugins.navItems();

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="px-1 pb-1">
        <BrandLockup subtitle="control room" />
      </div>

      <NavItem to="/home" label="Home" hint="Ctrl+1" icon={<span>🏠</span>} />
      <NavItem to="/local" label="Local" hint="Ctrl+2" icon={<span>📍</span>} />
      <NavItem to="/federated" label="Federated" hint="Ctrl+3" icon={<span>🌐</span>} />
      <NavItem to="/search" label="Search" hint="Ctrl+4" icon={<span>🔎</span>} />
      <NavItem to="/me" label="Me" hint="Ctrl+5" icon={<span>👤</span>} />

      <NavItem to="/login" label="Login" icon={<span>🔑</span>} />
      <NavItem to="/register" label="Register" icon={<span>✍️</span>} />

      {extItems.length ? (
        <div className="mt-1 ghost-card p-3">
          <div className="portal-kicker">Extensions</div>
          <div className="flex flex-col gap-2">
            {extItems.map((it) =>
              it.route ? (
                <NavItem key={it.id} to={it.route} label={it.label} hint={it.shortcutHint} />
              ) : (
                <button
                  key={it.id}
                  className="ghost-navitem"
                  onClick={() => it.onSelect?.()}
                >
                  <span>{it.label}</span>
                  {it.shortcutHint ? <span className="text-[11px] text-white/40">{it.shortcutHint}</span> : null}
                </button>
              )
            )}
          </div>
        </div>
      ) : null}

      <div className="mt-2 ghost-card p-3">
        <div className="portal-kicker">Session</div>
        {session ? (
          <div className="mt-1 text-[12px] text-white/60">
            <div className="truncate">{session.acct}</div>
            <div className="truncate text-[11px] text-white/40">{session.origin}</div>
            <div className="mt-2 flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => setInspector({ type: 'connect' })}>
                Switch
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  clearSession();
                  setInspector({ type: 'connect' });
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-2 flex items-center justify-between">
            <div className="text-[12px] text-white/50">Not connected</div>
            <Link to="/login">
              <Button size="sm">Connect</Button>
            </Link>
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-col gap-2">
        <Button variant="ghost" onClick={() => setInspector({ type: 'settings' })}>
          Settings
        </Button>
        <Button variant="ghost" onClick={() => setInspector({ type: 'stages' })}>
          28 Stages
        </Button>
      </div>

      <div className="mt-auto pt-2 text-[10px] text-white/30">
        Tips: Ctrl+1..5 nav, Ctrl+N compose, Ctrl+, settings, Esc close inspector
      </div>
    </div>
  );
}
