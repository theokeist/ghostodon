import React, { useEffect } from 'react';
import { Pane, PaneBody, PaneHeader, Button } from '@ghostodon/ui';
import { useInspectorStore } from '@ghostodon/state';
import { useSessionStore } from '@ghostodon/state';
import ConnectInspector from './inspector/ConnectInspector';
import ComposeInspector from './inspector/ComposeInspector';
import ThreadInspector from './inspector/ThreadInspector';
import ProfileInspector from './inspector/ProfileInspector';
import SettingsInspector from './inspector/SettingsInspector';
import StagesInspector from './inspector/StagesInspector';

export default function Inspector() {
  const inspector = useInspectorStore((s) => s.inspector);
  const setInspector = useInspectorStore((s) => s.setInspector);
  const pin = useInspectorStore((s) => s.pin);
  const setPin = useInspectorStore((s) => s.setPin);
  const session = useSessionStore((s) => s.session);

  useEffect(() => {
    if (!session && inspector.type === 'none') setInspector({ type: 'connect' });
  }, [session, inspector.type, setInspector]);

  const title =
    inspector.type === 'connect'
      ? 'CONNECT'
      : inspector.type === 'compose'
        ? 'COMPOSE'
        : inspector.type === 'thread'
          ? 'THREAD'
          : inspector.type === 'profile'
            ? 'PROFILE'
          : inspector.type === 'settings'
            ? 'SETTINGS'
            : inspector.type === 'stages'
              ? 'STAGES'
              : 'INSPECTOR';

  return (
    <Pane className={inspector.type !== 'none' ? 'ghost-active' : undefined}>
      <PaneHeader
        title={title}
        right={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setPin(!pin)}>
              {pin ? 'Pinned' : 'Auto'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setInspector({ type: 'none' })}
              disabled={inspector.type === 'none'}
            >
              Close
            </Button>
          </div>
        }
      />
      <PaneBody>
        {inspector.type === 'none' ? (
          <div className="text-[12px] text-white/50">
            Nothing open. Click a post to open the thread, or hit <span className="text-white/70">Ctrl+N</span>.
          </div>
        ) : inspector.type === 'connect' ? (
          <ConnectInspector />
        ) : inspector.type === 'compose' ? (
          <ComposeInspector replyToId={inspector.replyToId} />
        ) : inspector.type === 'thread' ? (
          <ThreadInspector statusId={inspector.statusId} />
        ) : inspector.type === 'profile' ? (
          <ProfileInspector acctOrId={inspector.acctOrId} />
        ) : inspector.type === 'settings' ? (
          <SettingsInspector />
        ) : inspector.type === 'stages' ? (
          <StagesInspector />
        ) : (
          <div className="text-[12px] text-white/60">Not implemented yet.</div>
        )}
      </PaneBody>
    </Pane>
  );
}
