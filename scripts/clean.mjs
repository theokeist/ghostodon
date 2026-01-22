#!/usr/bin/env node
import { rmSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);

const targets = [
  'node_modules',
  'pnpm-lock.yaml',
  '.pnpm-store',
  '.pnpm',
  'apps/web/node_modules',
  'apps/desktop/node_modules',
  'packages/core/node_modules',
  'packages/ui/node_modules',
  'packages/state/node_modules',
  'packages/plugins/node_modules',
  'packages/desktop/node_modules'
];

for (const t of targets) {
  const p = resolve(root, t);
  if (existsSync(p)) {
    try {
      rmSync(p, { recursive: true, force: true });
      console.log('removed', t);
    } catch (e) {
      console.error('failed to remove', t, e);
      process.exitCode = 1;
    }
  }
}
