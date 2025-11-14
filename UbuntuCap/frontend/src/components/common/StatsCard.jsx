import React from 'react'

const StatsCard = ({ number, label, icon, loading = false }) => {
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="group p-6 hover:scale-105 transition-transform duration-300">
      <div className="text-ubuntu-green mb-3 flex justify-center">
        {icon}
      </div>
      <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        {number}
      </div>
      <div className="text-gray-600 font-medium">
        {label}
      </div>
    </div>
  )
}

export default StatsCard