import React, { useState } from 'react'
import LoanCalculator from '../common/LoanCalculator'

const ApplicationForm = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    amount: 5000,
    purpose: '',
    period: 30,
    business_details: ''
  })

  const loanPurposes = [
    'Inventory Purchase',
    'Equipment Buy',
    'Business Expansion',
    'Working Capital',
    'Emergency Funds',
    'Other Business Needs'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Loan application:', formData)
    alert('Loan application submitted successfully!')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div>
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= stepNumber ? 'bg-ubuntu-green text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div className={`w-20 h-1 mx-2 ${
                step > stepNumber ? 'bg-ubuntu-green' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How much do you need?
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">KSh</span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green"
                  min="500"
                  max="50000"
                  required
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Min: KSh 500</span>
                <span>Max: KSh 50,000</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What will you use the funds for?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {loanPurposes.map((purpose) => (
                  <button
                    key={purpose}
                    type="button"
                    onClick={() => setFormData({...formData, purpose})}
                    className={`p-3 text-left rounded-lg border-2 transition-colors ${
                      formData.purpose === purpose
                        ? 'border-ubuntu-green bg-ubuntu-green-light'
                        : 'border-gray-200 hover:border-ubuntu-green'
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-900">{purpose}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repayment Period
              </label>
              <select
                name="period"
                value={formData.period}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green"
              >
                <option value="15">15 days</option>
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
              </select>
            </div>

            <LoanCalculator />

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!formData.amount || !formData.purpose}
              className="w-full bg-ubuntu-green text-white py-3 rounded-lg font-medium hover:bg-ubuntu-green-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Details
                </label>
                <textarea
                  name="business_details"
                  value={formData.business_details}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green"
                  placeholder="Tell us more about your business, how long you've been operating, and how you plan to use the loan..."
                  required
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 bg-ubuntu-green text-white py-3 rounded-lg font-medium hover:bg-ubuntu-green-dark transition-colors"
              >
                Review Application
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Application</h3>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Amount:</span>
                  <span className="font-semibold">KSh {formData.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Purpose:</span>
                  <span className="font-semibold">{formData.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Repayment Period:</span>
                  <span className="font-semibold">{formData.period} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Business Details:</span>
                  <span className="font-semibold text-right max-w-xs">{formData.business_details}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Your application will be automatically reviewed using our 
                AI credit scoring system. Decision typically takes 2-4 hours.
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-ubuntu-green text-white py-3 rounded-lg font-medium hover:bg-ubuntu-green-dark transition-colors"
              >
                Submit Application
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default ApplicationForm