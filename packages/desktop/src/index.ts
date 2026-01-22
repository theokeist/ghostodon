// Tauri integration helpers.
// Safe to import from web: all Tauri calls are behind runtime checks/dynamic imports.

export function isTauri(): boolean {
  return Boolean((globalThis as any).__TAURI_INTERNALS__ || (globalThis as any).__TAURI__);
}

export async function openExternal(url: string): Promise<void> {
  if (!isTauri()) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  // Dynamic import so bundlers don't require tauri API in the web build.
  const mod = await import('@tauri-apps/api/shell');
  await mod.open(url);
}

export async function writeClipboard(text: string): Promise<void> {
  if (!isTauri()) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const mod = await import('@tauri-apps/api/clipboard');
  await mod.writeText(text);
}
