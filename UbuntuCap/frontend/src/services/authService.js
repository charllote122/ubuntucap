import api from './api';

export const authService = {
  async register(userData) {
    try {
      const response = await api.post('/auth/register/', {
        phone_number: userData.phone,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        password: userData.password,
        business_name: userData.businessName,
        business_type: userData.businessType,
        business_location: userData.businessLocation
      });
      
      if (response.data.access) {
        localStorage.setItem('authToken', response.data.access);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  },

  async login(phoneNumber, password) {
    try {
      const response = await api.post('/auth/login/', {
        phone_number: phoneNumber,
        password: password
      });
      
      if (response.data.access) {
        localStorage.setItem('authToken', response.data.access);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  async getProfile() {
    try {
      const response = await api.get('/auth/profile/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get profile' };
    }
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }
};