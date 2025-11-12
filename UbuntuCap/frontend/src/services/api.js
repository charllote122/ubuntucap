import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Token ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('ubuntucap_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  logout: () => api.post('/auth/logout/'),
}

export const loansAPI = {
  apply: (data) => api.post('/loans/apply/', data),
  list: () => api.get('/loans/my-loans/'),
  get: (id) => api.get(`/loans/${id}/`),
  repay: (id, data) => api.post(`/loans/${id}/repay/`, data),
}

export const userAPI = {
  profile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.put('/auth/profile/', data),
}

export default api