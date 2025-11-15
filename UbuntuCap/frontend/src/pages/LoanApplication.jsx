import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/common/Header'
import ApplicationForm from '../components/loans/ApplicationForm'
import LoanCalculator from '../components/loans/LoanCalculator'
import StatusMessage from '../components/common/StatusMessage'
import { Lock, Clock, CheckCircle, Phone, MessageCircle } from 'lucide-react'

const LoanApplication = () => {
  const navigate = useNavigate()
  const [showCalculator, setShowCalculator] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('access_token')
      
      if (!token) {
        setIsAuthenticated(false)
        setIsLoading(false)
        return
      }

      // Verify token is valid by fetching user profile
      const response = await fetch('/api/auth/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUserProfile(userData)
        setIsAuthenticated(true)
      } else {
        // Token is invalid or expired
        localStorage.removeItem('access_token')
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Error checking authentication:', error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch('/api/auth/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUserProfile(userData)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const handleApplicationSubmit = async (applicationData) => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch('/api/loans/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(applicationData)
      })

      const data = await response.json()

      if (data.success) {
        setApplicationStatus({
          type: 'success',
          title: data.status === 'approved' ? 'Loan Approved!' : 'Application Submitted',
          message: data.message,
          loanId: data.loan_id || data.application_id,
          status: data.status
        })

        // Redirect to dashboard after 3 seconds if approved, stay if pending
        if (data.status === 'approved') {
          setTimeout(() => {
            navigate('/dashboard')
          }, 3000)
        }
      } else {
        setApplicationStatus({
          type: 'error',
          title: 'Application Failed',
          message: data.message || 'Please try again later'
        })
      }
    } catch (error) {
      setApplicationStatus({
        type: 'error',
        title: 'Network Error',
        message: 'Unable to submit application. Please check your connection.'
      })
    }
  }

  const handleClearStatus = () => {
    setApplicationStatus(null)
  }

  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: '/apply-loan' } })
  }

  const handleRegisterRedirect = () => {
    navigate('/register', { state: { from: '/apply-loan' } })
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ubuntu-green-lighter to-ubuntu-blue-light">
        <Header />
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-ubuntu-gray-100 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ubuntu-green mx-auto"></div>
            <p className="mt-4 text-ubuntu-gray-600">Checking authentication...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show authentication required message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ubuntu-green-lighter to-ubuntu-blue-light">
        <Header />
        
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-ubuntu-gray-100 text-center">
            <div className="max-w-md mx-auto">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-ubuntu-red-light rounded-full mb-6">
                <Lock className="w-10 h-10 text-ubuntu-red" />
              </div>

              {/* Message */}
              <h1 className="text-2xl font-bold text-ubuntu-gray-900 mb-4">Authentication Required</h1>
              <p className="text-ubuntu-gray-600 mb-6">
                You need to be logged in to apply for a business loan. Please register or login to continue with your application.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleLoginRedirect}
                  className="px-6 py-3 bg-ubuntu-green text-white rounded-lg hover:bg-ubuntu-green-dark transition-colors font-medium shadow-sm hover:shadow-md"
                >
                  Login to Your Account
                </button>
                <button
                  onClick={handleRegisterRedirect}
                  className="px-6 py-3 bg-ubuntu-blue text-white rounded-lg hover:bg-ubuntu-blue-dark transition-colors font-medium shadow-sm hover:shadow-md"
                >
                  Create New Account
                </button>
              </div>

              {/* Benefits */}
              <div className="mt-8 p-6 bg-ubuntu-gray-50 rounded-lg text-left border border-ubuntu-gray-200">
                <h3 className="font-semibold text-ubuntu-gray-900 mb-3">Why Register?</h3>
                <ul className="space-y-2 text-sm text-ubuntu-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-ubuntu-green mt-0.5 mr-2 flex-shrink-0" />
                    Fast loan application with pre-filled business information
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-ubuntu-green mt-0.5 mr-2 flex-shrink-0" />
                    Track your application status in real-time
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-ubuntu-green mt-0.5 mr-2 flex-shrink-0" />
                    Manage your loan repayments and history
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-ubuntu-green mt-0.5 mr-2 flex-shrink-0" />
                    Build your credit profile for better rates
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Original component content for authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-ubuntu-green-lighter to-ubuntu-blue-light">
      <Header />
      
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Status Message */}
        {applicationStatus && (
          <StatusMessage
            type={applicationStatus.type}
            title={applicationStatus.title}
            message={applicationStatus.message}
            onClose={handleClearStatus}
            action={applicationStatus.status === 'approved' ? {
              label: 'View Dashboard',
              onClick: () => navigate('/dashboard')
            } : null}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Application Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-ubuntu-gray-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-ubuntu-green-light rounded-full mb-4">
                  <svg className="w-8 h-8 text-ubuntu-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 6l-2-2m2 2l2-2m-2 2v1m0-1h1m-1 0h-1" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-ubuntu-gray-900 mb-2">Business Loan Application</h1>
                <p className="text-ubuntu-gray-600 max-w-md mx-auto">
                  Get the capital you need to grow your business. Fast approval, competitive rates.
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-ubuntu-green-lighter rounded-lg border border-ubuntu-green-light">
                <div className="text-center">
                  <div className="text-2xl font-bold text-ubuntu-green">5 min</div>
                  <div className="text-sm text-ubuntu-gray-600">Application</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-ubuntu-green">24 hrs</div>
                  <div className="text-sm text-ubuntu-gray-600">Approval</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-ubuntu-green">8.5%</div>
                  <div className="text-sm text-ubuntu-gray-600">Interest</div>
                </div>
              </div>

              <ApplicationForm 
                onSubmit={handleApplicationSubmit}
                userProfile={userProfile}
              />
            </div>
          </div>

          {/* Sidebar with Calculator */}
          <div className="space-y-6">
            {/* Calculator Toggle */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-ubuntu-gray-100">
              <button
                onClick={() => setShowCalculator(!showCalculator)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-ubuntu-green to-ubuntu-green-dark text-white rounded-xl hover:from-ubuntu-green-dark hover:to-ubuntu-green transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span className="font-semibold">
                  {showCalculator ? 'Hide Calculator' : 'Loan Calculator'}
                </span>
                <svg 
                  className={`w-5 h-5 transform transition-transform ${showCalculator ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Calculator */}
            {showCalculator && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-ubuntu-gray-100">
                <LoanCalculator />
              </div>
            )}

            {/* Benefits Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-ubuntu-gray-100">
              <h3 className="font-semibold text-ubuntu-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-ubuntu-green mr-2" />
                Why Choose UbuntuCap?
              </h3>
              <ul className="space-y-3 text-sm text-ubuntu-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-ubuntu-green mt-0.5 mr-2 flex-shrink-0" />
                  No collateral required
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-ubuntu-green mt-0.5 mr-2 flex-shrink-0" />
                  Mobile money disbursement
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-ubuntu-green mt-0.5 mr-2 flex-shrink-0" />
                  Flexible repayment terms
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-ubuntu-green mt-0.5 mr-2 flex-shrink-0" />
                  Build your credit score
                </li>
              </ul>
            </div>

            {/* Support Section */}
            <div className="bg-gradient-to-r from-ubuntu-blue to-ubuntu-purple rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-ubuntu-blue-light text-sm mb-4">
                Our team is here to support you through the application process.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Call: 0700 123 456
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp: 0700 123 456
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoanApplication