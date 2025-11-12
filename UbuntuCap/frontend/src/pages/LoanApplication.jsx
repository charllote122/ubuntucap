import React from 'react'
import Header from '../components/common/Header'
import ApplicationForm from '../components/loans/ApplicationForm'

const LoanApplication = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan Application</h1>
            <p className="text-gray-600">Apply for business funding in minutes</p>
          </div>
          
          <ApplicationForm />
        </div>
      </div>
    </div>
  )
}

export default LoanApplication