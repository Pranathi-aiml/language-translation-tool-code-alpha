import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_URL || '';
const baseURL = rawBaseUrl.endsWith('/api')
  ? rawBaseUrl
  : rawBaseUrl
  ? `${rawBaseUrl.replace(/\/+$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;