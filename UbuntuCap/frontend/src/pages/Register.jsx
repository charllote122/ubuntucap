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
      const result = await register(formData);
      if (result.success) {
        setSuccess(true);
        // Show success message for 2 seconds, then redirect to LOGIN
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.error || 'Registration failed');
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
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ubuntu-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-ubuntu-green-light rounded-full mb-4">
            <UserPlus className="w-10 h-10 text-ubuntu-green" />
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
            Registration successful! Redirecting to login...  {/* Updated message */}
          </div>
        )}

        {/* Register Form */}
        <RegisterForm 
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />

        {/* Login Link */}
        <div className="text-center">
          <Link 
            to="/login" 
            className="text-ubuntu-green hover:text-ubuntu-green-dark font-medium transition-colors"
          >
            Already have an account? Sign in
          </Link>
        </div>

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