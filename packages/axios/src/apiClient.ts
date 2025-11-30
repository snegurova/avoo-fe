import { useAuthStore } from '@avoo/store';
import axios from 'axios';

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
