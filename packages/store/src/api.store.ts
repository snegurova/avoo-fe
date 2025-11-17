import { create } from 'zustand';

export type ApiStore = {
  isPending: boolean;
  isError: boolean;
  errorMessage: string | null;
  setIsPending: (isPending: boolean) => void;
  setIsError: (isError: boolean) => void;
};

export const useApiStore = create<ApiStore>((set) => ({
  isPending: false,
  isError: false,
  errorMessage: null,
  setIsPending: (isPending) => set({ isPending }),
  setIsError: (isError) => set({ isError }),
  setErrorMessage: (errorMessage) => set({ errorMessage }),
}));