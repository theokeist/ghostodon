import { createClient, type Session as CoreSession, type GhostodonClient } from '@ghostodon/core';
import { useMemo } from 'react';
import { useSessionStore } from '@ghostodon/state';

export function useGhostodon(): {
  session: CoreSession | null;
  client: GhostodonClient | null;
  sessionKey: string;
} {
  const session = useSessionStore((s) => s.session);
  const client = useMemo(() => {
    if (!session) return null;
    return createClient({
      origin: session.origin,
      token: session.token,
      accountId: session.accountId,
      acct: session.acct,
    });
  }, [session]);

  const sessionKey = session ? `${session.origin}|${session.accountId}` : 'none';

  return { session: (session as CoreSession | null), client, sessionKey };
}
