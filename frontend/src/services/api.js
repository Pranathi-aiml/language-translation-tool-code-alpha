import axios from 'axios';

const rawBase = import.meta.env.VITE_API_URL;
const normalizedBase = rawBase ? `${rawBase.replace(/\/+$/, '')}/api` : (import.meta.env.PROD ? 'https://language-translation-tool-code-alpha.onrender.com/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: normalizedBase,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
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
