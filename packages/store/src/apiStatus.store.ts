import { create } from 'zustand';

export type ApiStatusStore = {
  isPending: boolean;
  isError: boolean;
  errorMessage: string | null;
  setIsPending: (isPending: boolean) => void;
  setIsError: (isError: boolean) => void;
};

export const useApiStatusStore = create<ApiStatusStore>((set) => ({
  isPending: false,
  isError: false,
  errorMessage: null,
  setIsPending: (isPending) => set({ isPending }),
  setIsError: (isError) => set({ isError }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
}));