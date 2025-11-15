import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm.jsx';
import { LogIn, Shield, MessageCircle, Phone, User } from 'lucide-react';

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData);
      if (result.success) {
        // Redirect to dashboard after successful login
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Handle different error formats from backend
      if (err.detail) {
        setError(err.detail);
      } else if (err.message) {
        setError(err.message);
      } else if (err.non_field_errors) {
        setError(err.non_field_errors.join(', '));
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ubuntu-green-lighter to-ubuntu-blue-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-ubuntu-green rounded-full flex items-center justify-center mb-6 shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-ubuntu-gray-900 mb-3">
            Welcome Back
          </h2>
          <p className="text-ubuntu-gray-600 text-lg">
            Sign in to access your UbuntuCap account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-ubuntu-gray-200">
          <LoginForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />

          {/* Divider */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ubuntu-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-ubuntu-gray-500">New to UbuntuCap?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-4">
            <Link 
              to="/register" 
              className="inline-flex items-center text-ubuntu-green hover:text-ubuntu-green-dark font-semibold transition-colors text-lg"
            >
              Create your UbuntuCap account
              <LogIn className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>

        {/* USSD Option */}
        <div className="bg-ubuntu-blue-light rounded-2xl p-6 border border-ubuntu-blue-light">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-ubuntu-blue mb-1">Using a basic phone?</h3>
              <p className="text-ubuntu-blue text-sm">Access your account via USSD</p>
            </div>
            <Link 
              to="/ussd" 
              className="bg-ubuntu-blue text-white px-4 py-2 rounded-lg hover:bg-ubuntu-blue-dark transition-colors font-medium flex items-center"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              USSD Access
            </Link>
          </div>
          <div className="mt-3 text-center">
            <code className="text-ubuntu-blue font-mono text-sm bg-ubuntu-blue/10 px-3 py-1 rounded">
              *384*12345#
            </code>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-ubuntu-green-lighter rounded-2xl p-6 border border-ubuntu-green-light">
          <div className="flex items-center mb-3">
            <Shield className="w-5 h-5 text-ubuntu-green mr-2" />
            <h3 className="font-semibold text-ubuntu-green-dark">Secure Login</h3>
          </div>
          <p className="text-ubuntu-green-dark text-sm">
            Your account is protected with bank-level security. All data is encrypted and secure.
          </p>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-xs text-ubuntu-gray-500">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-ubuntu-green hover:text-ubuntu-green-dark font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-ubuntu-green hover:text-ubuntu-green-dark font-medium">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Support Info */}
        <div className="text-center">
          <div className="inline-flex items-center text-sm text-ubuntu-gray-600 bg-ubuntu-gray-100 rounded-full px-4 py-2">
            <Phone className="w-4 h-4 mr-2 text-ubuntu-gray-400" />
            Need help?{' '}
            <a href="tel:+254700123456" className="text-ubuntu-green hover:text-ubuntu-green-dark ml-1 font-medium">
              Call 0700 123 456
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;