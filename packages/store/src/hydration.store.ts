import { create } from "zustand";

type HydrationStore = {
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
};

export const useHydrationStore = create<HydrationStore>((set) => ({
  hasHydrated: false,
  setHasHydrated: (v) => set({ hasHydrated: v }),
}));
