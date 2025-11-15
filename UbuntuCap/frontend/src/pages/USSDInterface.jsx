import React, { useState, useEffect } from 'react'
import Header from '../components/common/Header'
import { Smartphone, ArrowLeft, Send, CreditCard, Clock, CheckCircle } from 'lucide-react'

const USSDInterface = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Initial welcome message
    setOutput([
      'Welcome to UbuntuCap USSD Service',
      '',
      '1. Apply for Loan',
      '2. Check Loan Status',
      '3. Make Payment',
      '4. Repayment History',
      '5. Account Balance',
      '0. Exit'
    ])
  }, [])

  const handleInput = (value) => {
    if (isLoading) return
    
    setInput(prev => prev + value)
  }

  const handleSubmit = async () => {
    if (!input || isLoading) return
    
    setIsLoading(true)
    const userInput = input
    setInput('')
    
    // Add user input to output
    setOutput(prev => [...prev, `> ${userInput}`])
    
    // Simulate processing delay
    setTimeout(() => {
      let response = []
      
      switch (userInput) {
        case '1':
          response = [
            'Loan Application',
            '',
            'Enter loan amount (KES):',
            'Min: 1,000 - Max: 500,000'
          ]
          break
        case '2':
          response = [
            'Loan Status',
            '',
            'Latest Application:',
            'Amount: KES 25,000',
            'Status: Approved',
            'Disbursed: Today'
          ]
          break
        case '3':
          response = [
            'Make Payment',
            '',
            'Outstanding: KES 15,250',
            'Daily Payment: KES 1,250',
            '',
            '1. Pay Now',
            '2. Schedule Payment'
          ]
          break
        case '4':
          response = [
            'Repayment History',
            '',
            'Jan 15: KES 1,250 ✅',
            'Jan 14: KES 1,250 ✅',
            'Jan 13: KES 1,250 ✅',
            '',
            'Total Paid: KES 45,000'
          ]
          break
        case '5':
          response = [
            'Account Balance',
            '',
            'Available Limit: KES 475,000',
            'Active Loans: 1',
            'Credit Score: 720'
          ]
          break
        case '0':
          response = ['Thank you for using UbuntuCap. Goodbye!']
          break
        default:
          response = ['Invalid option. Please try again.']
      }
      
      setOutput(prev => [...prev, ...response])
      setIsLoading(false)
    }, 1500)
  }

  const handleClear = () => {
    setInput('')
  }

  const handleBackspace = () => {
    setInput(prev => prev.slice(0, -1))
  }

  return (
    <div className="min-h-screen bg-ubuntu-gray-900">
      <Header />
      
      <div className="max-w-md mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-ubuntu-green-light rounded-full mb-4">
            <Smartphone className="w-8 h-8 text-ubuntu-green" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">USSD Interface</h1>
          <p className="text-ubuntu-gray-400">Simulated USSD service for basic phones</p>
          <div className="inline-block mt-2 bg-ubuntu-green text-white px-3 py-1 rounded-full text-sm font-mono">
            *384*12345#
          </div>
        </div>

        {/* USSD Display */}
        <div className="bg-ubuntu-gray-800 text-ubuntu-green font-mono rounded-2xl p-6 min-h-[400px] flex flex-col shadow-lg border border-ubuntu-gray-700">
          {/* Service Header */}
          <div className="text-center mb-4 pb-3 border-b border-ubuntu-gray-700">
            <div className="text-sm text-ubuntu-green-light">UbuntuCap USSD Service</div>
            <div className="text-xs text-ubuntu-gray-500">Powered by Ubuntu Lending</div>
          </div>
          
          {/* Output Display */}
          <div className="flex-1 space-y-1 text-sm overflow-y-auto max-h-64">
            {output.map((line, index) => (
              <div key={index} className={line.startsWith('>') ? 'text-ubuntu-green-light' : ''}>
                {line}
              </div>
            ))}
            {isLoading && (
              <div className="text-ubuntu-green-light animate-pulse">
                Processing...
              </div>
            )}
          </div>
          
          {/* Input Section */}
          <div className="mt-6 pt-4 border-t border-ubuntu-gray-700">
            <div className="flex items-center justify-between text-sm text-ubuntu-green-light mb-2">
              <span>Enter option:</span>
              <span className="text-ubuntu-gray-500">{input.length}/20</span>
            </div>
            <div className="flex items-center bg-ubuntu-gray-900 rounded-lg px-3 py-2 border border-ubuntu-gray-600">
              <span className="text-ubuntu-green">*384*12345*</span>
              <div className="flex-1 flex items-center">
                <span className="text-ubuntu-green-light">{input}</span>
                <div className="w-2 h-4 bg-ubuntu-green animate-pulse ml-1"></div>
              </div>
              <span className="text-ubuntu-green">#</span>
            </div>
          </div>
        </div>

        {/* Keypad */}
        <div className="mt-6 bg-ubuntu-gray-800 rounded-2xl p-6 border border-ubuntu-gray-700">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((key) => (
              <button
                key={key}
                onClick={() => handleInput(key.toString())}
                disabled={isLoading}
                className="bg-ubuntu-gray-700 text-white h-14 rounded-lg font-semibold text-lg hover:bg-ubuntu-gray-600 active:bg-ubuntu-green disabled:opacity-50 transition-colors"
              >
                {key}
              </button>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleBackspace}
              disabled={isLoading || !input}
              className="bg-ubuntu-orange text-white py-3 rounded-lg font-semibold hover:bg-ubuntu-orange-dark disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Backspace
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !input}
              className="bg-ubuntu-green text-white py-3 rounded-lg font-semibold hover:bg-ubuntu-green-dark disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              <Send className="w-5 h-5 mr-2" />
              Send
            </button>
          </div>
          
          <button
            onClick={handleClear}
            disabled={isLoading || !input}
            className="w-full bg-ubuntu-red text-white py-3 rounded-lg font-semibold hover:bg-ubuntu-red-dark disabled:opacity-50 transition-colors mt-3"
          >
            Clear
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-ubuntu-green-lighter rounded-xl p-4 border border-ubuntu-green-light">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-ubuntu-green mr-2" />
              <span className="font-semibold text-ubuntu-green-dark text-sm">Quick Apply</span>
            </div>
            <p className="text-ubuntu-green-dark text-xs">
              Use *384*12345*1*AMOUNT# for instant loan application
            </p>
          </div>
          
          <div className="bg-ubuntu-blue-light rounded-xl p-4 border border-ubuntu-blue-light">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-ubuntu-blue mr-2" />
              <span className="font-semibold text-ubuntu-blue text-sm">24/7 Service</span>
            </div>
            <p className="text-ubuntu-blue text-xs">
              Available anytime on any mobile device
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-ubuntu-gray-800 rounded-2xl p-6 border border-ubuntu-gray-700">
          <h3 className="font-semibold text-white mb-3 flex items-center">
            <CreditCard className="w-5 h-5 text-ubuntu-green mr-2" />
            USSD Commands Guide
          </h3>
          <div className="space-y-2 text-sm text-ubuntu-gray-300">
            <div className="flex justify-between items-center py-2 border-b border-ubuntu-gray-700">
              <span>Loan Application</span>
              <code className="text-ubuntu-green font-mono">*384*12345*1#</code>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-ubuntu-gray-700">
              <span>Check Status</span>
              <code className="text-ubuntu-green font-mono">*384*12345*2#</code>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-ubuntu-gray-700">
              <span>Make Payment</span>
              <code className="text-ubuntu-green font-mono">*384*12345*3#</code>
            </div>
            <div className="flex justify-between items-center py-2">
              <span>Account Balance</span>
              <code className="text-ubuntu-green font-mono">*384*12345*5#</code>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 text-ubuntu-gray-500 text-sm">
          <p>No internet required • Works on all mobile phones</p>
          <p className="mt-1">Standard SMS rates apply</p>
        </div>
      </div>
    </div>
  )
}

export default USSDInterface