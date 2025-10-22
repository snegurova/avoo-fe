import { create } from 'zustand';
import { IAuthStore } from '../types/store';



export const useAuthStore = create<IAuthStore>((set) => ({
    isAuthenticated: false,
    setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
}));