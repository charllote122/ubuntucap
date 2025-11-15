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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on app start
    const user = authService.getCurrentUser();
    console.log('🟡 [AuthContext] Loading user from storage:', user);
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (phoneNumber, password) => {
    try {
      console.log('🔵 [AuthContext] Attempting login...');
      const result = await authService.login(phoneNumber, password);
      console.log('🟢 [AuthContext] Login successful:', result);
      
      // Get the updated user from authService
      const user = authService.getCurrentUser();
      console.log('🟢 [AuthContext] Updated user from service:', user);
      
      // Update current user state
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      return { success: true, user: user };
    } catch (error) {
      console.error('🔴 [AuthContext] Login failed:', error);
      return { 
        success: false, 
        error: error.error || error.detail || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('🔵 [AuthContext] Calling authService.register with:', userData);
      const result = await authService.register(userData);
      console.log('🟢 [AuthContext] Registration successful:', result);
      
      // Get the updated user from authService
      const user = authService.getCurrentUser();
      console.log('🟢 [AuthContext] Updated user from service:', user);
      
      // Update current user state
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      return { success: true, user: user };
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
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};