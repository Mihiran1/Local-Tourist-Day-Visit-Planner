import axios from 'axios';

// 1. Create an Axios instance with a base URL and default headers
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Base URL of our Spring Boot backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request interceptor — attaches the auth token to every outgoing request
api.interceptors.request.use(
  (config) => {
    // Retrieve the auth token from localStorage
    const token = localStorage.getItem('token');
    
    // If a token exists, attach it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor — handles 401 errors by clearing storage and redirecting to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // On 401 Unauthorized, clear local storage and redirect to the login page
      console.error("Unauthorized! Redirecting to login...");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
