import React from 'react'

const UserDashboard = () => {
  // Mock data - will be replaced with API calls
  const userData = {
    name: "John Doe",
    creditScore: 78,
    availableCredit: 25000,
    activeLoans: 1,
    totalRepaid: 15000
  }

  const recentActivity = [
    { type: 'loan_disbursed', amount: 5000, date: '2 days ago', status: 'completed' },
    { type: 'repayment', amount: 2150, date: '1 week ago', status: 'completed' },
    { type: 'application', amount: 10000, date: '2 weeks ago', status: 'approved' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-ubuntu-green rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">UbuntuCap Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {userData.name}</span>
              <button className="bg-ubuntu-green text-white px-4 py-2 rounded-lg hover:bg-ubuntu-green-dark">
                Apply for Loan
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">💳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Credit</p>
                <p className="text-2xl font-bold text-gray-900">KSh {userData.availableCredit.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Credit Score</p>
                <p className="text-2xl font-bold text-gray-900">{userData.creditScore}/100</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Loans</p>
                <p className="text-2xl font-bold text-gray-900">{userData.activeLoans}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Repaid</p>
                <p className="text-2xl font-bold text-gray-900">KSh {userData.totalRepaid.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-ubuntu-green hover:bg-ubuntu-green-light transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Apply for New Loan</h3>
                    <p className="text-sm text-gray-500">Get funding for your business growth</p>
                  </div>
                  <span className="text-2xl">🚀</span>
                </div>
              </button>

              <button className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Make Repayment</h3>
                    <p className="text-sm text-gray-500">Pay back your active loan</p>
                  </div>
                  <span className="text-2xl">💸</span>
                </div>
              </button>

              <button className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">View Loan History</h3>
                    <p className="text-sm text-gray-500">Check your past transactions</p>
                  </div>
                  <span className="text-2xl">📈</span>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      activity.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.type === 'loan_disbursed' && 'Loan Disbursed'}
                        {activity.type === 'repayment' && 'Loan Repayment'}
                        {activity.type === 'application' && 'Loan Application'}
                      </p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    activity.type === 'repayment' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {activity.type === 'repayment' ? '-' : '+'}KSh {activity.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard