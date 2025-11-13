import api from './api';

export const loanService = {
  async applyLoan(loanData) {
    try {
      const response = await api.post('/loans/apply/', {
        amount: loanData.amount,
        purpose: loanData.purpose,
        duration_days: loanData.duration,
        business_plan: loanData.businessPlan
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Loan application failed' };
    }
  },

  async getMyLoans() {
    try {
      const response = await api.get('/loans/my-loans/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get loans' };
    }
  },

  async getLoanDetails(loanId) {
    try {
      const response = await api.get(`/loans/${loanId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get loan details' };
    }
  }
};