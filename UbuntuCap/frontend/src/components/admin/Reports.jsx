import React, { useState } from 'react';
import { adminService } from '../../services/adminService';
import { Download, Calendar, BarChart3, Users, DollarSign, AlertCircle } from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('loan_performance');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    try {
      setGenerating(true);
      setError('');
      const report = await adminService.generateReport(reportType, startDate, endDate);
      // In a real app, you would handle the report download or display
      console.log('Report generated:', report);
      alert('Report generated successfully! Check the console for details.');
    } catch (error) {
      console.error('Failed to generate report:', error);
      setError(error.error || 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Reports & Analytics</h3>
      
      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="loan_performance">Loan Performance</option>
              <option value="user_activity">User Activity</option>
              <option value="financial_summary">Financial Summary</option>
              <option value="risk_analysis">Risk Analysis</option>
              <option value="repayment_trends">Repayment Trends</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={generating}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {generating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating Report...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </>
          )}
        </button>

        {/* Report Preview Section */}
        <div className="mt-8 border-t pt-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-gray-400" />
            Available Reports
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center mb-2">
                <DollarSign className="h-6 w-6 text-green-600 mr-2" />
                <span className="font-semibold text-gray-900">Loan Performance</span>
              </div>
              <p className="text-sm text-gray-600">Detailed analysis of loan portfolio performance</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center mb-2">
                <Users className="h-6 w-6 text-blue-600 mr-2" />
                <span className="font-semibold text-gray-900">User Activity</span>
              </div>
              <p className="text-sm text-gray-600">User registration and engagement metrics</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center mb-2">
                <BarChart3 className="h-6 w-6 text-purple-600 mr-2" />
                <span className="font-semibold text-gray-900">Risk Analysis</span>
              </div>
              <p className="text-sm text-gray-600">Portfolio risk assessment and trends</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;