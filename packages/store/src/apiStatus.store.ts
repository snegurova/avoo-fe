import { create } from 'zustand';

export type ApiStatusStore = {
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  setIsPending: (isPending: boolean) => void;
  setError: (isError: boolean, errorMessage: string) => void;
  setSuccess: (isSuccess: boolean, successMessage: string) => void;
  clearSuccess: () => void;
  clearError: () => void;
};

export const useApiStatusStore = create<ApiStatusStore>((set) => ({
  isPending: false,
  isError: false,
  isSuccess: false,
  successMessage: null,
  errorMessage: null,
  setIsPending: (isPending) => set({ isPending }),
  setError: (isError, errorMessage) => set({ isError, errorMessage }),
  setSuccess: (isSuccess, successMessage) => set({ isSuccess, successMessage }),
  clearSuccess: () => set({ isSuccess: false, successMessage: null }),
  clearError: () => set({ isError: false, errorMessage: null }),
}));