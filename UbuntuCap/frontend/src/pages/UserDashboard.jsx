import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/common/Header'
import { loanService } from '../services/loanService'
import { 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  ArrowRight,
  Users,
  CreditCard,
  Phone,
  MessageCircle
} from 'lucide-react'

const UserDashboard = () => {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalLoans: 0,
    activeLoans: 0,
    totalBorrowed: 0,
    creditScore: 0
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      setError('')
      const [loansData, userStats] = await Promise.all([
        loanService.getMyLoans(),
        getUserStats() // This would come from your user service
      ])
      setLoans(loansData.results || loansData || [])
      setStats(userStats)
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      setError(error.error || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Mock function - replace with actual API call
  const getUserStats = async () => {
    return {
      totalLoans: 3,
      activeLoans: 1,
      totalBorrowed: 125000,
      creditScore: 720
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-ubuntu-green" />
      case 'pending':
        return <Clock className="h-5 w-5 text-ubuntu-orange" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-ubuntu-red" />
      default:
        return <Clock className="h-5 w-5 text-ubuntu-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-ubuntu-green-light text-ubuntu-green-dark'
      case 'pending':
        return 'bg-ubuntu-orange-light text-ubuntu-orange'
      case 'rejected':
        return 'bg-ubuntu-red-light text-ubuntu-red'
      default:
        return 'bg-ubuntu-gray-100 text-ubuntu-gray-600'
    }
  }

  const formatCurrency = (amount) => {
    return `KES ${amount?.toLocaleString() || '0'}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ubuntu-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ubuntu-green"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ubuntu-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-ubuntu-red-light border border-ubuntu-red text-ubuntu-red px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ubuntu-gray-900">Dashboard</h1>
          <p className="text-ubuntu-gray-600 text-lg">Welcome back! Here's your financial overview.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-ubuntu-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-ubuntu-green-light rounded-lg">
                <DollarSign className="h-6 w-6 text-ubuntu-green" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-ubuntu-gray-600">Total Loans</p>
                <p className="text-2xl font-bold text-ubuntu-gray-900">{stats.totalLoans}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-ubuntu-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-ubuntu-blue-light rounded-lg">
                <TrendingUp className="h-6 w-6 text-ubuntu-blue" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-ubuntu-gray-600">Active Loans</p>
                <p className="text-2xl font-bold text-ubuntu-gray-900">{stats.activeLoans}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-ubuntu-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-ubuntu-purple-light rounded-lg">
                <CreditCard className="h-6 w-6 text-ubuntu-purple" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-ubuntu-gray-600">Total Borrowed</p>
                <p className="text-2xl font-bold text-ubuntu-gray-900">{formatCurrency(stats.totalBorrowed)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-ubuntu-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-ubuntu-orange-light rounded-lg">
                <Users className="h-6 w-6 text-ubuntu-orange" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-ubuntu-gray-600">Credit Score</p>
                <p className="text-2xl font-bold text-ubuntu-gray-900">{stats.creditScore}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Loans Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-ubuntu-gray-200">
              <div className="p-6 border-b border-ubuntu-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-ubuntu-gray-900">My Loans</h2>
                  <Link
                    to="/apply"
                    className="bg-ubuntu-green text-white px-4 py-2 rounded-lg hover:bg-ubuntu-green-dark transition-colors flex items-center shadow-sm hover:shadow-md"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Apply for Loan
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {loans.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-ubuntu-gray-300 mx-auto mb-3" />
                    <p className="text-ubuntu-gray-500 text-lg">No loans yet</p>
                    <p className="text-ubuntu-gray-400 mt-1">Get started by applying for your first loan</p>
                    <Link
                      to="/apply"
                      className="inline-block mt-4 bg-ubuntu-green text-white px-6 py-3 rounded-lg hover:bg-ubuntu-green-dark transition-colors font-semibold"
                    >
                      Apply Now
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {loans.slice(0, 5).map((loan) => (
                      <div key={loan.id} className="flex items-center justify-between p-4 border border-ubuntu-gray-200 rounded-lg hover:bg-ubuntu-gray-50 transition-colors group">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(loan.status)}
                          <div>
                            <p className="font-semibold text-ubuntu-gray-900 text-lg">{formatCurrency(loan.amount)}</p>
                            <p className="text-ubuntu-gray-600">{loan.purpose}</p>
                            <p className="text-sm text-ubuntu-gray-500">
                              Applied on {new Date(loan.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(loan.status)}`}>
                            {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                          </span>
                          <button
                            onClick={() => navigate(`/loans/${loan.id}`)}
                            className="text-ubuntu-green hover:text-ubuntu-green-dark transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <ArrowRight className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {loans.length > 5 && (
                      <Link
                        to="/loans"
                        className="block w-full text-center text-ubuntu-green hover:text-ubuntu-green-dark py-3 transition-colors font-semibold border-t border-ubuntu-gray-200 pt-4"
                      >
                        View All Loans
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-ubuntu-gray-200 p-6">
              <h3 className="font-semibold text-ubuntu-gray-900 mb-4 text-lg">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/apply"
                  className="block w-full bg-ubuntu-green text-white py-3 px-4 rounded-lg hover:bg-ubuntu-green-dark transition-colors text-center font-semibold shadow-sm hover:shadow-md"
                >
                  Apply for Loan
                </Link>
                <Link
                  to="/calculator"
                  className="block w-full border border-ubuntu-gray-300 text-ubuntu-gray-700 py-3 px-4 rounded-lg hover:bg-ubuntu-gray-50 transition-colors text-center font-medium"
                >
                  Loan Calculator
                </Link>
                <Link
                  to="/profile"
                  className="block w-full border border-ubuntu-gray-300 text-ubuntu-gray-700 py-3 px-4 rounded-lg hover:bg-ubuntu-gray-50 transition-colors text-center font-medium"
                >
                  Update Profile
                </Link>
              </div>
            </div>

            {/* Credit Score */}
            <div className="bg-white rounded-xl shadow-sm border border-ubuntu-gray-200 p-6">
              <h3 className="font-semibold text-ubuntu-gray-900 mb-4 text-lg">Credit Score</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-ubuntu-gray-900 mb-2">{stats.creditScore}</div>
                <div className="w-full bg-ubuntu-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-ubuntu-green h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(stats.creditScore / 850) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-ubuntu-gray-500 mb-2">
                  <span>300</span>
                  <span>850</span>
                </div>
                <p className="text-ubuntu-green font-semibold">Good credit score</p>
                <p className="text-ubuntu-gray-600 text-sm mt-2">
                  Timely repayments improve your score
                </p>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-ubuntu-blue-light border border-ubuntu-blue-light rounded-xl p-6">
              <h3 className="font-semibold text-ubuntu-blue mb-3 text-lg">Need Help?</h3>
              <p className="text-ubuntu-blue text-sm mb-4">
                Our support team is here to help you with any questions about your loans or account.
              </p>
              <div className="space-y-3 text-ubuntu-blue">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-3" />
                  <span>0700 123 456</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-3" />
                  <span>WhatsApp: 0700 123 456</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-3" />
                  <span>USSD: *384*12345#</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-ubuntu-blue">
                <p className="text-ubuntu-blue text-xs">
                  Available 24/7 for all your banking needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard