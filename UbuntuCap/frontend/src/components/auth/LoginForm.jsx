import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, Smartphone, Lock, LogIn, CheckCircle } from 'lucide-react'

const LoginForm = ({ onSubmit, isLoading = false, error = '', initialPhone = '' }) => {
  const [formData, setFormData] = useState({
    phone_number: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({
    phone_number: false,
    password: false
  })

  // Pre-fill phone number if provided (e.g., from registration)
  useEffect(() => {
    if (initialPhone) {
      setFormData(prev => ({
        ...prev,
        phone_number: formatPhoneNumber(initialPhone)
      }))
    }
  }, [initialPhone])

  // Helper function to format phone number
  const formatPhoneNumber = (phone) => {
    let formattedValue = phone.replace(/\D/g, '')
    
    if (formattedValue.length > 3 && formattedValue.length <= 6) {
      formattedValue = formattedValue.replace(/(\d{3})(\d{0,3})/, '$1 $2')
    } else if (formattedValue.length > 6) {
      formattedValue = formattedValue.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1 $2 $3')
    }
    
    return formattedValue
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ phone_number: true, password: true })
    
    if (formData.phone_number && formData.password) {
      // Remove spaces from phone number before sending to Django
      const loginData = {
        phone_number: formData.phone_number.replace(/\s/g, ''),
        password: formData.password
      }
      console.log('🔵 [LoginForm] Sending login data:', loginData)
      onSubmit(loginData)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'phone_number') {
      setFormData(prev => ({
        ...prev,
        [name]: formatPhoneNumber(value)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleBlur = (e) => {
    setTouched(prev => ({
      ...prev,
      [e.target.name]: true
    }))
  }

  const isPhoneValid = formData.phone_number.replace(/\s/g, '').length >= 12
  const isPasswordValid = formData.password.length >= 6
  const isFormValid = isPhoneValid && isPasswordValid

  const getPhoneError = () => {
    if (!touched.phone_number) return ''
    const cleanPhone = formData.phone_number.replace(/\s/g, '')
    if (!cleanPhone) return 'Phone number is required'
    if (cleanPhone.length < 12) return 'Phone number must be 12 digits (including 254)'
    if (!cleanPhone.startsWith('254')) return 'Phone number must start with 254'
    return ''
  }

  const getPasswordError = () => {
    if (!touched.password) return ''
    if (!formData.password) return 'Password is required'
    if (formData.password.length < 6) return 'Password must be at least 6 characters'
    return ''
  }

  const phoneError = getPhoneError()
  const passwordError = getPasswordError()

  // Show success states when fields are valid
  const showPhoneSuccess = touched.phone_number && isPhoneValid && !phoneError
  const showPasswordSuccess = touched.password && isPasswordValid && !passwordError

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start">
          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Phone Number Field */}
      <div>
        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Smartphone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="phone_number"
            name="phone_number"
            type="tel"
            required
            className={`block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
              phoneError && touched.phone_number
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : showPhoneSuccess
                ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                : 'border-gray-300'
            } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="254 712 345 678"
            value={formData.phone_number}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            maxLength={14}
          />
        </div>
        {phoneError && touched.phone_number && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></div>
            {phoneError}
          </p>
        )}
        {showPhoneSuccess && (
          <p className="mt-1 text-sm text-green-600 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Valid phone number
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <a
            href="/forgot-password"
            className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            className={`block w-full pl-10 pr-10 py-3 border rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
              passwordError && touched.password
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : showPasswordSuccess
                ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                : 'border-gray-300'
            } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            minLength={6}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
            )}
          </button>
        </div>
        {passwordError && touched.password && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></div>
            {passwordError}
          </p>
        )}
        {showPasswordSuccess && (
          <p className="mt-1 text-sm text-green-600 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Password looks good
          </p>
        )}
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          disabled={isLoading}
        />
        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
          Remember me for 30 days
        </label>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="group relative w-full flex justify-center items-center py-4 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:hover:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Signing in...
            </div>
          ) : (
            <div className="flex items-center">
              <LogIn className="h-5 w-5 mr-3" />
              Sign in to your account
            </div>
          )}
        </button>
      </div>

      {/* Demo Credentials (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-gray-700 text-sm font-medium mb-2">Demo Credentials:</p>
          <div className="text-gray-600 text-xs space-y-1">
            <p>Phone: <span className="font-mono bg-gray-100 px-1 rounded">254712345678</span></p>
            <p>Password: <span className="font-mono bg-gray-100 px-1 rounded">demopassword123</span></p>
          </div>
        </div>
      )}
    </form>
  )
}

export default LoginForm