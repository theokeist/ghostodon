import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, BrandLockup } from '@ghostodon/ui';
import { plugins } from '@ghostodon/plugins';
import { useInspectorStore, useSessionStore } from '@ghostodon/state';
import SurfaceOverlay from './SurfaceOverlay';

function NavItem(props: { to: string; label: string; hint?: string; icon?: React.ReactNode }) {
  return (
    <NavLink
      to={props.to}
      className={({ isActive }) =>
        'ghost-navitem relative overflow-hidden ' + (isActive ? 'ghost-navitem--active' : '')
      }
    >
      <SurfaceOverlay />
      <span className="ghost-navleft">
        {props.icon ? <span className="ghost-navicon" aria-hidden="true">{props.icon}</span> : null}
        <span className="truncate">{props.label}</span>
      </span>
      {props.hint ? <span className="text-[10px] font-semibold tracking-wider text-white/40">{props.hint}</span> : null}
    </NavLink>
  );
}

function Icon(props: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {props.children}
    </svg>
  );
}

function HomeIcon() {
  return (
    <Icon>
      <path d="m3 9 9-7 9 7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </Icon>
  );
}

function MapPinIcon() {
  return (
    <Icon>
      <path
        d="M20 10c0 4.993-5.539 10.193-7.399 11.799a2 2 0 0 1-2.402 0C8.539 20.193 3 14.993 3 10a7 7 0 0 1 14 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    </Icon>
  );
}

function GlobeIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

function SearchIcon() {
  return (
    <Icon>
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Icon>
  );
}

function UserIcon() {
  return (
    <Icon>
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" stroke="currentColor" strokeWidth="2" />
    </Icon>
  );
}

function KeyRoundIcon() {
  return (
    <Icon>
      <circle cx="7" cy="15" r="5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 15h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 15v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 15v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Icon>
  );
}

function UserPlusIcon() {
  return (
    <Icon>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4" stroke="currentColor" strokeWidth="2" />
      <path d="M19 8v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </Icon>
  );
}

function LayersIcon() {
  return (
    <Icon>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="m3 13 9 5 9-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="m3 18 9 5 9-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </Icon>
  );
}

function LayoutIcon() {
  return (
    <Icon>
      <rect x="3" y="4" width="8" height="16" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="4" width="8" height="7" stroke="currentColor" strokeWidth="2" />
      <rect x="13" y="13" width="8" height="7" stroke="currentColor" strokeWidth="2" />
    </Icon>
  );
}

export default function LeftNav() {
  const setInspector = useInspectorStore((s) => s.setInspector);
  const session = useSessionStore((s) => s.session);
  const clearSession = useSessionStore((s) => s.clearSession);
  const extItems = plugins.navItems();

  return (
    <div className="ghost-leftnav flex h-full flex-col gap-2">
      <div className="px-1 pb-1">
        <BrandLockup subtitle="control room" />
      </div>

      <div className="ghost-leftnav-section">
        <div className="ghost-leftnav-kicker">Timeline</div>
        <NavItem to="/home" label="Home" hint="Ctrl+1" icon={<HomeIcon />} />
        <NavItem to="/local" label="Local" hint="Ctrl+2" icon={<MapPinIcon />} />
        <NavItem to="/federated" label="Federated" hint="Ctrl+3" icon={<GlobeIcon />} />
      </div>

      <div className="ghost-leftnav-section">
        <div className="ghost-leftnav-kicker">Discovery</div>
        <NavItem to="/search" label="Search" hint="Ctrl+4" icon={<SearchIcon />} />
        <NavItem to="/explore" label="Explore" icon={<GlobeIcon />} />
        <NavItem to="/components" label="Components" icon={<LayersIcon />} />
        <NavItem to="/layout" label="Layout" icon={<LayoutIcon />} />
        <NavItem to="/layout-primitives" label="Layout Primitives" icon={<LayoutIcon />} />
        <NavItem to="/me" label="Me" hint="Ctrl+5" icon={<UserIcon />} />
      </div>

      <div className="ghost-leftnav-section">
        <div className="ghost-leftnav-kicker">Access</div>
        <NavItem to="/login" label="Login" icon={<KeyRoundIcon />} />
        <NavItem to="/register" label="Register" icon={<UserPlusIcon />} />
      </div>

      {extItems.length ? (
        <div className="mt-1 ghost-card ghost-leftnav-card relative overflow-hidden p-3">
          <SurfaceOverlay />
          <div className="ghost-leftnav-kicker">Extensions</div>
          <div className="flex flex-col gap-2">
            {extItems.map((it) =>
              it.route ? (
                <NavItem key={it.id} to={it.route} label={it.label} hint={it.shortcutHint} />
              ) : (
                <button
                  key={it.id}
                  className="ghost-navitem relative overflow-hidden"
                  onClick={() => it.onSelect?.()}
                >
                  <SurfaceOverlay />
                  <span>{it.label}</span>
                  {it.shortcutHint ? <span className="text-[11px] text-white/40">{it.shortcutHint}</span> : null}
                </button>
              )
            )}
          </div>
        </div>
      ) : null}

      <div className="mt-2 ghost-card ghost-leftnav-card relative overflow-hidden p-3">
        <SurfaceOverlay />
        <div className="ghost-leftnav-kicker">Session</div>
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
