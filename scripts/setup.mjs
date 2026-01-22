#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function run(cmd, args, options = {}) {
  const res = spawnSync(cmd, args, {
    cwd: options.cwd ?? repoRoot,
    stdio: options.stdio ?? 'inherit',
    shell: options.shell ?? false,
    env: { ...process.env, ...(options.env ?? {}) }
  });
  return res;
}

function canRun(cmd) {
  const res = spawnSync(cmd, ['--version'], { stdio: 'ignore', shell: true });
  return res.status === 0;
}

function header(msg) {
  process.stdout.write(`\n=== ${msg} ===\n`);
}

const wantBuild = process.argv.includes('--build');
const wantFetch = process.argv.includes('--fetch');
const wantOffline = process.argv.includes('--offline');

header('Ghostodon monorepo setup');
console.log(`Node: ${process.version}`);
console.log('This repo is a pnpm workspace. Install from the repo root (one install prepares all packages).');
console.log('Local pnpm store is configured via .npmrc (store-dir=.pnpm-store).');

// 1) Ensure pnpm is available (prefer corepack)
let pnpmOk = canRun('pnpm');

if (!pnpmOk) {
  header('pnpm not found');

  const corepackOk = canRun('corepack');
  if (corepackOk) {
    console.log('corepack is available. Attempting to enable pnpm via corepack...');

    let r = run('corepack', ['enable'], { stdio: 'inherit', shell: true });
    if (r.status !== 0) {
      console.log('\ncorepack enable failed. You can run it manually, then rerun setup:');
      console.log('  corepack enable');
    }

    // Activate the repo-pinned pnpm version (from package.json: packageManager)
    r = run('corepack', ['prepare', 'pnpm@9.15.0', '--activate'], { stdio: 'inherit', shell: true });
    if (r.status !== 0) {
      console.log('\ncorepack prepare pnpm@9.15.0 failed. Trying latest...');
      run('corepack', ['prepare', 'pnpm@latest', '--activate'], { stdio: 'inherit', shell: true });
    }

    pnpmOk = canRun('pnpm');
  }

  if (!pnpmOk) {
    console.log('\nCould not find or activate pnpm automatically. Install pnpm, then rerun:');
    console.log('  npm i -g pnpm');
    process.exit(1);
  }
}

// 2) Optional: fetch deps into the local store (useful before going offline)
if (wantFetch) {
  header('Prefetching dependencies (pnpm fetch)');
  const fetchRes = run('pnpm', ['fetch'], { stdio: 'inherit', shell: true });
  if (fetchRes.status !== 0) process.exit(fetchRes.status ?? 1);
  console.log('\nPrefetch complete. You can later install with: pnpm install --offline');
}

header('Installing workspace dependencies');
const installArgs = wantOffline ? ['install', '--offline'] : ['install'];
const installRes = run('pnpm', installArgs, { stdio: 'inherit', shell: true });
if (installRes.status !== 0) process.exit(installRes.status ?? 1);

if (wantBuild) {
  header('Building all workspaces');
  const buildRes = run('pnpm', ['-r', 'build'], { stdio: 'inherit', shell: true });
  if (buildRes.status !== 0) process.exit(buildRes.status ?? 1);
}

header('Quick checks');
const rustOk = canRun('rustc') && canRun('cargo');
if (!rustOk) {
  console.log('Rust toolchain not detected (rustc/cargo). Desktop builds (Tauri) will need it.');
  console.log('Install Rust from rustup, then run:');
  console.log('  pnpm dev:desktop');
} else {
  console.log('Rust toolchain detected: OK (desktop builds possible).');
}

header('Next commands');
console.log('Web dev:');
console.log('  pnpm dev');
console.log('Desktop dev (Tauri):');
console.log('  pnpm dev:desktop');
console.log('Prepare all (install + build):');
console.log('  pnpm prepare:all');
console.log('Optional prefetch (download deps into .pnpm-store):');
console.log('  pnpm setup -- --fetch');
console.log('Offline install later:');
console.log('  pnpm install --offline');
