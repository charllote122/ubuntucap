import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Smartphone, Lock, ArrowRight, Shield, User, MessageCircle } from 'lucide-react';

function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate inputs
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      setLoading(false);
      return;
    }

    if (!password) {
      setError('Please enter your password');
      setLoading(false);
      return;
    }

    // Format phone number (remove spaces, ensure proper format)
    const formattedPhone = phoneNumber.trim().replace(/\s+/g, '');

    try {
      console.log('🔵 [Login] Attempting login with phone:', formattedPhone);
      const result = await login(formattedPhone, password);
      
      if (result.success) {
        console.log('🟢 [Login] Login successful, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('🔴 [Login] Login error:', err);
      setError(err.error || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Basic phone number formatting
    const formatted = value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    setPhoneNumber(formatted);
    setError(''); // Clear error when user types
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(''); // Clear error when user types
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
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-ubuntu-red-light border border-ubuntu-red text-ubuntu-red px-4 py-3 rounded-lg flex items-start">
                <div className="w-2 h-2 bg-ubuntu-red rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Phone Number Field */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-ubuntu-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Smartphone className="h-5 w-5 text-ubuntu-gray-400" />
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-ubuntu-gray-300 rounded-lg placeholder-ubuntu-gray-400 focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors"
                  placeholder="712 345 678"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  disabled={loading}
                />
              </div>
              <p className="mt-1 text-xs text-ubuntu-gray-500">
                Enter your registered phone number
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ubuntu-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-ubuntu-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-ubuntu-gray-300 rounded-lg placeholder-ubuntu-gray-400 focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={loading}
                  minLength={6}
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-ubuntu-green focus:ring-ubuntu-green border-ubuntu-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-ubuntu-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  to="/forgot-password" 
                  className="font-medium text-ubuntu-green hover:text-ubuntu-green-dark transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full flex justify-center items-center py-4 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-ubuntu-green hover:bg-ubuntu-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ubuntu-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  Sign in to your account
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-ubuntu-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-ubuntu-gray-500">New to UbuntuCap?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <Link 
                to="/register" 
                className="inline-flex items-center text-ubuntu-green hover:text-ubuntu-green-dark font-semibold transition-colors text-lg"
              >
                Create your UbuntuCap account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </form>
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