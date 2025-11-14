import React, { useState, useEffect } from 'react'
import Header from '../components/common/Header'
import UserManagement from '../components/admin/UserManagement'
import LoanReview from '../components/admin/LoanReview'
import Reports from '../components/admin/Reports'
import { adminService } from '../services/adminService'
import { RefreshCw, AlertCircle } from 'lucide-react'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      const [statsData, activityData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getRecentActivity()
      ])
      
      setStats(statsData)
      setRecentActivity(activityData)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setError(error.error || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    fetchDashboardData()
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'users', name: 'User Management', icon: '👥' },
    { id: 'loans', name: 'Loan Review', icon: '💰' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈' }
  ]

  const StatCard = ({ title, value, change, icon, color, format = 'number' }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      orange: 'bg-orange-100 text-orange-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600'
    }

    const formatValue = (val) => {
      if (format === 'currency') {
        return `KSh ${val?.toLocaleString() || '0'}`
      }
      if (format === 'percentage') {
        return `${val?.toFixed(1) || '0'}%`
      }
      return val?.toLocaleString() || '0'
    }

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatValue(value)}</p>
            {change && (
              <p className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <span className="text-xl">{icon}</span>
          </div>
        </div>
      </div>
    )
  }

  const OverviewTab = () => {
    if (!stats) return null

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-2">Platform Health</h4>
            <p className="text-blue-700 text-sm">
              The platform is operating normally. All systems are functional and performance is optimal.
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="font-semibold text-green-900 mb-2">Loan Performance</h4>
            <p className="text-green-700 text-sm">
              Repayment rates are strong at {stats.repaymentRate}%. Continue monitoring for optimal performance.
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Key Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.activeLoans}</div>
              <div className="text-sm text-gray-600">Active Loans</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">
                KSh {stats.totalDisbursed ? (stats.totalDisbursed / 1000000).toFixed(1) : 0}M
              </div>
              <div className="text-sm text-gray-600">Portfolio Size</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
              <div className="text-sm text-gray-600">Registered Users</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Recent Activity</h4>
          <div className="bg-white border border-gray-200 rounded-lg divide-y">
            {recentActivity.slice(0, 5).map((activity, index) => (
              <div key={activity.id || index} className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'loan_approved' ? 'bg-green-500' :
                    activity.type === 'loan_rejected' ? 'bg-red-500' :
                    activity.type === 'user_registered' ? 'bg-blue-500' :
                    'bg-gray-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-gray-900">{activity.message}</p>
                    <p className="text-gray-500 text-sm">{activity.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users, loans, and platform operations</p>
          </div>
          <button
            onClick={refreshData}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Stats Grid - Only show if stats are available */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              change="+12%"
              icon="👥"
              color="blue"
              format="number"
            />
            <StatCard
              title="Pending Applications"
              value={stats.pendingApplications}
              change="+5"
              icon="📋"
              color="orange"
              format="number"
            />
            <StatCard
              title="Active Loans"
              value={stats.activeLoans}
              change="+8%"
              icon="💰"
              color="green"
              format="number"
            />
            <StatCard
              title="Total Disbursed"
              value={stats.totalDisbursed}
              change="+15%"
              icon="🏦"
              color="purple"
              format="currency"
            />
          </div>
        )}

        {/* Additional Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Repayment Rate</h3>
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.repaymentRate}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${stats.repaymentRate}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Default Rate</h3>
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="text-3xl font-bold text-red-600 mb-2">
                {stats.defaultRate}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${stats.defaultRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'loans' && <LoanReview />}
            {activeTab === 'reports' && <Reports />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard