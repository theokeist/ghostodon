import * as React from 'react';
import type { GStatus } from '@ghostodon/core';
import StoriesRailInstagram from './StoriesRailInstagram';

/**
 * WhatsApp-style preview (scaffold):
 * - Intended to be a list-like status preview.
 * - For now, we reuse Instagram rail but apply a different class hook.
 */
export default function StoriesRailWhatsApp(props: { statuses: GStatus[]; className?: string }) {
  return <StoriesRailInstagram {...props} className={'ghost-stories wa ' + (props.className ?? '')} />;
}
