import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:4000/',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

