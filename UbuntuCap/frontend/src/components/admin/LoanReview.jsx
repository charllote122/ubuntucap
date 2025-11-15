import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Search, Filter, CheckCircle, XCircle, Clock, AlertCircle, RefreshCw, Eye, FileText } from 'lucide-react';

const LoanReview = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchPendingLoans();
  }, []);

  const fetchPendingLoans = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getPendingLoans();
      setLoans(data.results || []);
    } catch (error) {
      console.error('Failed to fetch pending loans:', error);
      setError(error.error || 'Failed to load pending loans.');
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (loanId) => {
    try {
      setActionLoading(loanId);
      setError('');
      await adminService.updateLoanStatus(loanId, 'approved', reviewNotes);
      setReviewNotes('');
      setSelectedLoan(null);
      await fetchPendingLoans();
    } catch (error) {
      console.error('Failed to approve loan:', error);
      setError(error.error || 'Failed to approve loan.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (loanId) => {
    try {
      setActionLoading(loanId);
      setError('');
      await adminService.updateLoanStatus(loanId, 'rejected', reviewNotes);
      setReviewNotes('');
      setSelectedLoan(null);
      await fetchPendingLoans();
    } catch (error) {
      console.error('Failed to reject loan:', error);
      setError(error.error || 'Failed to reject loan.');
    } finally {
      setActionLoading(null);
    }
  };

  const getRiskLevel = (loan) => {
    const score = loan.credit_score || 0;
    if (score >= 700) return { level: 'Low', color: 'green', bg: 'ubuntu-green-light', text: 'ubuntu-green-dark' };
    if (score >= 500) return { level: 'Medium', color: 'orange', bg: 'ubuntu-orange-light', text: 'ubuntu-orange' };
    return { level: 'High', color: 'red', bg: 'ubuntu-red-light', text: 'ubuntu-red' };
  };

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.user?.phone_number?.includes(searchTerm);
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'high-risk') return matchesSearch && (loan.credit_score || 0) < 500;
    if (filterStatus === 'medium-risk') return matchesSearch && (loan.credit_score || 0) >= 500 && (loan.credit_score || 0) < 700;
    if (filterStatus === 'low-risk') return matchesSearch && (loan.credit_score || 0) >= 700;
    
    return matchesSearch;
  });

  return (
    <div>
      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-ubuntu-red-light border border-ubuntu-red text-ubuntu-red px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-ubuntu-gray-900">Loan Applications Review</h3>
          <p className="text-ubuntu-gray-600">Review and approve pending loan applications</p>
        </div>
        <button
          onClick={fetchPendingLoans}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-ubuntu-green text-white rounded-lg hover:bg-ubuntu-green-dark transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-ubuntu-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ubuntu-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-ubuntu-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors"
            />
          </div>
          <div className="flex space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-3 py-2 border border-ubuntu-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors"
            >
              <option value="all">All Applications</option>
              <option value="high-risk">High Risk</option>
              <option value="medium-risk">Medium Risk</option>
              <option value="low-risk">Low Risk</option>
            </select>
            <button className="px-4 py-2 border border-ubuntu-gray-300 text-ubuntu-gray-700 rounded-lg hover:bg-ubuntu-gray-50 transition-colors flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-ubuntu-gray-200 text-center">
          <div className="text-2xl font-bold text-ubuntu-gray-900">{loans.length}</div>
          <div className="text-ubuntu-gray-600 text-sm">Total Pending</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-ubuntu-gray-200 text-center">
          <div className="text-2xl font-bold text-ubuntu-green">{loans.filter(l => (l.credit_score || 0) >= 700).length}</div>
          <div className="text-ubuntu-gray-600 text-sm">Low Risk</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-ubuntu-gray-200 text-center">
          <div className="text-2xl font-bold text-ubuntu-orange">{loans.filter(l => (l.credit_score || 0) >= 500 && (l.credit_score || 0) < 700).length}</div>
          <div className="text-ubuntu-gray-600 text-sm">Medium Risk</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-ubuntu-gray-200 text-center">
          <div className="text-2xl font-bold text-ubuntu-red">{loans.filter(l => (l.credit_score || 0) < 500).length}</div>
          <div className="text-ubuntu-gray-600 text-sm">High Risk</div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ubuntu-green"></div>
        </div>
      ) : filteredLoans.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-ubuntu-gray-200">
          <Clock className="h-12 w-12 text-ubuntu-gray-300 mx-auto mb-3" />
          <p className="text-ubuntu-gray-500 text-lg">No pending loan applications to review</p>
          <p className="text-ubuntu-gray-400 mt-1">All applications have been processed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLoans.map((loan) => {
            const risk = getRiskLevel(loan);
            return (
              <div key={loan.id} className="bg-white border border-ubuntu-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-ubuntu-gray-900 text-lg">
                        {loan.user?.first_name} {loan.user?.last_name}
                      </h4>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${risk.bg} ${risk.text}`}>
                        {risk.level} Risk
                      </span>
                    </div>
                    <p className="text-ubuntu-gray-600">{loan.user?.phone_number}</p>
                    <p className="text-sm text-ubuntu-gray-500">{loan.user?.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-ubuntu-green">KES {loan.amount?.toLocaleString()}</p>
                    <p className="text-sm text-ubuntu-gray-500">{loan.term_days} days</p>
                    <p className="text-sm text-ubuntu-gray-600 mt-1">
                      Score: <span className="font-semibold">{loan.credit_score || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-ubuntu-gray-600">Purpose</p>
                    <p className="font-medium text-ubuntu-gray-900">{loan.purpose}</p>
                  </div>
                  <div>
                    <p className="text-sm text-ubuntu-gray-600">Business Type</p>
                    <p className="font-medium text-ubuntu-gray-900">{loan.business_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-ubuntu-gray-600">Monthly Revenue</p>
                    <p className="font-medium text-ubuntu-gray-900">
                      {loan.monthly_revenue ? `KES ${loan.monthly_revenue.toLocaleString()}` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-ubuntu-gray-600">Applied On</p>
                    <p className="font-medium text-ubuntu-gray-900">
                      {loan.application_date ? new Date(loan.application_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                {selectedLoan === loan.id ? (
                  <div className="border-t border-ubuntu-gray-200 pt-4 mt-4">
                    <label className="block text-sm font-medium text-ubuntu-gray-700 mb-2">
                      Review Notes
                    </label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add review notes (optional)..."
                      className="w-full px-3 py-2 border border-ubuntu-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors mb-3"
                      rows="3"
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApprove(loan.id)}
                        disabled={actionLoading === loan.id}
                        className="flex-1 px-4 py-2 bg-ubuntu-green text-white rounded-lg hover:bg-ubuntu-green-dark disabled:opacity-50 transition-colors flex items-center justify-center font-semibold"
                      >
                        {actionLoading === loan.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Approve Loan
                      </button>
                      <button
                        onClick={() => handleReject(loan.id)}
                        disabled={actionLoading === loan.id}
                        className="flex-1 px-4 py-2 bg-ubuntu-red text-white rounded-lg hover:bg-ubuntu-red-dark disabled:opacity-50 transition-colors flex items-center justify-center font-semibold"
                      >
                        {actionLoading === loan.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Reject Loan
                      </button>
                      <button
                        onClick={() => setSelectedLoan(null)}
                        className="px-4 py-2 border border-ubuntu-gray-300 text-ubuntu-gray-700 rounded-lg hover:bg-ubuntu-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedLoan(loan.id)}
                      className="px-4 py-2 bg-ubuntu-green text-white rounded-lg hover:bg-ubuntu-green-dark transition-colors flex items-center font-semibold"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Review Application
                    </button>
                    <button className="px-4 py-2 border border-ubuntu-gray-300 text-ubuntu-gray-700 rounded-lg hover:bg-ubuntu-gray-50 transition-colors flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LoanReview;