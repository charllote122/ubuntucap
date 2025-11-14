import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
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
      console.log('🔵 [AuthContext] Calling authService.register with:', userData);
      const result = await authService.register(userData);
      console.log('🟢 [AuthContext] Registration successful, setting user:', result.user);
      setCurrentUser(result.user);
      return { success: true };
    } catch (error) {
      console.error('🔴 [AuthContext] Registration error:', error);
      return { 
        success: false, 
        error: error.error || error.detail || 'Registration failed' 
      };
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
    isAuthenticated: !!currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};