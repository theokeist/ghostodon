import { create } from 'zustand';

/**
 * Minimal Stories state.
 *
 * Keep state small and fetch story data via React Query.
 * (Stories are derived from recent posts/media; Mastodon has no native stories.)
 */
export type StoriesState = {
  open: boolean;
  acctOrId?: string;
  index: number;
  openStory: (acctOrId: string, index?: number) => void;
  closeStory: () => void;
  setIndex: (index: number) => void;
};

export const useStoriesStore = create<StoriesState>((set) => ({
  open: false,
  acctOrId: undefined,
  index: 0,
  openStory: (acctOrId, index = 0) => set({ open: true, acctOrId, index }),
  closeStory: () => set({ open: false, acctOrId: undefined, index: 0 }),
  setIndex: (index) => set({ index })
}));
