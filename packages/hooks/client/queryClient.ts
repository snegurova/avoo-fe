import { typeGuardHooks } from '@avoo/shared';
import { useApiStatusStore } from '@avoo/store';
import { MutationCache, QueryClient } from '@tanstack/react-query';
import axios from 'axios';

const mutationCache = new MutationCache({
  onError: (error) => {
    if (axios.isAxiosError(error)) {
      useApiStatusStore.getState().setError(true, error.response?.data.errorMessage);
    }
  },
  onSuccess: (_data, _variables, _context, mutation) => {
    const successMessage = mutation.meta?.successMessage;

    if (successMessage && typeGuardHooks.isString(successMessage)) {
      useApiStatusStore.getState().setSuccess(true, successMessage);
    }
  },
});

export const queryClient = new QueryClient({
  mutationCache,
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },  
  },
});
