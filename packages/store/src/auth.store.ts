import { create } from 'zustand';

export type AuthStore = {
  isAuthenticated: boolean;
  accessToken: string;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setAccessToken: (accessToken: string) => void;

};

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  accessToken: '',
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setAccessToken: (accessToken) => set({ accessToken }),

}));