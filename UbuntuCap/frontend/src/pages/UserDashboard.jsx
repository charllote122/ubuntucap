import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import { CreditCard, Users, Zap, Shield, LogOut } from 'lucide-react';

const UserDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // If user is not logged in, show message
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Not Logged In</h2>
          <p className="text-gray-600 mb-6">Please log in to view your dashboard.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-ubuntu-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-ubuntu-green-dark transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Apply for Loan",
      description: "Quick and easy loan application process",
      action: () => navigate('/apply')
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Loan History",
      description: "View your previous loan applications",
      action: () => navigate('/loans')
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Profile Settings",
      description: "Update your personal information",
      action: () => navigate('/profile')
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Security",
      description: "Manage your account security",
      action: () => navigate('/security')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Header />
      
      {/* User Welcome Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {currentUser.first_name} {currentUser.last_name}!
              </h1>
              <p className="text-gray-600 text-lg">
                Here's your business dashboard
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* User Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium">{currentUser.phone_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email Address</p>
                  <p className="font-medium">{currentUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{currentUser.first_name} {currentUser.last_name}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Business Name</p>
                  <p className="font-medium">{currentUser.business_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Business Type</p>
                  <p className="font-medium">{currentUser.business_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">{currentUser.business_location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Business Age</p>
                  <p className="font-medium">{currentUser.business_age_months} months</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <button
                  key={index}
                  onClick={feature.action}
                  className="bg-white border border-gray-200 p-4 rounded-xl hover:shadow-md transition-all text-left group hover:border-ubuntu-green"
                >
                  <div className="w-10 h-10 bg-ubuntu-green-light rounded-lg flex items-center justify-center mb-3 text-ubuntu-green group-hover:bg-ubuntu-green group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loan Status Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Loans</h3>
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">You don't have any active loans yet.</p>
            <button
              onClick={() => navigate('/apply')}
              className="bg-ubuntu-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-ubuntu-green-dark transition-colors"
            >
              Apply for Your First Loan
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;