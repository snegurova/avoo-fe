import { MutationCache, QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { BaseResponse } from '@avoo/axios/types/apiTypes';
import { apiStatus } from '../constants/constants';


const mutationCache = new MutationCache({
  onError: (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      
      if (status === 401) {
        console.error('Unauthorized - redirect to login');
      }
      
      if (status === 403) {
        console.error('Forbidden - insufficient permissions');
      }
      
      if (status && status >= 500) {
        console.error('Server error:', error.message);
      }
      
      if (!error.response) {
        console.error('Network error:', error.message);
      }
    }
    
    console.error('Mutation error:', error);
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

