import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Smartphone, Mail } from 'lucide-react';

function ForgotPassword() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [method, setMethod] = useState('phone'); // 'phone' or 'email'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // TODO: Implement password reset logic
    setTimeout(() => {
      if (method === 'phone') {
        setMessage(`Password reset instructions have been sent to ${phoneNumber} via SMS.`);
      } else {
        setMessage('Password reset instructions have been sent to your email.');
      }
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-ubuntu-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-ubuntu-green-light rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-ubuntu-green" />
          </div>
          <h2 className="text-3xl font-bold text-ubuntu-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-ubuntu-gray-600">
            Enter your {method === 'phone' ? 'phone number' : 'email'} to receive reset instructions
          </p>
        </div>

        {/* Method Toggle */}
        <div className="flex bg-ubuntu-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setMethod('phone')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md flex items-center justify-center space-x-2 transition-colors ${
              method === 'phone'
                ? 'bg-white text-ubuntu-green shadow-sm'
                : 'text-ubuntu-gray-600 hover:text-ubuntu-gray-900'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span>SMS</span>
          </button>
          <button
            type="button"
            onClick={() => setMethod('email')}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md flex items-center justify-center space-x-2 transition-colors ${
              method === 'email'
                ? 'bg-white text-ubuntu-green shadow-sm'
                : 'text-ubuntu-gray-600 hover:text-ubuntu-gray-900'
            }`}
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </button>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Success Message */}
          {message && (
            <div className="bg-ubuntu-green-lighter border border-ubuntu-green-light text-ubuntu-green-dark px-4 py-3 rounded-lg flex items-center">
              <div className="w-2 h-2 bg-ubuntu-green rounded-full mr-3"></div>
              {message}
            </div>
          )}
          
          {/* Input Field */}
          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-ubuntu-gray-700 mb-2">
              {method === 'phone' ? 'Phone Number' : 'Email Address'}
            </label>
            <div className="relative">
              <input
                id="contact"
                type={method === 'phone' ? 'tel' : 'email'}
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-ubuntu-gray-300 placeholder-ubuntu-gray-400 text-ubuntu-gray-900 focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green focus:z-10 sm:text-sm transition-colors"
                placeholder={method === 'phone' ? '0712 345 678' : 'you@example.com'}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {method === 'phone' ? (
                  <Smartphone className="h-5 w-5 text-ubuntu-gray-400" />
                ) : (
                  <Mail className="h-5 w-5 text-ubuntu-gray-400" />
                )}
              </div>
            </div>
            <p className="mt-2 text-xs text-ubuntu-gray-500">
              {method === 'phone' 
                ? 'Enter your phone number with country code' 
                : 'Enter the email address associated with your account'
              }
            </p>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading || !phoneNumber}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-ubuntu-green hover:bg-ubuntu-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ubuntu-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                `Send ${method === 'phone' ? 'SMS' : 'Email'} Instructions`
              )}
            </button>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center text-sm font-medium text-ubuntu-green hover:text-ubuntu-green-dark transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign in
            </Link>
          </div>

          {/* Help Text */}
          <div className="bg-ubuntu-blue-light border border-ubuntu-blue-light rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Smartphone className="h-5 w-5 text-ubuntu-blue" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-ubuntu-blue">
                  Can't access your {method === 'phone' ? 'phone' : 'email'}?
                </h3>
                <div className="mt-2 text-sm text-ubuntu-blue">
                  <p>
                    Contact our support team at{' '}
                    <a href="tel:+254700123456" className="font-medium underline">
                      0700 123 456
                    </a>{' '}
                    for assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-xs text-ubuntu-gray-500">
            Need help?{' '}
            <a href="mailto:support@ubuntucap.com" className="text-ubuntu-green hover:text-ubuntu-green-dark font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;