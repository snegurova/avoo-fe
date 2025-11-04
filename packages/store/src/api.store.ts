import { create } from 'zustand';

export type ApiStore = {
  isPending: boolean;
  setIsPending: (isPending: boolean) => void;
};

export const useApiStore = create<ApiStore>((set) => ({
  isPending: false,
  setIsPending: (isPending) => set({ isPending }),
}));