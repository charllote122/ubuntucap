import React from 'react'

const StatsCard = ({ number, label, icon = '📊' }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center">
        <div className="p-2 bg-green-100 rounded-lg text-green-600">
          <span className="text-xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{number}</p>
        </div>
      </div>
    </div>
  )
}

export default StatsCard