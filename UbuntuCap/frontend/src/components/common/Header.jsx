import React from 'react'
import { useAuth } from '../../contexts/AuthContext'

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <div className="w-8 h-8 bg-ubuntu-green rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">UbuntuCap</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Community Financing</p>
              </div>
            </a>
          </div>

          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <a href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </a>
                <a href="/apply" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Apply for Loan
                </a>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </a>
                <a href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </a>
                <a href="/register" className="bg-ubuntu-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-ubuntu-green-dark">
                  Sign Up
                </a>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header