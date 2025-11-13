import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = async (phoneNumber, password) => {
    try {
      const result = await authService.login(phoneNumber, password);
      setCurrentUser(result.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.error || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      setCurrentUser(result.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.error || 'Registration failed' };
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated: authService.isAuthenticated()
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};