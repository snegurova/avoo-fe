import { useApiStore } from '@avoo/store';
import { MutationCache, QueryClient } from '@tanstack/react-query';
import axios from 'axios';

const mutationCache = new MutationCache({
  onError: (error) => {
    if (axios.isAxiosError(error)) {
      useApiStore.setState({ isError: true, errorMessage: error.response?.data.message });
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
