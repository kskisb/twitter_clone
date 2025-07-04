import axios from 'axios';

// const API_URL = import.meta.env.VITE_APP_API_URL_LOCAL;
const API_URL = import.meta.env.VITE_APP_API_URL;

export const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
