import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/common/Header'
import { ArrowLeft, Calendar, DollarSign, Clock, CheckCircle, XCircle, Download, Phone, CreditCard } from 'lucide-react'

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
    total_repayable: 51417,
    daily_repayment: 1713.90
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-6 w-6 text-ubuntu-green" />
      case 'pending':
        return <Clock className="h-6 w-6 text-ubuntu-orange" />
      case 'rejected':
        return <XCircle className="h-6 w-6 text-ubuntu-red" />
      default:
        return <Clock className="h-6 w-6 text-ubuntu-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-ubuntu-gray-600 hover:text-ubuntu-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-ubuntu-gray-900">Loan Details</h1>
            <p className="text-ubuntu-gray-600 mt-1">Loan ID: {loan.id}</p>
          </div>
          <div className="w-20"></div> {/* Spacer for balance */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Loan Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Loan Information Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-ubuntu-gray-200">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-ubuntu-gray-900">Loan Information</h2>
                <div className="flex items-center space-x-3">
                  {getStatusIcon(loan.status)}
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(loan.status)}`}>
                    {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-ubuntu-green-lighter rounded-lg p-4 border border-ubuntu-green-light">
                    <label className="block text-sm font-medium text-ubuntu-green-dark mb-2">Loan Amount</label>
                    <div className="flex items-center text-3xl font-bold text-ubuntu-green-dark">
                      <DollarSign className="h-8 w-8 mr-2" />
                      KES {loan.amount.toLocaleString()}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-ubuntu-gray-700 mb-2">Purpose</label>
                    <p className="text-ubuntu-gray-900 text-lg">{loan.purpose}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-ubuntu-gray-700 mb-2">Term</label>
                    <div className="flex items-center text-ubuntu-gray-900">
                      <Calendar className="h-5 w-5 mr-3 text-ubuntu-green" />
                      <span className="text-lg">{loan.term_days} days</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-ubuntu-blue-light rounded-lg p-4 border border-ubuntu-blue-light">
                    <label className="block text-sm font-medium text-ubuntu-blue mb-2">Daily Repayment</label>
                    <div className="flex items-center text-2xl font-bold text-ubuntu-blue">
                      <CreditCard className="h-6 w-6 mr-2" />
                      KES {loan.daily_repayment.toFixed(2)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-ubuntu-gray-700 mb-2">Interest Rate</label>
                    <p className="text-ubuntu-gray-900 text-lg">{loan.interest_rate}%</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-ubuntu-gray-700 mb-2">Application Date</label>
                    <div className="flex items-center text-ubuntu-gray-900">
                      <Calendar className="h-5 w-5 mr-3 text-ubuntu-green" />
                      <span className="text-lg">{new Date(loan.application_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {loan.due_date && (
                    <div>
                      <label className="block text-sm font-medium text-ubuntu-gray-700 mb-2">Due Date</label>
                      <div className="flex items-center text-ubuntu-gray-900">
                        <Calendar className="h-5 w-5 mr-3 text-ubuntu-green" />
                        <span className="text-lg">{new Date(loan.due_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Repayment Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-ubuntu-gray-200">
              <h3 className="text-xl font-semibold text-ubuntu-gray-900 mb-6">Repayment Progress</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-ubuntu-gray-700 font-medium">Amount Repaid</span>
                  <span className="text-2xl font-bold text-ubuntu-green">KES {loan.repaid_amount.toLocaleString()}</span>
                </div>
                
                <div className="w-full bg-ubuntu-gray-200 rounded-full h-3">
                  <div 
                    className="bg-ubuntu-green h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(loan.repaid_amount / loan.total_repayable) * 100}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-ubuntu-red-light rounded-lg p-4 border border-ubuntu-red-light">
                    <label className="block text-sm font-medium text-ubuntu-red mb-1">Remaining Balance</label>
                    <span className="text-xl font-bold text-ubuntu-red">KES {loan.remaining_balance.toLocaleString()}</span>
                  </div>
                  
                  <div className="bg-ubuntu-blue-light rounded-lg p-4 border border-ubuntu-blue-light">
                    <label className="block text-sm font-medium text-ubuntu-blue mb-1">Total Repayable</label>
                    <span className="text-xl font-bold text-ubuntu-blue">KES {loan.total_repayable.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-ubuntu-gray-200">
              <h3 className="font-semibold text-ubuntu-gray-900 mb-4 text-lg">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-ubuntu-green text-white py-3 px-4 rounded-lg hover:bg-ubuntu-green-dark transition-colors font-semibold shadow-sm hover:shadow-md flex items-center justify-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Make Payment
                </button>
                <button className="w-full border border-ubuntu-gray-300 text-ubuntu-gray-700 py-3 px-4 rounded-lg hover:bg-ubuntu-gray-50 transition-colors font-medium flex items-center justify-center">
                  <Download className="h-5 w-5 mr-2" />
                  Download Statement
                </button>
                <button className="w-full border border-ubuntu-gray-300 text-ubuntu-gray-700 py-3 px-4 rounded-lg hover:bg-ubuntu-gray-50 transition-colors font-medium flex items-center justify-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Support
                </button>
              </div>
            </div>

            {/* Loan Summary */}
            <div className="bg-ubuntu-green-lighter border border-ubuntu-green-light rounded-2xl p-6">
              <h3 className="font-semibold text-ubuntu-green-dark mb-4 text-lg">Loan Summary</h3>
              <div className="space-y-3 text-ubuntu-green-dark">
                <div className="flex justify-between items-center py-2 border-b border-ubuntu-green-light">
                  <span>Principal:</span>
                  <span className="font-semibold">KES {loan.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-ubuntu-green-light">
                  <span>Interest:</span>
                  <span className="font-semibold">KES {(loan.total_repayable - loan.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-ubuntu-green-light">
                  <span>Disbursement Fee:</span>
                  <span className="font-semibold">KES 100</span>
                </div>
                <div className="flex justify-between items-center pt-2 font-bold text-lg">
                  <span>Total:</span>
                  <span>KES {loan.total_repayable.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-ubuntu-blue-light border border-ubuntu-blue-light rounded-2xl p-6">
              <h3 className="font-semibold text-ubuntu-blue mb-3">Need Help?</h3>
              <div className="space-y-2 text-sm text-ubuntu-blue">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>0700 123 456</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  <span>WhatsApp Support</span>
                </div>
                <div className="mt-3 text-xs">
                  <p>Available 24/7 for loan-related inquiries</p>
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