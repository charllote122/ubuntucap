import React, { useState } from 'react'
import Header from '../components/common/Header'
import { Calculator, DollarSign, Calendar, TrendingUp } from 'lucide-react'

const LoanCalculator = () => {
  const [calculation, setCalculation] = useState({
    amount: 10000,
    term_days: 30
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const calculateRepayment = async () => {
    setLoading(true)
    try {
      // This would call your actual API
      // const response = await loanService.calculateRepayment(calculation);
      // setResult(response.calculation);
      
      // Simulate API call
      setTimeout(() => {
        const interestRate = 8.5
        const interestAmount = calculation.amount * interestRate / 100
        const totalRepayable = parseFloat(calculation.amount) + interestAmount
        const dailyRepayment = totalRepayable / calculation.term_days
        
        setResult({
          loan_amount: parseFloat(calculation.amount),
          term_days: calculation.term_days,
          interest_rate: interestRate,
          total_repayable: totalRepayable,
          daily_repayment: dailyRepayment,
          disbursement_fee: 100.0
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Calculation failed:', error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Calculator className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan Calculator</h1>
          <p className="text-gray-600">Calculate your loan repayment schedule</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Calculate Your Loan</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount (KES)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    value={calculation.amount}
                    onChange={(e) => setCalculation({...calculation, amount: e.target.value})}
                    className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1000"
                    max="500000"
                    step="1000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum: 1,000 KES | Maximum: 500,000 KES</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repayment Period
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    value={calculation.term_days}
                    onChange={(e) => setCalculation({...calculation, term_days: parseInt(e.target.value)})}
                    className="pl-10 w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={calculateRepayment}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors font-semibold"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Calculating...
                  </div>
                ) : (
                  'Calculate Repayment'
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {result && (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Calculation Results
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Loan Amount:</span>
                    <span className="font-semibold">KES {result.loan_amount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Term:</span>
                    <span className="font-semibold">{result.term_days} days</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Interest Rate:</span>
                    <span className="font-semibold text-blue-600">{result.interest_rate}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Disbursement Fee:</span>
                    <span className="font-semibold">KES {result.disbursement_fee}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Daily Repayment:</span>
                    <span className="font-semibold">KES {result.daily_repayment.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-4">
                    <span className="text-blue-900 font-semibold">Total Repayable:</span>
                    <span className="text-blue-900 font-bold text-lg">KES {result.total_repayable.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-3">How It Works</h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>8.5% fixed interest rate</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>KES 100 disbursement fee</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>No hidden charges</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Flexible repayment terms</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoanCalculator