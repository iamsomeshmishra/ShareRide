import axios from 'axios';

// Replace with your local machine IP for testing on physical devices
const BASE_URL = 'http://192.168.1.1:3000/api'; 

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for Auth Token
api.interceptors.request.use(
  async (config) => {
    // We'll add token logic once auth is fully integrated
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
