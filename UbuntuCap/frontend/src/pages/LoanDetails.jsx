import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/common/Header'
import { ArrowLeft, Calendar, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react'

const LoanDetails = () => {
  const { loanId } = useParams()
  const navigate = useNavigate()

  // This would come from your API
  const loan = {
    id: loanId,
    amount: 50000,
    purpose: "Inventory purchase for retail business",
    status: "approved",
    term_days: 30,
    interest_rate: 8.5,
    application_date: "2024-01-15T10:30:00Z",
    due_date: "2024-02-14T23:59:59Z",
    repaid_amount: 15000,
    remaining_balance: 36417,
    total_repayable: 51417
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500" />
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-500" />
      default:
        return <Clock className="h-6 w-6 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Loan Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Loan Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Loan Information</h2>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(loan.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(loan.status)}`}>
                    {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Loan Amount</label>
                    <div className="flex items-center text-2xl font-bold text-gray-900">
                      <DollarSign className="h-6 w-6 mr-1 text-green-600" />
                      KES {loan.amount.toLocaleString()}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Purpose</label>
                    <p className="text-gray-900">{loan.purpose}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Term</label>
                    <p className="text-gray-900">{loan.term_days} days</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Interest Rate</label>
                    <p className="text-gray-900">{loan.interest_rate}%</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Application Date</label>
                    <div className="flex items-center text-gray-900">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {new Date(loan.application_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {loan.due_date && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Due Date</label>
                      <div className="flex items-center text-gray-900">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(loan.due_date).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Repayment Progress */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Repayment Progress</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount Repaid</span>
                  <span className="font-medium">KES {loan.repaid_amount.toLocaleString()}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(loan.repaid_amount / loan.total_repayable) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining Balance</span>
                  <span className="font-medium text-red-600">KES {loan.remaining_balance.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Repayable</span>
                  <span className="font-medium text-blue-600">KES {loan.total_repayable.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Make Payment
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Download Statement
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Contact Support
                </button>
              </div>
            </div>

            {/* Loan Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Loan Summary</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex justify-between">
                  <span>Principal:</span>
                  <span>KES {loan.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest:</span>
                  <span>KES {(loan.total_repayable - loan.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-blue-200 pt-2">
                  <span>Total:</span>
                  <span>KES {loan.total_repayable.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoanDetails