import axios from 'axios';

// 1. Axios Instance එකක් හැදීම
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // අපේ Spring Boot Backend එකේ URL එක
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor එක
api.interceptors.request.use(
  (config) => {
    // LocalStorage එකෙන් Token එක ගන්නවා
    const token = localStorage.getItem('token');
    
    // Token එකක් තියෙනවා නම්, ඒක Header එකට දානවා
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Response Interceptor එක - Token එක Expire වෙලා නම් User ව Logout කරන්න මේක පාවිච්චි කරන්න පුළුවන්.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token එක Expire වෙලා නම්, ලෝකල් ස්ටෝරේජ් එක මකලා Login එකට යවන්න පුළුවන්
      console.error("Unauthorized! Redirecting to login...");
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
