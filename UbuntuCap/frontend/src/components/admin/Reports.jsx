import React, { useState } from 'react';
import { adminService } from '../../services/adminService';
import { Download, Calendar, BarChart3, Users, DollarSign, AlertCircle, TrendingUp, Shield, CreditCard, FileText } from 'lucide-react';

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

  const reportTypes = [
    {
      id: 'loan_performance',
      name: 'Loan Performance',
      description: 'Detailed analysis of loan portfolio performance and metrics',
      icon: TrendingUp,
      color: 'ubuntu-green'
    },
    {
      id: 'user_activity',
      name: 'User Activity',
      description: 'User registration, engagement, and behavior analytics',
      icon: Users,
      color: 'ubuntu-blue'
    },
    {
      id: 'financial_summary',
      name: 'Financial Summary',
      description: 'Comprehensive financial overview and revenue metrics',
      icon: DollarSign,
      color: 'ubuntu-purple'
    },
    {
      id: 'risk_analysis',
      name: 'Risk Analysis',
      description: 'Portfolio risk assessment and default rate trends',
      icon: Shield,
      color: 'ubuntu-orange'
    },
    {
      id: 'repayment_trends',
      name: 'Repayment Trends',
      description: 'Payment patterns and collection performance',
      icon: CreditCard,
      color: 'ubuntu-green'
    }
  ];

  const selectedReport = reportTypes.find(report => report.id === reportType);

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-ubuntu-gray-900">Reports & Analytics</h3>
        <p className="text-ubuntu-gray-600">Generate detailed reports and insights</p>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-ubuntu-red-light border border-ubuntu-red text-ubuntu-red px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-ubuntu-gray-200">
        {/* Report Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-medium text-ubuntu-gray-700 mb-3">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-3 border border-ubuntu-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors"
            >
              {reportTypes.map((report) => (
                <option key={report.id} value={report.id}>
                  {report.name}
                </option>
              ))}
            </select>
            
            {/* Selected Report Info */}
            {selectedReport && (
              <div className="mt-4 p-4 bg-ubuntu-gray-50 rounded-lg border border-ubuntu-gray-200">
                <div className="flex items-center mb-2">
                  <selectedReport.icon className={`h-5 w-5 text-${selectedReport.color} mr-2`} />
                  <span className="font-semibold text-ubuntu-gray-900">{selectedReport.name}</span>
                </div>
                <p className="text-ubuntu-gray-600 text-sm">{selectedReport.description}</p>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-ubuntu-gray-700 mb-3">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-ubuntu-gray-500 mb-2">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ubuntu-gray-400 h-4 w-4" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10 w-full px-3 py-3 border border-ubuntu-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-ubuntu-gray-500 mb-2">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ubuntu-gray-400 h-4 w-4" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10 w-full px-3 py-3 border border-ubuntu-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors"
                  />
                </div>
              </div>
            </div>
            
            {/* Quick Date Presets */}
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => {
                  const end = new Date();
                  const start = new Date();
                  start.setDate(start.getDate() - 7);
                  setStartDate(start.toISOString().split('T')[0]);
                  setEndDate(end.toISOString().split('T')[0]);
                }}
                className="text-xs px-3 py-1 border border-ubuntu-gray-300 text-ubuntu-gray-600 rounded hover:bg-ubuntu-gray-50 transition-colors"
              >
                Last 7 Days
              </button>
              <button
                onClick={() => {
                  const end = new Date();
                  const start = new Date();
                  start.setMonth(start.getMonth() - 1);
                  setStartDate(start.toISOString().split('T')[0]);
                  setEndDate(end.toISOString().split('T')[0]);
                }}
                className="text-xs px-3 py-1 border border-ubuntu-gray-300 text-ubuntu-gray-600 rounded hover:bg-ubuntu-gray-50 transition-colors"
              >
                Last 30 Days
              </button>
              <button
                onClick={() => {
                  const end = new Date();
                  const start = new Date();
                  start.setFullYear(start.getFullYear() - 1);
                  setStartDate(start.toISOString().split('T')[0]);
                  setEndDate(end.toISOString().split('T')[0]);
                }}
                className="text-xs px-3 py-1 border border-ubuntu-gray-300 text-ubuntu-gray-600 rounded hover:bg-ubuntu-gray-50 transition-colors"
              >
                Last Year
              </button>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <button
            onClick={handleGenerateReport}
            disabled={generating || !startDate || !endDate}
            className="px-8 py-4 bg-ubuntu-green text-white rounded-xl hover:bg-ubuntu-green-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl flex items-center justify-center font-semibold text-lg"
          >
            {generating ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Generating Report...
              </div>
            ) : (
              <div className="flex items-center">
                <Download className="h-5 w-5 mr-3" />
                Generate {selectedReport?.name} Report
              </div>
            )}
          </button>
        </div>

        {/* Available Reports */}
        <div className="mt-12 border-t border-ubuntu-gray-200 pt-8">
          <h4 className="font-bold text-ubuntu-gray-900 mb-6 flex items-center text-lg">
            <BarChart3 className="h-6 w-6 mr-3 text-ubuntu-green" />
            Available Reports
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTypes.map((report) => {
              const IconComponent = report.icon;
              return (
                <div 
                  key={report.id}
                  className={`bg-white rounded-xl p-6 border-2 transition-all cursor-pointer hover:shadow-lg ${
                    reportType === report.id 
                      ? 'border-ubuntu-green bg-ubuntu-green-lighter' 
                      : 'border-ubuntu-gray-200 hover:border-ubuntu-green'
                  }`}
                  onClick={() => setReportType(report.id)}
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg bg-${report.color}-light mr-4`}>
                      <IconComponent className={`h-6 w-6 text-${report.color}`} />
                    </div>
                    <span className="font-semibold text-ubuntu-gray-900">{report.name}</span>
                  </div>
                  <p className="text-ubuntu-gray-600 text-sm leading-relaxed">{report.description}</p>
                  <div className="mt-4 flex items-center text-xs text-ubuntu-gray-500">
                    <FileText className="h-3 w-3 mr-1" />
                    PDF, Excel, CSV formats
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Report Features */}
        <div className="mt-8 bg-ubuntu-blue-light rounded-xl p-6 border border-ubuntu-blue-light">
          <h5 className="font-semibold text-ubuntu-blue mb-3 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Report Features
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-ubuntu-blue text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-ubuntu-blue rounded-full mr-3"></div>
              <span>Real-time data analytics</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-ubuntu-blue rounded-full mr-3"></div>
              <span>Export to multiple formats</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-ubuntu-blue rounded-full mr-3"></div>
              <span>Scheduled report generation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;