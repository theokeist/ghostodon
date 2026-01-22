import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StoryStyle = 'instagram' | 'facebook' | 'whatsapp';
export type StoryPreview = 'rail' | 'cards' | 'list';

export type UiPreset = 'instagram' | 'facebook' | 'new';

type UiPrefsState = {
  preset: UiPreset;
  storyStyle: StoryStyle;
  storyPreview: StoryPreview;
  commentPreview: boolean;
  commentPrefetch: boolean;
  setPreset: (preset: UiPreset) => void;
  setStoryStyle: (style: StoryStyle) => void;
  setStoryPreview: (preview: StoryPreview) => void;
  setCommentPreview: (v: boolean) => void;
  setCommentPrefetch: (v: boolean) => void;
};

export const useUiPrefsStore = create<UiPrefsState>()(
  persist(
    (set) => ({
      preset: 'new',
      storyStyle: 'instagram',
      storyPreview: 'rail',
      commentPreview: true,
      commentPrefetch: true,
      setPreset: (preset) => set({ preset }),
      setStoryStyle: (storyStyle) => set({ storyStyle }),
      setStoryPreview: (storyPreview) => set({ storyPreview }),
      setCommentPreview: (commentPreview) => set({ commentPreview }),
      setCommentPrefetch: (commentPrefetch) => set({ commentPrefetch }),
    }),
    {
      name: 'ghostodon:ui-prefs',
      partialize: (s) => ({
        preset: s.preset,
        storyStyle: s.storyStyle,
        storyPreview: s.storyPreview,
        commentPreview: s.commentPreview,
        commentPrefetch: s.commentPrefetch,
      }),
    }
  )
);
