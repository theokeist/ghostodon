import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeName = 'brutal' | 'candy' | 'corporate' | 'startups';

type ThemeState = {
  theme: ThemeName;
  noise: boolean;
  setTheme: (t: ThemeName) => void;
  setNoise: (v: boolean) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'brutal',
      noise: true,
      setTheme: (theme) => set({ theme }),
      setNoise: (noise) => set({ noise }),
    }),
    { name: 'ghostodon.theme' }
  )
);
