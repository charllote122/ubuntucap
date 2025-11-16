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

  const login = async (credentials) => {
    try {
      console.log('🔵 [AuthContext] Attempting login with credentials:', credentials);
      
      // Extract phone_number and password from the credentials object
      const { phone_number, password } = credentials;
      
      if (!phone_number || !password) {
        throw new Error('Phone number and password are required');
      }
      
      const result = await authService.login(phone_number, password);
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
        error: error.error || error.detail || error.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('🔵 [AuthContext] Calling authService.register with:', userData);
      
      // Validate required fields
      const requiredFields = ['phone_number', 'email', 'password', 'first_name', 'last_name'];
      const missingFields = requiredFields.filter(field => !userData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
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
        error: error.error || error.detail || error.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    console.log('🟡 [AuthContext] Logging out user');
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    console.log('🟡 [AuthContext] Updating user data:', userData);
    setCurrentUser(prevUser => ({ ...prevUser, ...userData }));
    
    // Also update in localStorage
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      localStorage.setItem('currentUser', JSON.stringify({ ...storedUser, ...userData }));
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};