import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getStorage } from './storage';

export type AuthStore = {
  isAuthenticated: boolean;
  accessToken: string | null;
  _hasHydrated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setAccessToken: (accessToken: string) => void;
  setHasHydrated: (state: boolean) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      _hasHydrated: false,
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: getStorage(),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);