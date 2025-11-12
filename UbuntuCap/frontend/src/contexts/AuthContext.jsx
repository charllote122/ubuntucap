import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (e.g., from localStorage)
    const savedUser = localStorage.getItem('ubuntucap_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials) => {
    // Mock login - replace with actual API call
    setIsLoading(true)
    try {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        phone: credentials.phone_number,
        email: 'john@example.com'
      }
      setUser(mockUser)
      localStorage.setItem('ubuntucap_user', JSON.stringify(mockUser))
      window.location.href = '/dashboard'
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    // Mock registration - replace with actual API call
    setIsLoading(true)
    try {
      const mockUser = {
        id: 1,
        name: `${userData.first_name} ${userData.last_name}`,
        phone: userData.phone_number,
        email: userData.email
      }
      setUser(mockUser)
      localStorage.setItem('ubuntucap_user', JSON.stringify(mockUser))
      window.location.href = '/dashboard'
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ubuntucap_user')
    window.location.href = '/'
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}