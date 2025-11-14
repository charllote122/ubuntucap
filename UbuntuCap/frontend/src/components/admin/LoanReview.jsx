import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Search, Filter, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const LoanReview = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

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
    if (score >= 700) return { level: 'Low', color: 'green' };
    if (score >= 500) return { level: 'Medium', color: 'yellow' };
    return { level: 'High', color: 'red' };
  };

  return (
    <div>
      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Loan Applications Review</h3>
          <p className="text-gray-600">Review and approve pending loan applications</p>
        </div>
        <button
          onClick={fetchPendingLoans}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : loans.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No pending loan applications to review</p>
          <p className="text-sm text-gray-400 mt-1">All applications have been processed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => {
            const risk = getRiskLevel(loan);
            return (
              <div key={loan.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {loan.user?.first_name} {loan.user?.last_name}
                    </h4>
                    <p className="text-gray-600">{loan.user?.phone_number}</p>
                    <p className="text-sm text-gray-500">{loan.user?.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">KES {loan.amount?.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{loan.term_days} days</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${risk.color}-100 text-${risk.color}-800`}>
                      {risk.level} Risk
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Purpose</p>
                    <p className="font-medium">{loan.purpose}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Business Type</p>
                    <p className="font-medium">{loan.business_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Credit Score</p>
                    <p className="font-medium">{loan.credit_score || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Applied On</p>
                    <p className="font-medium">
                      {loan.application_date ? new Date(loan.application_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                {selectedLoan === loan.id ? (
                  <div className="border-t pt-4 mt-4">
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add review notes (optional)..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                      rows="3"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(loan.id)}
                        disabled={actionLoading === loan.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center"
                      >
                        {actionLoading === loan.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(loan.id)}
                        disabled={actionLoading === loan.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center"
                      >
                        {actionLoading === loan.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Reject
                      </button>
                      <button
                        onClick={() => setSelectedLoan(null)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedLoan(loan.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Review Application
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
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