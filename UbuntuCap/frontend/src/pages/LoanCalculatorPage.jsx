import React from 'react'
import Header from '../components/common/Header'
import LoanCalculator from '../components/loans/LoanCalculator'

const LoanCalculatorPage = () => {
  return (
    <div className="min-h-screen bg-ubuntu-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-ubuntu-green-light rounded-full mb-6">
            <svg className="w-10 h-10 text-ubuntu-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-ubuntu-gray-900 mb-4">
            Smart Loan Calculator
          </h1>
          <p className="text-xl text-ubuntu-gray-600 max-w-2xl mx-auto">
            Plan your business financing with our transparent calculator. Know exactly what you'll pay before you apply.
          </p>
        </div>

        {/* Main Calculator Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-ubuntu-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-ubuntu-green to-ubuntu-green-dark px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Calculate Your Repayment</h2>
            <p className="text-ubuntu-green-light mt-2">
              Adjust the sliders to see how different loan amounts and terms affect your payments
            </p>
          </div>
          <div className="p-8">
            <LoanCalculator />
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-ubuntu-green-lighter rounded-xl p-6 border border-ubuntu-green-light">
            <h3 className="font-semibold text-ubuntu-green-dark text-lg mb-4">
              💡 How to Use This Calculator
            </h3>
            <ul className="space-y-3 text-ubuntu-green-dark">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-ubuntu-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Enter your desired loan amount (KES 1,000 - 500,000)</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-ubuntu-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Choose a repayment period that fits your cash flow</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-ubuntu-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>See your daily repayment amount and total cost</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-ubuntu-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Compare different scenarios to find what works best</span>
              </li>
            </ul>
          </div>

          <div className="bg-ubuntu-blue-light rounded-xl p-6 border border-ubuntu-blue-light">
            <h3 className="font-semibold text-ubuntu-blue text-lg mb-4">
              🏆 Why Choose UbuntuCap?
            </h3>
            <ul className="space-y-3 text-ubuntu-blue">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-ubuntu-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span><strong>8.5% Fixed Rate</strong> - No surprises</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-ubuntu-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span><strong>KES 100 Fee Only</strong> - No hidden charges</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-ubuntu-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span><strong>Mobile Money</strong> - Automatic daily deductions</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-ubuntu-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span><strong>Credit Building</strong> - Improve your score with timely payments</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-ubuntu-green to-ubuntu-green-dark rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Grow Your Business?</h3>
            <p className="text-ubuntu-green-light mb-6 text-lg">
              Apply for your loan in just 5 minutes and get funds within 24 hours
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a 
                href="/apply" 
                className="bg-white text-ubuntu-green px-8 py-3 rounded-lg font-semibold hover:bg-ubuntu-gray-100 transition-colors shadow-lg hover:shadow-xl"
              >
                Apply for Loan
              </a>
              <a 
                href="/dashboard" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-ubuntu-green transition-all duration-300"
              >
                View Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoanCalculatorPage