import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Building, MapPin, Lock, ArrowRight, CheckCircle } from 'lucide-react';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessType: '',
    businessLocation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Transform form data to match backend API expectations
    const apiData = {
      phone_number: formData.phone,
      email: formData.email,
      password: formData.password,
      password2: formData.confirmPassword,
      first_name: formData.firstName,
      last_name: formData.lastName,
      business_name: formData.businessName,
      business_type: formData.businessType,
      business_location: formData.businessLocation
    };

    console.log('Sending registration data:', apiData);

    try {
      const result = await register(apiData);
      if (result.success) {
        setSuccess(true);
        // Show success message for 2 seconds, then redirect to login
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Registration error:', err);
      // Handle different error formats from backend
      if (err.phone_number) {
        setError(`Phone number: ${err.phone_number.join(', ')}`);
      } else if (err.email) {
        setError(`Email: ${err.email.join(', ')}`);
      } else if (err.password) {
        setError(`Password: ${err.password.join(', ')}`);
      } else if (err.detail) {
        setError(err.detail);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ubuntu-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-ubuntu-green-light rounded-full mb-4">
            <User className="w-10 h-10 text-ubuntu-green" />
          </div>
          <h2 className="text-3xl font-bold text-ubuntu-gray-900">
            Join UbuntuCap
          </h2>
          <p className="mt-2 text-ubuntu-gray-600">
            Create your account and start growing your business
          </p>
        </div>
        
        {/* Success Message */}
        {success && (
          <div className="bg-ubuntu-green-lighter border border-ubuntu-green-light text-ubuntu-green-dark px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Registration successful! Redirecting to login...
          </div>
        )}
        
        {/* Error Message */}
        {error && !success && (
          <div className="bg-ubuntu-red-light border border-ubuntu-red text-ubuntu-red px-4 py-3 rounded-lg flex items-center">
            <div className="w-2 h-2 bg-ubuntu-red rounded-full mr-3"></div>
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="bg-white p-6 rounded-xl border border-ubuntu-gray-200">
            <h3 className="text-lg font-semibold text-ubuntu-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-ubuntu-green" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ubuntu-gray-700 mb-1">
                  First Name
                </label>
                <input
                  name="firstName"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-ubuntu-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ubuntu-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  name="lastName"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-ubuntu-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-ubuntu-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ubuntu-gray-400 h-4 w-4" />
                <input
                  name="phone"
                  type="tel"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-ubuntu-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors"
                  placeholder="+254712345678"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-ubuntu-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ubuntu-gray-400 h-4 w-4" />
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-ubuntu-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white p-6 rounded-xl border border-ubuntu-gray-200">
            <h3 className="text-lg font-semibold text-ubuntu-gray-900 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2 text-ubuntu-green" />
              Business Information
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-ubuntu-gray-700 mb-1">
                Business Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ubuntu-gray-400 h-4 w-4" />
                <input
                  name="businessName"
                  type="text"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-ubuntu-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors"
                  placeholder="Fresh Produce Ltd"
                  value={formData.businessName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ubuntu-gray-700 mb-1">
                  Business Type
                </label>
                <select
                  name="businessType"
                  required
                  className="w-full px-3 py-2 border border-ubuntu-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors"
                  value={formData.businessType}
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  <option value="Retail">Retail</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Service">Service</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ubuntu-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ubuntu-gray-400 h-4 w-4" />
                  <input
                    name="businessLocation"
                    type="text"
                    required
                    className="w-full pl-10 pr-3 py-2 border border-ubuntu-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors"
                    placeholder="Nairobi, Kenya"
                    value={formData.businessLocation}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-white p-6 rounded-xl border border-ubuntu-gray-200">
            <h3 className="text-lg font-semibold text-ubuntu-gray-900 mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-ubuntu-green" />
              Security
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ubuntu-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ubuntu-gray-400 h-4 w-4" />
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full pl-10 pr-3 py-2 border border-ubuntu-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ubuntu-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ubuntu-gray-400 h-4 w-4" />
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    className="w-full pl-10 pr-3 py-2 border border-ubuntu-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-ubuntu-green hover:bg-ubuntu-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ubuntu-green disabled:opacity-50 transition-colors shadow-sm hover:shadow-md"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center">
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link 
              to="/login" 
              className="text-ubuntu-green hover:text-ubuntu-green-dark font-medium transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>

        {/* Benefits Section */}
        <div className="bg-ubuntu-green-lighter rounded-xl p-6 border border-ubuntu-green-light">
          <h4 className="font-semibold text-ubuntu-green-dark mb-3">Why Join UbuntuCap?</h4>
          <ul className="space-y-2 text-sm text-ubuntu-green-dark">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              Quick loan approvals in 24 hours
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              No collateral required
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              Access via USSD and mobile app
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              Build your credit score
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Register;