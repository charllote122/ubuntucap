// services/authService.js
const API_BASE_URL = '/api';

export const authService = {
  async login(phoneNumber, password) {
    try {
      console.log('🟡 [authService] Making login request...', { 
        phoneNumber, 
        password,
        endpoint: `${API_BASE_URL}/auth/login/`
      });
      
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          password: password
        }),
      });

      const data = await response.json();
      console.log('🟡 [authService] Login response status:', response.status);
      console.log('🟡 [authService] Login response data:', data);

      if (!response.ok) {
        throw data;
      }

      // Store tokens and user data
      if (data.access && data.user) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        console.log('🟢 [authService] Tokens and user data stored');
      }

      return data;
    } catch (error) {
      console.error('🔴 [authService] Login error:', error);
      throw error;
    }
  },

  async register(userData) {
    try {
      console.log('🟡 [authService] Making registration request...', userData);
      
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log('🟡 [authService] Registration response status:', response.status);
      console.log('🟡 [authService] Registration response data:', data);

      if (!response.ok) {
        throw data;
      }

      // Store tokens and user data
      if (data.access && data.user) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        console.log('🟢 [authService] Registration tokens and user data stored');
      }

      return data;
    } catch (error) {
      console.error('🔴 [authService] Registration error:', error);
      throw error;
    }
  },

  getCurrentUser() {
    try {
      const user = localStorage.getItem('currentUser');
      const parsedUser = user ? JSON.parse(user) : null;
      console.log('🟡 [authService] Retrieved user from storage:', parsedUser);
      return parsedUser;
    } catch (error) {
      console.error('🔴 [authService] Error getting current user:', error);
      return null;
    }
  },

  getAccessToken() {
    return localStorage.getItem('accessToken');
  },

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  },

  logout() {
    console.log('🟡 [authService] Clearing auth data');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
  },

  isAuthenticated() {
    const token = this.getAccessToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      localStorage.setItem('accessToken', data.access);
      return data.access;
    } catch (error) {
      console.error('🔴 [authService] Token refresh error:', error);
      this.logout();
      throw error;
    }
  }
};