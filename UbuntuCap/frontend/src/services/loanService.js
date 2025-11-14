import api from './api';

export const loanService = {
  async applyLoan(loanData) {
    try {
      console.log('🔵 [loanService] Applying for loan:', loanData);
      const response = await api.post('/loans/', {
        amount: loanData.amount,
        purpose: loanData.purpose,
        term_days: loanData.term_days || 30,
        business_type: loanData.business_type,
        monthly_revenue: loanData.monthly_revenue,
        business_age_months: loanData.business_age_months,
        existing_loans_count: loanData.existing_loans_count,
        average_monthly_sales: loanData.average_monthly_sales
      });
      console.log('🟢 [loanService] Loan application successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('🔴 [loanService] Loan application failed:', error);
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
  },

  async getRepayments(loanId) {
    try {
      const response = await api.get(`/loans/repayments/?loan=${loanId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get repayments' };
    }
  }
};

export default loanService;