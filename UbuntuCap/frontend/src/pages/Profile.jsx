import React from 'react'
import Header from '../components/common/Header'

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
          {/* Profile form and information */}
        </div>
      </div>
    </div>
  )
}

export default Profile