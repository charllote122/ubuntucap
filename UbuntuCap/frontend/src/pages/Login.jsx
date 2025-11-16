import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm.jsx';
import { LogIn, Shield, MessageCircle, Phone, User, CheckCircle } from 'lucide-react';

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message from registration
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the location state to avoid showing message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError('');
    setSuccessMessage(''); // Clear success message on new login attempt

    try {
      console.log('🔵 [Login] Attempting login with:', formData);
      
      const result = await login(formData);
      console.log('🟢 [Login] Login result:', result);
      
      if (result.success) {
        // Redirect to dashboard after successful login
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('🔴 [Login] Login error:', err);
      // Handle different error formats from backend
      if (err.detail) {
        setError(err.detail);
      } else if (err.message) {
        setError(err.message);
      } else if (err.non_field_errors) {
        setError(err.non_field_errors.join(', '));
      } else if (err.phone_number) {
        setError(`Phone number: ${err.phone_number.join(', ')}`);
      } else if (err.password) {
        setError(`Password: ${err.password.join(', ')}`);
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If already authenticated, show loading or redirect
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-lg">
            Sign in to access your UbuntuCap account
          </p>
        </div>

        {/* Success Message from Registration */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <LoginForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            // Optional: Pre-fill phone number from registration
            initialPhone={location.state?.phone_number}
          />

          {/* Divider */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">New to UbuntuCap?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-4">
            <Link 
              to="/register" 
              className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold transition-colors text-lg"
            >
              Create your UbuntuCap account
              <LogIn className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>

        {/* USSD Option */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Using a basic phone?</h3>
              <p className="text-blue-700 text-sm">Access your account via USSD</p>
            </div>
            <Link 
              to="/ussd" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              USSD Access
            </Link>
          </div>
          <div className="mt-3 text-center">
            <code className="text-blue-800 font-mono text-sm bg-blue-100 px-3 py-1 rounded">
              *384*12345#
            </code>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center mb-3">
            <Shield className="w-5 w-5 text-green-600 mr-2" />
            <h3 className="font-semibold text-green-800">Secure Login</h3>
          </div>
          <p className="text-green-700 text-sm">
            Your account is protected with bank-level security. All data is encrypted and secure.
          </p>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-green-600 hover:text-green-700 font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-green-600 hover:text-green-700 font-medium">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Support Info */}
        <div className="text-center">
          <div className="inline-flex items-center text-sm text-gray-600 bg-gray-100 rounded-full px-4 py-2">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            Need help?{' '}
            <a href="tel:+254700123456" className="text-green-600 hover:text-green-700 ml-1 font-medium">
              Call 0700 123 456
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;