import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/common/Header'
import ApplicationForm from '../components/loans/ApplicationForm'
import LoanCalculator from '../components/loans/LoanCalculator'
import StatusMessage from '../components/common/StatusMessage'

const LoanApplication = () => {
  const navigate = useNavigate()
  const [showCalculator, setShowCalculator] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState(null)
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    // Fetch user profile to pre-fill business information
    fetchUserProfile()
  }, [])

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
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
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 6l-2-2m2 2l2-2m-2 2v1m0-1h1m-1 0h-1" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Loan Application</h1>
                <p className="text-gray-600 max-w-md mx-auto">
                  Get the capital you need to grow your business. Fast approval, competitive rates.
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">5 min</div>
                  <div className="text-sm text-gray-600">Application</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">24 hrs</div>
                  <div className="text-sm text-gray-600">Approval</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">8.5%</div>
                  <div className="text-sm text-gray-600">Interest</div>
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
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <button
                onClick={() => setShowCalculator(!showCalculator)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
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
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <LoanCalculator />
              </div>
            )}

            {/* Benefits Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Why Choose UbuntuCap?
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No collateral required
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mobile money disbursement
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Flexible repayment terms
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Build your credit score
                </li>
              </ul>
            </div>

            {/* Support Section */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-purple-100 text-sm mb-4">
                Our team is here to support you through the application process.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call: 0700 123 456
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
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