import * as React from 'react';
import { useUiPrefsStore } from '@ghostodon/state';
import StoriesRailInstagram from './StoriesRailInstagram';
import StoriesRailFacebook from './StoriesRailFacebook';
import StoriesRailWhatsApp from './StoriesRailWhatsApp';
import type { GStatus } from '@ghostodon/core';

export default function StoriesRail(props: { statuses: GStatus[]; className?: string }) {
  const style = useUiPrefsStore((s) => s.storyStyle);
  if (style === 'facebook') return <StoriesRailFacebook {...props} />;
  if (style === 'whatsapp') return <StoriesRailWhatsApp {...props} />;
  return <StoriesRailInstagram {...props} />;
}
