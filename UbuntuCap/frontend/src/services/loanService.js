import api from './api';

export const loanService = {
  async applyLoan(loanData) {
    try {
      const response = await api.post('/loans/', loanData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Loan application failed' };
    }
  },

  async getMyLoans(status = null) {
    try {
      const url = status ? `/loans/user_loans/?status=${status}` : '/loans/user_loans/';
      const response = await api.get(url);
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
  },

  async calculateRepayment(calculationData) {
    try {
      const response = await api.post('/loans/calculate/', calculationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Calculation failed' };
    }
  }
};

export default loanService;