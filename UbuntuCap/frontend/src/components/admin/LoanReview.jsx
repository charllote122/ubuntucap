import React from 'react'

const LoanReview = () => {
  const applications = [
    {
      id: 1,
      user: 'John Doe',
      amount: 5000,
      purpose: 'Inventory Purchase',
      creditScore: 78,
      applied: '2024-01-20',
      status: 'pending'
    },
    {
      id: 2,
      user: 'Jane Smith',
      amount: 10000,
      purpose: 'Equipment Buy',
      creditScore: 85,
      applied: '2024-01-19',
      status: 'pending'
    }
  ]

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Applications Review</h3>
      
      <div className="space-y-4">
        {applications.map((application) => (
          <div key={application.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  KSh {application.amount.toLocaleString()}
                </h4>
                <p className="text-gray-600">{application.purpose}</p>
                <p className="text-sm text-gray-500">Applied by {application.user}</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                {application.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="text-gray-600">Credit Score:</span>
                <p className="font-medium">{application.creditScore}/100</p>
              </div>
              <div>
                <span className="text-gray-600">Applied:</span>
                <p className="font-medium">{new Date(application.applied).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="bg-ubuntu-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-ubuntu-green-dark">
                Approve
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">
                Reject
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LoanReview