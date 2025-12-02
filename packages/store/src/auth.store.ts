import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createZustandStorage, getPlatformStorage } from './storage';
import { useHydrationStore } from './hydration.store';

export type AuthStore = {
  isAuthenticated: boolean;
  accessToken: string | null;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setAccessToken: (accessToken: string) => void;
  logoutStore: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setAccessToken: (accessToken) => set({ accessToken }),
      logoutStore: () => set({ isAuthenticated: false, accessToken: null }),
    }),
    {
      name: "auth-storage",
      storage: createZustandStorage<AuthStore>(getPlatformStorage()),
      onRehydrateStorage: () => (state) => {
        useHydrationStore.getState().setHasHydrated(true);
      },
    }
  ),
);