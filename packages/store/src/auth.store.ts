import { create } from 'zustand';

export type AuthStore = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
}));