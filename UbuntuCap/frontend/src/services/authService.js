import { authAPI } from './api';

export const authService = {
  login: async (phoneNumber, password) => {
    try {
      const response = await authAPI.login({ 
        phone_number: phoneNumber,
        password 
      });
      
      if (response.data.access) {
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || { error: 'Login failed' };
      console.error('Login error:', errorData);
      throw errorData;
    }
  },

  register: async (userData) => {
    try {
      console.log('🔵 [authService] Sending registration data:', userData);
      const response = await authAPI.register(userData);
      console.log('🟢 [authService] Registration successful:', response.data);
      
      if (response.data.access) {
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('🟢 [authService] Tokens stored in localStorage');
      }
      
      return response.data;
    } catch (error) {
      console.error('🔴 [authService] Registration failed:', error);
      console.error('🔴 [authService] Error response:', error.response);
      console.error('🔴 [authService] Error data:', error.response?.data);
      
      const errorData = error.response?.data || { error: 'Registration failed' };
      throw errorData;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  }
};