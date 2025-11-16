import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';
import { UserPlus, CheckCircle } from 'lucide-react';

function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      console.log('🔵 [Register] Starting registration with:', formData);
      
      const result = await register(formData);
      console.log('🟢 [Register] Registration result:', result);
      
      if (result.success) {
        setSuccess(true);
        // Show success message for 2 seconds, then redirect to LOGIN
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Registration successful! Please login with your credentials.',
              phone_number: formData.phone_number // Optional: pre-fill phone number
            }
          });
        }, 2000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error('🔴 [Register] Registration error:', err);
      // Handle different error formats from backend
      if (err.phone_number) {
        setError(`Phone number: ${err.phone_number.join(', ')}`);
      } else if (err.email) {
        setError(`Email: ${err.email.join(', ')}`);
      } else if (err.password) {
        setError(`Password: ${err.password.join(', ')}`);
      } else if (err.non_field_errors) {
        setError(err.non_field_errors.join(', '));
      } else if (err.detail) {
        setError(err.detail);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Registration failed. Please check your information and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <UserPlus className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Join UbuntuCap
          </h2>
          <p className="mt-2 text-gray-600">
            Create your account and start growing your business
          </p>
        </div>
        
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <div>
              <p className="font-medium">Registration successful!</p>
              <p className="text-sm">Redirecting to login...</p>
            </div>
          </div>
        )}

        {/* Register Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <RegisterForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <h4 className="font-semibold text-green-800 mb-3">Why Join UbuntuCap?</h4>
          <ul className="space-y-2 text-sm text-green-700">
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