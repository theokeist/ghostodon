import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Pane, PaneBody, PaneHeader, SplitShell, Button } from '@ghostodon/ui';
import LeftNav from '../components/LeftNav';
import TimelinePage from '../pages/TimelinePage';
import SearchPage from '../pages/SearchPage';
import MePage from '../pages/MePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import AuthCallbackPage from '../pages/AuthCallbackPage';
import Inspector from '../components/Inspector';
import StoryViewer from '../components/stories/StoryViewer';
import { useInspectorStore, useThemeStore, useSessionStore } from '@ghostodon/state';

export default function App() {
  const navigate = useNavigate();
  const setInspector = useInspectorStore((s) => s.setInspector);
  const session = useSessionStore((s) => s.session);
  const theme = useThemeStore((s) => s.theme);
  const noise = useThemeStore((s) => s.noise);

  // Apply theme (HTML class) + effects (BODY class)
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('ui-brutal-v3');
    html.classList.remove(
      'ui-brutal',
      'theme-brutal',
      'theme-candy',
      'theme-corporate',
      'theme-startups'
    );
    html.classList.add(`theme-${theme}`);
    document.body.classList.toggle('effects-noise', noise);
  }, [theme, noise]);

  // Basic PC-first shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === '1') {
        e.preventDefault();
        navigate('/home');
      }
      if (ctrl && e.key === '2') {
        e.preventDefault();
        navigate('/local');
      }
      if (ctrl && e.key === '3') {
        e.preventDefault();
        navigate('/federated');
      }
      if (ctrl && e.key === '4') {
        e.preventDefault();
        navigate('/search');
      }
      if (ctrl && e.key === '5') {
        e.preventDefault();
        navigate('/me');
      }
      if (ctrl && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setInspector({ type: 'compose' });
      }
      if (ctrl && e.key === ',') {
        e.preventDefault();
        setInspector({ type: 'settings' });
      }
      if (e.key === 'Escape') {
        setInspector({ type: 'none' });
      }
    };
    window.addEventListener('keydown', onKey);

    const onInspectorEvent = (e: Event) => {
      const ce = e as CustomEvent;
      if (ce?.detail) setInspector(ce.detail);
    };
    window.addEventListener('ghostodon:open-inspector', onInspectorEvent as EventListener);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('ghostodon:open-inspector', onInspectorEvent as EventListener);
    };
  }, [navigate, setInspector]);

  return (
    <>
      <SplitShell
      left={
        <Pane>
          <PaneHeader title="GHOSTODON" subtitle="Bird's-eye Mastodon control room" />
          <PaneBody>
            <LeftNav />
          </PaneBody>
        </Pane>
      }
      center={
        <Pane>
          <PaneHeader
            title="FEED"
            right={
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setInspector({ type: 'settings' })}>
                  Theme
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setInspector({ type: 'stages' })}>
                  Stages
                </Button>
                <Button size="sm" onClick={() => setInspector({ type: 'compose' })}>
                  New
                </Button>
              </div>
            }
          />
          <PaneBody>
            <Routes>
              <Route path="/" element={<Navigate to={session ? '/home' : '/login'} replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/home" element={<TimelinePage mode="home" />} />
              <Route path="/local" element={<TimelinePage mode="local" />} />
              <Route path="/federated" element={<TimelinePage mode="federated" />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/me" element={<MePage />} />
              <Route path="*" element={<div className="text-white/60">Not found</div>} />
            </Routes>
          </PaneBody>
        </Pane>
      }
      right={<Inspector />}
      />
      <StoryViewer />
    </>
  );
}
