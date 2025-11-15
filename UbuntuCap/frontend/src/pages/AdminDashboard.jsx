import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/common/Header'
import UserManagement from '../components/admin/UserManagement'
import LoanReview from '../components/admin/LoanReview'
import Reports from '../components/admin/Reports'
import { adminService } from '../services/adminService'
import { RefreshCw, AlertCircle, Download, Shield } from 'lucide-react'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [recentActivity, setRecentActivity] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const userData = JSON.parse(localStorage.getItem('user_data'))
      
      if (!token) {
        navigate('/login')
        return
      }
      
      if (!userData?.is_admin && !userData?.is_staff) {
        navigate('/unauthorized')
        return
      }
      
      setIsAdmin(true)
      fetchDashboardData()
    } catch (error) {
      console.error('Authentication check failed:', error)
      navigate('/login')
    }
  }

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

  const refreshData = async () => {
    try {
      setRefreshing(true)
      await fetchDashboardData()
    } finally {
      setRefreshing(false)
    }
  }

  const exportData = () => {
    const data = {
      dashboardStats: stats,
      recentActivity,
      exportedAt: new Date().toISOString(),
      exportedBy: JSON.parse(localStorage.getItem('user_data'))?.email || 'admin'
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `admin-dashboard-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'users', name: 'User Management', icon: '👥' },
    { id: 'loans', name: 'Loan Review', icon: '💰' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈' }
  ]

  const StatCard = ({ title, value, change, icon, color = 'green', format = 'number' }) => {
    const colorClasses = {
      green: {
        bg: 'bg-ubuntu-green-lighter',
        text: 'text-ubuntu-green',
        border: 'border-ubuntu-green-light'
      },
      blue: {
        bg: 'bg-ubuntu-blue-light',
        text: 'text-ubuntu-blue',
        border: 'border-blue-200'
      },
      orange: {
        bg: 'bg-ubuntu-orange-light',
        text: 'text-ubuntu-orange',
        border: 'border-orange-200'
      },
      purple: {
        bg: 'bg-ubuntu-purple-light',
        text: 'text-ubuntu-purple',
        border: 'border-purple-200'
      }
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

    const colors = colorClasses[color]

    return (
      <div className={`bg-white p-6 rounded-xl shadow-sm border ${colors.border} hover:shadow-md transition-shadow`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ubuntu-gray-600">{title}</p>
            <p className="text-2xl font-bold text-ubuntu-gray-900 mt-1">{formatValue(value)}</p>
            {change && (
              <p className={`text-sm ${change.startsWith('+') ? 'text-ubuntu-green' : 'text-ubuntu-red'}`}>
                {change}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colors.bg} ${colors.text}`}>
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
        {/* Platform Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-ubuntu-green-lighter border border-ubuntu-green-light rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-ubuntu-green-dark">System Status</span>
              <div className="w-3 h-3 rounded-full bg-ubuntu-green"></div>
            </div>
            <p className="text-ubuntu-green text-sm mt-2">
              All systems operational
            </p>
          </div>

          <div className="bg-ubuntu-blue-light border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-ubuntu-blue">API Response Time</span>
              <span className="text-ubuntu-blue">⚡</span>
            </div>
            <p className="text-ubuntu-blue text-sm mt-2">{stats.avgResponseTime || '120'}ms average</p>
          </div>

          <div className="bg-ubuntu-purple-light border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-ubuntu-purple">Server Load</span>
              <span className="text-ubuntu-purple">🖥️</span>
            </div>
            <p className="text-ubuntu-purple text-sm mt-2">{stats.serverLoad || '45'}% capacity</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h4 className="font-semibold text-ubuntu-gray-900 mb-4">Quick Actions</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => setActiveTab('loans')}
              className="bg-white border border-ubuntu-gray-200 rounded-lg p-4 text-left hover:border-ubuntu-green transition-colors group"
            >
              <div className="text-ubuntu-green text-lg mb-2 group-hover:scale-110 transition-transform">📋</div>
              <div className="font-medium text-sm text-ubuntu-gray-900">Review Loans</div>
              <div className="text-xs text-ubuntu-gray-500">{stats.pendingApplications} pending</div>
            </button>
            
            <button 
              onClick={() => setActiveTab('users')}
              className="bg-white border border-ubuntu-gray-200 rounded-lg p-4 text-left hover:border-ubuntu-green transition-colors group"
            >
              <div className="text-ubuntu-green text-lg mb-2 group-hover:scale-110 transition-transform">👥</div>
              <div className="font-medium text-sm text-ubuntu-gray-900">Manage Users</div>
              <div className="text-xs text-ubuntu-gray-500">{stats.totalUsers} total</div>
            </button>
            
            <button className="bg-white border border-ubuntu-gray-200 rounded-lg p-4 text-left hover:border-ubuntu-green transition-colors group">
              <div className="text-ubuntu-green text-lg mb-2 group-hover:scale-110 transition-transform">📧</div>
              <div className="font-medium text-sm text-ubuntu-gray-900">Send Broadcast</div>
              <div className="text-xs text-ubuntu-gray-500">All users</div>
            </button>
            
            <button className="bg-white border border-ubuntu-gray-200 rounded-lg p-4 text-left hover:border-ubuntu-green transition-colors group">
              <div className="text-ubuntu-green text-lg mb-2 group-hover:scale-110 transition-transform">⚙️</div>
              <div className="font-medium text-sm text-ubuntu-gray-900">System Settings</div>
              <div className="text-xs text-ubuntu-gray-500">Configure</div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-ubuntu-green-lighter border border-ubuntu-green-light rounded-lg p-6">
            <h4 className="font-semibold text-ubuntu-green-dark mb-2">Platform Health</h4>
            <p className="text-ubuntu-green text-sm">
              The platform is operating normally. All systems are functional and performance is optimal.
            </p>
          </div>
          
          <div className="bg-ubuntu-green-lighter border border-ubuntu-green-light rounded-lg p-6">
            <h4 className="font-semibold text-ubuntu-green-dark mb-2">Loan Performance</h4>
            <p className="text-ubuntu-green text-sm">
              Repayment rates are strong at {stats.repaymentRate}%. Continue monitoring for optimal performance.
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-ubuntu-gray-900 mb-4">Key Metrics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-ubuntu-gray-50 rounded-lg p-4 border border-ubuntu-gray-200">
              <div className="text-2xl font-bold text-ubuntu-gray-900">{stats.activeLoans}</div>
              <div className="text-sm text-ubuntu-gray-600">Active Loans</div>
            </div>
            <div className="bg-ubuntu-gray-50 rounded-lg p-4 border border-ubuntu-gray-200">
              <div className="text-2xl font-bold text-ubuntu-gray-900">{stats.pendingApplications}</div>
              <div className="text-sm text-ubuntu-gray-600">Pending Review</div>
            </div>
            <div className="bg-ubuntu-gray-50 rounded-lg p-4 border border-ubuntu-gray-200">
              <div className="text-2xl font-bold text-ubuntu-gray-900">
                KSh {stats.totalDisbursed ? (stats.totalDisbursed / 1000000).toFixed(1) : 0}M
              </div>
              <div className="text-sm text-ubuntu-gray-600">Portfolio Size</div>
            </div>
            <div className="bg-ubuntu-gray-50 rounded-lg p-4 border border-ubuntu-gray-200">
              <div className="text-2xl font-bold text-ubuntu-gray-900">{stats.totalUsers}</div>
              <div className="text-sm text-ubuntu-gray-600">Registered Users</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-ubuntu-gray-900">Recent Activity</h4>
            <select className="text-sm border border-ubuntu-gray-300 rounded-lg px-3 py-1 text-ubuntu-gray-700">
              <option>All Activities</option>
              <option>Loan Approvals</option>
              <option>User Registrations</option>
              <option>System Events</option>
            </select>
          </div>
          
          <div className="bg-white border border-ubuntu-gray-200 rounded-lg divide-y max-h-96 overflow-y-auto">
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center text-ubuntu-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <p>No recent activity</p>
              </div>
            ) : (
              recentActivity.slice(0, 10).map((activity, index) => (
                <div key={activity.id || index} className="p-4 hover:bg-ubuntu-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === 'loan_approved' ? 'bg-ubuntu-green' :
                      activity.type === 'loan_rejected' ? 'bg-ubuntu-red' :
                      activity.type === 'user_registered' ? 'bg-ubuntu-blue' :
                      activity.type === 'payment_received' ? 'bg-ubuntu-green' :
                      'bg-ubuntu-gray-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-ubuntu-gray-900 text-sm">{activity.message}</p>
                      <p className="text-ubuntu-gray-500 text-xs mt-1">{activity.timestamp}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        activity.type === 'loan_approved' ? 'bg-ubuntu-green-lighter text-ubuntu-green-dark' :
                        activity.type === 'loan_rejected' ? 'bg-ubuntu-red-light text-ubuntu-red' :
                        activity.type === 'user_registered' ? 'bg-ubuntu-blue-light text-ubuntu-blue' :
                        'bg-ubuntu-gray-100 text-ubuntu-gray-700'
                      }`}>
                        {activity.type?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin && loading) {
    return (
      <div className="min-h-screen bg-ubuntu-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="h-8 bg-ubuntu-gray-200 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-ubuntu-gray-200 rounded w-64 animate-pulse"></div>
            </div>
            <div className="h-10 bg-ubuntu-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-ubuntu-gray-200">
                <div className="h-4 bg-ubuntu-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                <div className="h-8 bg-ubuntu-gray-200 rounded w-16 mb-2 animate-pulse"></div>
                <div className="h-3 bg-ubuntu-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-ubuntu-gray-200 p-6">
            <div className="flex justify-center items-center min-h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ubuntu-green"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-ubuntu-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-ubuntu-green-lighter rounded-lg">
              <Shield className="w-6 h-6 text-ubuntu-green" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ubuntu-gray-900">Admin Dashboard</h1>
              <p className="text-ubuntu-gray-600">Manage users, loans, and platform operations</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportData}
              className="flex items-center px-4 py-2 bg-ubuntu-green text-white rounded-lg hover:bg-ubuntu-green-dark transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-ubuntu-green text-white rounded-lg hover:bg-ubuntu-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-ubuntu-red-light border border-ubuntu-red text-ubuntu-red px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              change="+12%"
              icon="👥"
              color="green"
            />
            <StatCard
              title="Pending Applications"
              value={stats.pendingApplications}
              change="+5"
              icon="📋"
              color="orange"
            />
            <StatCard
              title="Active Loans"
              value={stats.activeLoans}
              change="+8%"
              icon="💰"
              color="blue"
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
            <div className="bg-white p-6 rounded-xl shadow-sm border border-ubuntu-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-ubuntu-gray-900">Repayment Rate</h3>
                <span className="text-2xl text-ubuntu-green">📊</span>
              </div>
              <div className="text-3xl font-bold text-ubuntu-green mb-2">
                {stats.repaymentRate}%
              </div>
              <div className="w-full bg-ubuntu-gray-200 rounded-full h-2">
                <div 
                  className="bg-ubuntu-green h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${stats.repaymentRate}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-ubuntu-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-ubuntu-gray-900">Default Rate</h3>
                <span className="text-2xl text-ubuntu-red">⚠️</span>
              </div>
              <div className="text-3xl font-bold text-ubuntu-red mb-2">
                {stats.defaultRate}%
              </div>
              <div className="w-full bg-ubuntu-gray-200 rounded-full h-2">
                <div 
                  className="bg-ubuntu-red h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${stats.defaultRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-ubuntu-gray-200">
          <div className="border-b border-ubuntu-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                    activeTab === tab.id
                      ? 'border-ubuntu-green text-ubuntu-green'
                      : 'border-transparent text-ubuntu-gray-500 hover:text-ubuntu-gray-700'
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