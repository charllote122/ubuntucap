import React, { useState } from 'react'

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
      const token = localStorage.getItem('access_token')
      const response = await fetch('/api/loans/calculate/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(calculation)
      })
      
      const data = await response.json()
      if (data.success) {
        setResult(data.calculation)
      }
    } catch (error) {
      console.error('Calculation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-4">Loan Calculator</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loan Amount (KES)
          </label>
          <input
            type="number"
            value={calculation.amount}
            onChange={(e) => setCalculation({...calculation, amount: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="1000"
            max="500000"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Repayment Period
          </label>
          <select
            value={calculation.term_days}
            onChange={(e) => setCalculation({...calculation, term_days: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>
        
        <button
          onClick={calculateRepayment}
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Calculating...' : 'Calculate Repayment'}
        </button>
        
        {result && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Repayable:</span>
              <span className="font-semibold">KES {result.total_repayable.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Daily Payment:</span>
              <span className="font-semibold">KES {result.daily_repayment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Interest Rate:</span>
              <span className="font-semibold">{result.interest_rate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Disbursement Fee:</span>
              <span className="font-semibold">KES {result.disbursement_fee}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoanCalculator