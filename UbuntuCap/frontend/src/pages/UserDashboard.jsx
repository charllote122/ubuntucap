import React, { useState, useEffect } from 'react'
import Header from '../components/common/Header'
import StatsCard from '../components/common/StatsCard'
import LoanCard from '../components/loans/LoanCard'
import RepaymentHistory from '../components/loans/RepaymentHistory'
import { useAuth } from '../contexts/AuthContext'

const UserDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [userData, setUserData] = useState(null)
  const [loans, setLoans] = useState([])

  useEffect(() => {
    // Mock data - replace with API call
    setUserData({
      name: "John Doe",
      phone: "254712345678",
      business: "Doe Enterprises",
      creditScore: 78,
      availableCredit: 25000,
      activeLoans: 1,
      totalBorrowed: 15000,
      totalRepaid: 12000
    })

    setLoans([
      {
        id: 1,
        amount: 5000,
        purpose: "Inventory Purchase",
        status: "active",
        disbursed: "2024-01-15",
        due: "2024-02-15",
        repaid: 2500,
        totalDue: 5350
      }
    ])
  }, [])

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {userData.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's your business financing overview
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <a 
                href="/apply" 
                className="bg-ubuntu-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-ubuntu-green-dark transition-colors"
              >
                Apply for Loan
              </a>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            number={`KSh ${userData.availableCredit.toLocaleString()}`}
            label="Available Credit"
            icon="💳"
            color="green"
          />
          <StatsCard 
            number={`${userData.creditScore}/100`}
            label="Credit Score"
            icon="📊"
            color="blue"
          />
          <StatsCard 
            number={userData.activeLoans}
            label="Active Loans"
            icon="💰"
            color="orange"
          />
          <StatsCard 
            number={`KSh ${userData.totalRepaid.toLocaleString()}`}
            label="Total Repaid"
            icon="✅"
            color="purple"
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'loans', 'repayments', 'profile'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-ubuntu-green text-ubuntu-green'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-ubuntu-green hover:bg-ubuntu-green-light transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Apply for New Loan</h4>
                          <p className="text-sm text-gray-500">Get funding for your business growth</p>
                        </div>
                        <span className="text-2xl">🚀</span>
                      </div>
                    </button>

                    <button className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Make Repayment</h4>
                          <p className="text-sm text-gray-500">Pay back your active loan</p>
                        </div>
                        <span className="text-2xl">💸</span>
                      </div>
                    </button>

                    <button className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">View Loan History</h4>
                          <p className="text-sm text-gray-500">Check your past transactions</p>
                        </div>
                        <span className="text-2xl">📈</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <RepaymentHistory />
                </div>
              </div>
            )}

            {activeTab === 'loans' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Loans</h3>
                <div className="space-y-4">
                  {loans.map(loan => (
                    <LoanCard key={loan.id} loan={loan} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'repayments' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Repayment History</h3>
                <RepaymentHistory detailed={true} />
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="mt-1 text-gray-900">{userData.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <p className="mt-1 text-gray-900">{userData.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                    <p className="mt-1 text-gray-900">{userData.business}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Credit Score</label>
                    <p className="mt-1 text-gray-900">{userData.creditScore}/100</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard