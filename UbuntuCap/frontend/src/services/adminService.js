import api from './api';

export const adminService = {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await api.get('/admin/dashboard/stats/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error.response?.data || { error: 'Failed to fetch dashboard statistics' };
    }
  },

  // Get recent activity
  async getRecentActivity() {
    try {
      const response = await api.get('/admin/dashboard/activity/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
      throw error.response?.data || { error: 'Failed to fetch recent activity' };
    }
  },

  // Get users list with advanced filtering
  async getUsers(page = 1, search = '', status = 'all', sortBy = 'created_at', sortOrder = 'desc') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        search: search,
        status: status,
        sort_by: sortBy,
        sort_order: sortOrder
      });

      const response = await api.get(`/admin/users/?${params}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error.response?.data || { error: 'Failed to fetch users' };
    }
  },

  // Get user details
  async getUserDetails(userId) {
    try {
      const response = await api.get(`/admin/users/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      throw error.response?.data || { error: 'Failed to fetch user details' };
    }
  },

  // Update user status
  async updateUserStatus(userId, isActive) {
    try {
      const response = await api.patch(`/admin/users/${userId}/`, {
        is_active: isActive
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update user status:', error);
      throw error.response?.data || { error: 'Failed to update user status' };
    }
  },

  // Update user verification status
  async updateUserVerification(userId, isVerified) {
    try {
      const response = await api.patch(`/admin/users/${userId}/`, {
        is_verified: isVerified
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update user verification:', error);
      throw error.response?.data || { error: 'Failed to update user verification' };
    }
  },

  // Export users to CSV
  async exportUsers(format = 'csv', filters = {}) {
    try {
      const params = new URLSearchParams({
        format: format,
        ...filters
      });

      const response = await api.get(`/admin/users/export/?${params}`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('Failed to export users:', error);
      throw error.response?.data || { error: 'Failed to export users' };
    }
  },

  // Get loans for review
  async getPendingLoans(page = 1, filters = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        status: 'pending',
        ...filters
      });

      const response = await api.get(`/admin/loans/?${params}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pending loans:', error);
      throw error.response?.data || { error: 'Failed to fetch pending loans' };
    }
  },

  // Get all loans with filters
  async getLoans(page = 1, status = null, filters = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ...filters
      });

      if (status) {
        params.append('status', status);
      }

      const response = await api.get(`/admin/loans/?${params}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch loans:', error);
      throw error.response?.data || { error: 'Failed to fetch loans' };
    }
  },

  // Update loan status
  async updateLoanStatus(loanId, status, notes = '') {
    try {
      const response = await api.patch(`/admin/loans/${loanId}/`, {
        status,
        admin_notes: notes,
        reviewed_at: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update loan status:', error);
      throw error.response?.data || { error: 'Failed to update loan status' };
    }
  },

  // Get loan details
  async getLoanDetails(loanId) {
    try {
      const response = await api.get(`/admin/loans/${loanId}/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch loan details:', error);
      throw error.response?.data || { error: 'Failed to fetch loan details' };
    }
  },

  // Generate report
  async generateReport(reportType, startDate, endDate, filters = {}) {
    try {
      const response = await api.post('/admin/reports/generate/', {
        report_type: reportType,
        start_date: startDate,
        end_date: endDate,
        filters: filters
      });
      return response.data;
    } catch (error) {
      console.error('Failed to generate report:', error);
      throw error.response?.data || { error: 'Failed to generate report' };
    }
  },

  // Get system metrics
  async getSystemMetrics(timeframe = '7d') {
    try {
      const response = await api.get(`/admin/metrics/?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch system metrics:', error);
      throw error.response?.data || { error: 'Failed to fetch system metrics' };
    }
  },

  // Get risk analysis
  async getRiskAnalysis() {
    try {
      const response = await api.get('/admin/risk-analysis/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch risk analysis:', error);
      throw error.response?.data || { error: 'Failed to fetch risk analysis' };
    }
  },

  // Send bulk notifications
  async sendBulkNotification(userIds, message, type = 'info') {
    try {
      const response = await api.post('/admin/notifications/bulk/', {
        user_ids: userIds,
        message: message,
        type: type
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send bulk notification:', error);
      throw error.response?.data || { error: 'Failed to send bulk notification' };
    }
  },

  // Get audit logs
  async getAuditLogs(page = 1, action = null, userId = null) {
    try {
      const params = new URLSearchParams({
        page: page.toString()
      });

      if (action) params.append('action', action);
      if (userId) params.append('user_id', userId);

      const response = await api.get(`/admin/audit-logs/?${params}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      throw error.response?.data || { error: 'Failed to fetch audit logs' };
    }
  }
};

export default adminService;