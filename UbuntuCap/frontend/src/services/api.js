import axios from 'axios';

// Use relative path - Vite will proxy to backend
const api = axios.create({
  baseURL: '/api',  // Relative path for proxy
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (profileData) => api.put('/auth/profile/', profileData),
};

export const loansAPI = {
  getAll: () => api.get('/loans/'),
  getById: (id) => api.get(`/loans/${id}/`),
  create: (loanData) => api.post('/loans/', loanData),
  update: (id, loanData) => api.put(`/loans/${id}/`, loanData),
  delete: (id) => api.delete(`/loans/${id}/`),
};

export default api;