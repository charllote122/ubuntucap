import React from 'react'

const RepaymentHistory = ({ detailed = false }) => {
  const repayments = [
    {
      id: 1,
      amount: 2150,
      date: '2024-01-20',
      type: 'repayment',
      status: 'completed'
    },
    {
      id: 2,
      amount: 5000,
      date: '2024-01-15',
      type: 'disbursement',
      status: 'completed'
    }
  ]

  return (
    <div className="space-y-3">
      {repayments.map((repayment) => (
        <div key={repayment.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
          <div className="flex items-center">
            <span className="text-xl mr-3">
              {repayment.type === 'repayment' ? '💸' : '💰'}
            </span>
            <div>
              <p className="text-sm font-medium text-gray-900 capitalize">
                {repayment.type === 'disbursement' ? 'Loan Disbursed' : 'Loan Repayment'}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(repayment.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <span className={`font-semibold ${
            repayment.type === 'repayment' ? 'text-red-600' : 'text-green-600'
          }`}>
            {repayment.type === 'repayment' ? '-' : '+'}KSh {repayment.amount.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

export default RepaymentHistory