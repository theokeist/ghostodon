import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Session = {
  origin: string;
  token: string;
  accountId: string;
  acct: string;
};

type SessionState = {
  session: Session | null;
  setSession: (s: Session) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => set({ session: null })
    }),
    {
      name: 'ghostodon.session'
    }
  )
);
