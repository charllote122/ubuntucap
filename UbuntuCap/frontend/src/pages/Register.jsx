import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import RegisterForm from '../components/auth/RegisterForm'

const Register = () => {
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (formData) => {
    setIsLoading(true)
    try {
      await register(formData)
      // Redirect handled in AuthContext
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-ubuntu-green rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">U</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Join UbuntuCap
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Start your business financing journey
          </p>
        </div>
        
        <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
        
        <div className="text-center">
          <a href="/login" className="text-ubuntu-green hover:text-ubuntu-green-dark">
            Already have an account? Sign in
          </a>
        </div>
      </div>
    </div>
  )
}

export default Register