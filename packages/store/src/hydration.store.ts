import { create } from "zustand";

type HydrationStore = {
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useHydrationStore = create<HydrationStore>((set) => ({
  hasHydrated: false,
  setHasHydrated: (hasHydrated) => set({ hasHydrated }),
}));
