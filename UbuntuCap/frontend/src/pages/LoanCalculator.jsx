import React, { useState } from 'react'
import Header from '../components/common/Header'
import { Calculator, DollarSign, Calendar, TrendingUp, Info } from 'lucide-react'

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
    <div className="min-h-screen bg-ubuntu-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-ubuntu-green-light rounded-full mb-4">
            <Calculator className="w-8 h-8 text-ubuntu-green" />
          </div>
          <h1 className="text-3xl font-bold text-ubuntu-gray-900 mb-2">Loan Calculator</h1>
          <p className="text-ubuntu-gray-600">Calculate your loan repayment schedule</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-ubuntu-gray-200">
            <h2 className="text-xl font-semibold text-ubuntu-gray-900 mb-6">Calculate Your Loan</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-ubuntu-gray-700 mb-2">
                  Loan Amount (KES)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ubuntu-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    value={calculation.amount}
                    onChange={(e) => setCalculation({...calculation, amount: e.target.value})}
                    className="pl-10 w-full px-3 py-3 border border-ubuntu-gray-300 rounded-lg focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors"
                    min="1000"
                    max="500000"
                    step="1000"
                  />
                </div>
                <p className="text-xs text-ubuntu-gray-500 mt-1">Minimum: 1,000 KES | Maximum: 500,000 KES</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-ubuntu-gray-700 mb-2">
                  Repayment Period
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ubuntu-gray-400 h-5 w-5" />
                  <select
                    value={calculation.term_days}
                    onChange={(e) => setCalculation({...calculation, term_days: parseInt(e.target.value)})}
                    className="pl-10 w-full px-3 py-3 border border-ubuntu-gray-300 rounded-lg focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors"
                  >
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                    <option value={120}>120 days</option>
                    <option value={180}>180 days</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={calculateRepayment}
                disabled={loading}
                className="w-full bg-ubuntu-green text-white py-3 px-4 rounded-lg hover:bg-ubuntu-green-dark focus:ring-2 focus:ring-ubuntu-green focus:ring-offset-2 disabled:opacity-50 transition-colors font-semibold shadow-sm hover:shadow-md"
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
              <div className="bg-white rounded-xl shadow-sm p-6 border border-ubuntu-gray-200">
                <h2 className="text-xl font-semibold text-ubuntu-gray-900 mb-6 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-ubuntu-green" />
                  Calculation Results
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-ubuntu-gray-100">
                    <span className="text-ubuntu-gray-600">Loan Amount:</span>
                    <span className="font-semibold text-ubuntu-gray-900">KES {result.loan_amount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-ubuntu-gray-100">
                    <span className="text-ubuntu-gray-600">Term:</span>
                    <span className="font-semibold text-ubuntu-gray-900">{result.term_days} days</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-ubuntu-gray-100">
                    <span className="text-ubuntu-gray-600">Interest Rate:</span>
                    <span className="font-semibold text-ubuntu-green">{result.interest_rate}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-ubuntu-gray-100">
                    <span className="text-ubuntu-gray-600">Disbursement Fee:</span>
                    <span className="font-semibold text-ubuntu-gray-900">KES {result.disbursement_fee}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-ubuntu-gray-200">
                    <span className="text-ubuntu-gray-600">Daily Repayment:</span>
                    <span className="font-semibold text-ubuntu-gray-900">KES {result.daily_repayment.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 bg-ubuntu-green-lighter rounded-lg px-4 border border-ubuntu-green-light">
                    <span className="text-ubuntu-green-dark font-semibold">Total Repayable:</span>
                    <span className="text-ubuntu-green-dark font-bold text-lg">KES {result.total_repayable.toLocaleString()}</span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-ubuntu-blue-light rounded-lg border border-ubuntu-blue-light">
                  <div className="flex items-start">
                    <Info className="w-4 h-4 text-ubuntu-blue mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-ubuntu-blue text-sm font-medium">Good to know</p>
                      <p className="text-ubuntu-blue text-xs mt-1">
                        Your daily repayment is automatically deducted from your mobile money account.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Info Card */}
            <div className="bg-ubuntu-green-lighter border border-ubuntu-green-light rounded-xl p-6">
              <h3 className="font-semibold text-ubuntu-green-dark mb-3 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                How It Works
              </h3>
              <ul className="space-y-2 text-ubuntu-green-dark text-sm">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-ubuntu-green rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>8.5% fixed interest rate</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-ubuntu-green rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>KES 100 disbursement fee</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-ubuntu-green rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>No hidden charges</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-ubuntu-green rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Flexible repayment terms</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-ubuntu-green rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>No collateral required</span>
                </li>
              </ul>
            </div>

            {/* Quick Tips */}
            {!result && (
              <div className="bg-ubuntu-blue-light border border-ubuntu-blue-light rounded-xl p-6">
                <h3 className="font-semibold text-ubuntu-blue mb-3">Quick Tips</h3>
                <ul className="space-y-2 text-ubuntu-blue text-sm">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-ubuntu-blue rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <span>Choose a term that matches your cash flow cycle</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-ubuntu-blue rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <span>Shorter terms have lower total interest</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-ubuntu-blue rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                    <span>Ensure daily repayments fit your business income</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-ubuntu-gray-200 text-center">
            <div className="w-12 h-12 bg-ubuntu-green-light rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-ubuntu-green" />
            </div>
            <h3 className="font-semibold text-ubuntu-gray-900 mb-2">Flexible Terms</h3>
            <p className="text-ubuntu-gray-600 text-sm">
              Choose repayment periods from 30 to 180 days to match your business cycle
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-ubuntu-gray-200 text-center">
            <div className="w-12 h-12 bg-ubuntu-green-light rounded-lg flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-ubuntu-green" />
            </div>
            <h3 className="font-semibold text-ubuntu-gray-900 mb-2">Transparent Pricing</h3>
            <p className="text-ubuntu-gray-600 text-sm">
              No hidden fees. Know exactly what you'll pay before you apply
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-ubuntu-gray-200 text-center">
            <div className="w-12 h-12 bg-ubuntu-green-light rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-ubuntu-green" />
            </div>
            <h3 className="font-semibold text-ubuntu-gray-900 mb-2">Build Credit</h3>
            <p className="text-ubuntu-gray-600 text-sm">
              Timely repayments improve your credit score for better future rates
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoanCalculator