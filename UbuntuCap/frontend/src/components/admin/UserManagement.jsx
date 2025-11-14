import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Eye, Search, Download, UserX, UserCheck, AlertCircle, Users, ChevronLeft, ChevronRight } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10,
    totalPages: 0
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getUsers(pagination.current, searchTerm, statusFilter);
      setUsers(data.results || []);
      setPagination(prev => ({
        ...prev,
        total: data.count || 0,
        totalPages: Math.ceil((data.count || 0) / prev.pageSize)
      }));
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError(error.error || 'Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchUsers();
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const handleViewUser = async (user) => {
    try {
      setError('');
      const userDetails = await adminService.getUserDetails(user.id);
      setSelectedUser(userDetails);
      setShowUserModal(true);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      setError(error.error || 'Failed to load user details.');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      setActionLoading(userId);
      setError('');
      await adminService.updateUserStatus(userId, !currentStatus);
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Failed to update user status:', error);
      setError(error.error || 'Failed to update user status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleVerification = async (userId, currentStatus) => {
    try {
      setActionLoading(userId);
      setError('');
      await adminService.updateUserVerification(userId, !currentStatus);
      await fetchUsers(); // Refresh the list
      if (selectedUser?.id === userId) {
        setSelectedUser(prev => ({ ...prev, is_verified: !currentStatus }));
      }
    } catch (error) {
      console.error('Failed to update verification status:', error);
      setError(error.error || 'Failed to update verification status.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportUsers = async () => {
    try {
      setError('');
      const response = await adminService.exportUsers('csv', {
        status: statusFilter,
        search: searchTerm
      });
      
      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ubuntucap-users-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export users:', error);
      setError(error.error || 'Failed to export users.');
    }
  };

  const UserModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* User Basic Info */}
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold text-lg">
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-gray-900 truncate">
                  {user.first_name} {user.last_name}
                </h4>
                <p className="text-gray-600 truncate">{user.email}</p>
                <p className="text-gray-500">{user.phone_number}</p>
              </div>
              <div className="flex flex-col space-y-2 flex-shrink-0">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  user.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => handleToggleVerification(user.id, user.is_verified)}
                  disabled={actionLoading === user.id}
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
                    user.is_verified
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  {actionLoading === user.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  ) : (
                    user.is_verified ? 'Verified' : 'Verify'
                  )}
                </button>
              </div>
            </div>

            {/* Business Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-gray-900 mb-3">Business Information</h5>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Business Name:</span>
                    <p className="font-medium">{user.business_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Business Type:</span>
                    <p className="font-medium">{user.business_type || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Location:</span>
                    <p className="font-medium">{user.business_location || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Business Age:</span>
                    <p className="font-medium">{user.business_age_months ? `${user.business_age_months} months` : 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 mb-3">Account Information</h5>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Member Since:</span>
                    <p className="font-medium">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Last Login:</span>
                    <p className="font-medium">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Credit Score:</span>
                    <p className="font-medium">{user.credit_score || 'Not calculated'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">User ID:</span>
                    <p className="font-medium font-mono text-xs">{user.id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Loan History Summary */}
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Loan History</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-blue-600">{user.total_loans || 0}</div>
                  <div className="text-xs text-gray-600">Total Loans</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-green-600">
                    KSh {user.total_borrowed ? user.total_borrowed.toLocaleString() : 0}
                  </div>
                  <div className="text-xs text-gray-600">Total Borrowed</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-purple-600">
                    KSh {user.total_repaid ? user.total_repaid.toLocaleString() : 0}
                  </div>
                  <div className="text-xs text-gray-600">Total Repaid</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-orange-600">
                    {user.repayment_rate || 0}%
                  </div>
                  <div className="text-xs text-gray-600">Repayment Rate</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => handleToggleUserStatus(user.id, user.is_active)}
              disabled={actionLoading === user.id}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                user.is_active
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              } disabled:opacity-50`}
            >
              {actionLoading === user.id ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                user.is_active ? 'Deactivate User' : 'Activate User'
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.current - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            pagination.current === i
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Showing {((pagination.current - 1) * pagination.pageSize) + 1} to{' '}
          {Math.min(pagination.current * pagination.pageSize, pagination.total)} of{' '}
          {pagination.total} users
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.current - 1)}
            disabled={pagination.current === 1}
            className="p-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {pages}
          <button
            onClick={() => handlePageChange(pagination.current + 1)}
            disabled={pagination.current === pagination.totalPages}
            className="p-1 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Header with Search and Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">User Management</h3>
          <p className="text-gray-600">Manage and monitor platform users</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
          <form onSubmit={handleSearchSubmit} className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </button>
          </form>
          
          <button
            onClick={handleExportUsers}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleStatusFilter('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            statusFilter === 'all'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Users
        </button>
        <button
          onClick={() => handleStatusFilter('active')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            statusFilter === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => handleStatusFilter('inactive')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            statusFilter === 'inactive'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Inactive
        </button>
        <button
          onClick={() => handleStatusFilter('verified')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            statusFilter === 'verified'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Verified
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No users found</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'No users in the system yet'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member Since
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {user.first_name?.[0]}{user.last_name?.[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.phone_number}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.business_name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{user.business_type || 'Not specified'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                          {user.is_verified && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              Verified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="text-blue-600 hover:text-blue-900 flex items-center transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                            disabled={actionLoading === user.id}
                            className={`${
                              user.is_active 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-green-600 hover:text-green-900'
                            } flex items-center transition-colors disabled:opacity-50`}
                            title={user.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {actionLoading === user.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            ) : (
                              <UserX className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {renderPagination()}
          </>
        )}
      </div>

      {/* User Detail Modal */}
      {showUserModal && (
        <UserModal 
          user={selectedUser} 
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }} 
        />
      )}
    </div>
  );
};

export default UserManagement;