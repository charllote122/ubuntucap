import React from 'react'
import Header from '../components/common/Header'
import { User, Mail, Phone, Building, MapPin, Calendar, Edit2, Shield, CreditCard } from 'lucide-react'

const Profile = () => {
  // This would come from your API
  const user = {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone_number: "+254712345678",
    business_name: "Fresh Produce Ltd",
    business_type: "Retail",
    business_location: "Nairobi, Kenya",
    created_at: "2024-01-01T00:00:00Z",
    kyc_status: "verified",
    loan_limit: 500000
  }

  const getKycStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-ubuntu-green-light text-ubuntu-green-dark'
      case 'pending':
        return 'bg-ubuntu-orange-light text-ubuntu-orange'
      case 'rejected':
        return 'bg-ubuntu-red-light text-ubuntu-red'
      default:
        return 'bg-ubuntu-gray-100 text-ubuntu-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-ubuntu-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-ubuntu-gray-200">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-ubuntu-green-light rounded-full mb-6">
              <User className="w-12 h-12 text-ubuntu-green" />
            </div>
            <h1 className="text-4xl font-bold text-ubuntu-gray-900 mb-2">My Profile</h1>
            <p className="text-ubuntu-gray-600 text-lg">Manage your account and business information</p>
            
            {/* KYC Status Badge */}
            <div className="inline-flex items-center mt-4 px-4 py-2 rounded-full text-sm font-semibold bg-ubuntu-green-light text-ubuntu-green-dark">
              <Shield className="w-4 h-4 mr-2" />
              KYC {user.kyc_status.charAt(0).toUpperCase() + user.kyc_status.slice(1)}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-ubuntu-gray-900 border-b border-ubuntu-gray-200 pb-3 flex items-center">
                <User className="w-5 h-5 mr-2 text-ubuntu-green" />
                Personal Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-ubuntu-gray-50 rounded-lg border border-ubuntu-gray-200">
                  <User className="h-6 w-6 text-ubuntu-green" />
                  <div>
                    <p className="text-sm text-ubuntu-gray-600">Full Name</p>
                    <p className="font-semibold text-ubuntu-gray-900 text-lg">
                      {user.first_name} {user.last_name}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-ubuntu-gray-50 rounded-lg border border-ubuntu-gray-200">
                  <Mail className="h-6 w-6 text-ubuntu-green" />
                  <div>
                    <p className="text-sm text-ubuntu-gray-600">Email Address</p>
                    <p className="font-semibold text-ubuntu-gray-900 text-lg">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-ubuntu-gray-50 rounded-lg border border-ubuntu-gray-200">
                  <Phone className="h-6 w-6 text-ubuntu-green" />
                  <div>
                    <p className="text-sm text-ubuntu-gray-600">Phone Number</p>
                    <p className="font-semibold text-ubuntu-gray-900 text-lg">{user.phone_number}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-ubuntu-gray-50 rounded-lg border border-ubuntu-gray-200">
                  <Calendar className="h-6 w-6 text-ubuntu-green" />
                  <div>
                    <p className="text-sm text-ubuntu-gray-600">Member Since</p>
                    <p className="font-semibold text-ubuntu-gray-900 text-lg">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-ubuntu-gray-900 border-b border-ubuntu-gray-200 pb-3 flex items-center">
                <Building className="w-5 h-5 mr-2 text-ubuntu-green" />
                Business Information
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-ubuntu-gray-50 rounded-lg border border-ubuntu-gray-200">
                  <Building className="h-6 w-6 text-ubuntu-green" />
                  <div>
                    <p className="text-sm text-ubuntu-gray-600">Business Name</p>
                    <p className="font-semibold text-ubuntu-gray-900 text-lg">{user.business_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-ubuntu-gray-50 rounded-lg border border-ubuntu-gray-200">
                  <Building className="h-6 w-6 text-ubuntu-green" />
                  <div>
                    <p className="text-sm text-ubuntu-gray-600">Business Type</p>
                    <p className="font-semibold text-ubuntu-gray-900 text-lg">{user.business_type}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-ubuntu-gray-50 rounded-lg border border-ubuntu-gray-200">
                  <MapPin className="h-6 w-6 text-ubuntu-green" />
                  <div>
                    <p className="text-sm text-ubuntu-gray-600">Business Location</p>
                    <p className="font-semibold text-ubuntu-gray-900 text-lg">{user.business_location}</p>
                  </div>
                </div>

                {/* Loan Limit */}
                <div className="flex items-center space-x-4 p-4 bg-ubuntu-green-lighter rounded-lg border border-ubuntu-green-light">
                  <CreditCard className="h-6 w-6 text-ubuntu-green" />
                  <div>
                    <p className="text-sm text-ubuntu-green-dark">Current Loan Limit</p>
                    <p className="font-semibold text-ubuntu-green-dark text-lg">
                      KES {user.loan_limit.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-ubuntu-blue-light rounded-xl p-6 border border-ubuntu-blue-light">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-ubuntu-blue text-sm font-medium">Account Status</p>
                  <p className="text-ubuntu-blue text-xl font-bold mt-1">Active</p>
                </div>
                <Shield className="h-8 w-8 text-ubuntu-blue" />
              </div>
            </div>

            <div className="bg-ubuntu-green-lighter rounded-xl p-6 border border-ubuntu-green-light">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-ubuntu-green-dark text-sm font-medium">KYC Status</p>
                  <p className="text-ubuntu-green-dark text-xl font-bold mt-1">Verified</p>
                </div>
                <User className="h-8 w-8 text-ubuntu-green" />
              </div>
            </div>

            <div className="bg-ubuntu-purple-light rounded-xl p-6 border border-ubuntu-purple-light">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-ubuntu-purple text-sm font-medium">Loan Limit</p>
                  <p className="text-ubuntu-purple text-xl font-bold mt-1">
                    KES {user.loan_limit.toLocaleString()}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-ubuntu-purple" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-8 border-t border-ubuntu-gray-200">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="flex-1 bg-ubuntu-green text-white py-4 px-6 rounded-xl hover:bg-ubuntu-green-dark transition-colors font-semibold shadow-sm hover:shadow-md flex items-center justify-center">
                <Edit2 className="w-5 h-5 mr-2" />
                Edit Profile
              </button>
              <button className="flex-1 border border-ubuntu-gray-300 text-ubuntu-gray-700 py-4 px-6 rounded-xl hover:bg-ubuntu-gray-50 transition-colors font-semibold flex items-center justify-center">
                <Shield className="w-5 h-5 mr-2" />
                Change Password
              </button>
              <button className="flex-1 border border-ubuntu-gray-300 text-ubuntu-gray-700 py-4 px-6 rounded-xl hover:bg-ubuntu-gray-50 transition-colors font-semibold flex items-center justify-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Update KYC
              </button>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 bg-ubuntu-blue-light rounded-xl p-6 border border-ubuntu-blue-light">
            <h3 className="font-semibold text-ubuntu-blue mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Account Security
            </h3>
            <p className="text-ubuntu-blue text-sm">
              Your account is secured with bank-level encryption. For any security concerns, 
              contact our support team immediately at{' '}
              <a href="tel:+254700123456" className="font-semibold underline">0700 123 456</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile