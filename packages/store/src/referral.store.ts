import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { useHydrationStore } from './hydration.store';
import { createZustandStorage, getPlatformStorage } from './storage';

export type ReferralStore = {
  referralCode: string | null;
  setReferralCode: (code: string | null) => void;
  clearReferralCode: () => void;
};

export const useReferralStore = create<ReferralStore>()(
  persist(
    (set) => ({
      referralCode: null,
      setReferralCode: (code) => set({ referralCode: code }),
      clearReferralCode: () => set({ referralCode: null }),
    }),
    {
      name: 'referral-storage',
      storage: createZustandStorage<ReferralStore>(getPlatformStorage()),
      onRehydrateStorage: () => () => {
        useHydrationStore.getState().setHasHydrated(true);
      },
    },
  ),
);
