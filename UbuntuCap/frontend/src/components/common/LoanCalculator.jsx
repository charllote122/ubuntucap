import React, { useState } from 'react'

const LoanCalculator = () => {
  const [amount, setAmount] = useState(5000)
  const [period, setPeriod] = useState(30)

  const calculateLoan = (principal, days) => {
    const interestRate = 0.08 // 8%
    const serviceFee = Math.min(Math.max(principal * 0.02, 50), 500)
    const interest = principal * interestRate * (days / 365)
    const totalDue = principal + interest
    const disbursed = principal - serviceFee

    return {
      principal,
      interestRate: (interestRate * 100).toFixed(1),
      serviceFee,
      interest: interest.toFixed(0),
      totalDue: totalDue.toFixed(0),
      disbursed: disbursed.toFixed(0),
      dailyPayment: (totalDue / days).toFixed(0)
    }
  }

  const terms = calculateLoan(amount, period)

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Calculator</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loan Amount: KSh {amount.toLocaleString()}
          </label>
          <input
            type="range"
            min="500"
            max="50000"
            step="100"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>KSh 500</span>
            <span>KSh 50,000</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Repayment Period: {period} days
          </label>
          <input
            type="range"
            min="15"
            max="90"
            step="15"
            value={period}
            onChange={(e) => setPeriod(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>15 days</span>
            <span>90 days</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">You receive:</span>
              <p className="font-semibold text-green-600">KSh {terms.disbursed}</p>
            </div>
            <div>
              <span className="text-gray-600">Total to repay:</span>
              <p className="font-semibold text-gray-900">KSh {terms.totalDue}</p>
            </div>
            <div>
              <span className="text-gray-600">Service fee:</span>
              <p className="font-semibold text-gray-900">KSh {terms.serviceFee}</p>
            </div>
            <div>
              <span className="text-gray-600">Daily payment:</span>
              <p className="font-semibold text-gray-900">KSh {terms.dailyPayment}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoanCalculator