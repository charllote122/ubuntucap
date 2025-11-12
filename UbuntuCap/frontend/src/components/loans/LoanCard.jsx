import React from 'react'

const LoanCard = ({ loan }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">KSh {loan.amount?.toLocaleString()}</h3>
          <p className="text-gray-600">{loan.purpose}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      </div>
      
      <div className="text-sm text-gray-600">
        Due: {loan.due ? new Date(loan.due).toLocaleDateString() : 'N/A'}
      </div>
    </div>
  )
}

export default LoanCard