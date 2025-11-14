import React from 'react'
import Header from '../components/common/Header'

const USSDInterface = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="max-w-md mx-auto py-8 px-4">
        <div className="bg-black text-green-400 font-mono rounded-lg p-6 min-h-[400px] flex flex-col">
          <div className="text-center mb-4">
            <div className="text-sm opacity-75">UbuntuCap USSD Service</div>
            <div className="text-xs opacity-50">*384*12345#</div>
          </div>
          
          <div className="flex-1 space-y-2">
            <div>1. Apply for Loan</div>
            <div>2. Check Loan Status</div>
            <div>3. Make Payment</div>
            <div>4. Repayment History</div>
            <div>5. Account Balance</div>
            <div>0. Exit</div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-green-800">
            <div className="text-sm opacity-75">Enter option:</div>
            <div className="flex items-center">
              <span>*384*12345*</span>
              <div className="w-2 h-4 bg-green-400 animate-pulse ml-1"></div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-4 text-gray-400 text-sm">
          Simulated USSD interface for basic phone users
        </div>

        <div className="mt-6 bg-gray-800 rounded-lg p-4 text-gray-300">
          <h3 className="font-semibold mb-2">USSD Commands</h3>
          <div className="text-sm space-y-1">
            <div><span className="text-green-400">*384*12345*1#</span> - Loan Application</div>
            <div><span className="text-green-400">*384*12345*2#</span> - Check Status</div>
            <div><span className="text-green-400">*384*12345*3#</span> - Make Payment</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default USSDInterface