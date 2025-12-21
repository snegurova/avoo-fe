import { useAuthStore } from '@avoo/store';
import axios from 'axios';

// Callback для очистки queryClient, устанавливается извне
let clearQueryClientCallback: (() => void) | null = null;

export const setClearQueryClientCallback = (callback: () => void) => {
  clearQueryClientCallback = callback;
};

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logoutStore();
      clearQueryClientCallback?.();
    }
    return Promise.reject(error);
  },
);
