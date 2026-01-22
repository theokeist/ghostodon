import * as React from 'react';
import type { GStatus } from '@ghostodon/core';
import StoriesRailInstagram from './StoriesRailInstagram';

/**
 * Facebook-style preview (scaffold):
 * - Intended to be card tiles with cover media + name overlay.
 * - For now, we reuse Instagram rail but apply a different class hook.
 */
export default function StoriesRailFacebook(props: { statuses: GStatus[]; className?: string }) {
  return <StoriesRailInstagram {...props} className={'ghost-stories fb ' + (props.className ?? '')} />;
}
