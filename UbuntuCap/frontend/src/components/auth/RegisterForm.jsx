import React, { useState } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle,
  AlertCircle,
  UserPlus 
} from 'lucide-react'

const RegisterForm = ({ onSubmit, isLoading = false, error = '' }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    business_name: '',
    business_type: '',
    business_location: '',
    password: '',
    password_confirm: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [touched, setTouched] = useState({
    first_name: false,
    last_name: false,
    phone_number: false,
    email: false,
    business_name: false,
    business_type: false,
    password: false,
    password_confirm: false
  })

  const businessTypes = [
    'Retail Shop',
    'Food & Restaurant',
    'Agriculture & Farming',
    'Services',
    'Manufacturing',
    'Transport & Logistics',
    'Wholesale',
    'Construction',
    'Beauty & Salon',
    'Technology',
    'Healthcare',
    'Education',
    'Other'
  ]

  const locations = [
    'Nairobi',
    'Mombasa',
    'Kisumu',
    'Nakuru',
    'Eldoret',
    'Thika',
    'Malindi',
    'Kitale',
    'Garissa',
    'Other'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({
      first_name: true,
      last_name: true,
      phone_number: true,
      email: true,
      business_name: true,
      business_type: true,
      business_location: true,
      password: true,
      password_confirm: true
    })

    if (formData.password !== formData.password_confirm) {
      return
    }

    if (isFormValid) {
      onSubmit(formData)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Format phone number as user types
    if (name === 'phone_number') {
      // Remove all non-digit characters
      let formattedValue = value.replace(/\D/g, '')
      
      // Format as 254 XXX XXX XXX
      if (formattedValue.length > 3 && formattedValue.length <= 6) {
        formattedValue = formattedValue.replace(/(\d{3})(\d{0,3})/, '$1 $2')
      } else if (formattedValue.length > 6) {
        formattedValue = formattedValue.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1 $2 $3')
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
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

  // Validation functions
  const isFirstNameValid = formData.first_name.length >= 2
  const isLastNameValid = formData.last_name.length >= 2
  const isPhoneValid = formData.phone_number.replace(/\s/g, '').length >= 12
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  const isBusinessNameValid = formData.business_name.length >= 2
  const isBusinessTypeValid = formData.business_type.length > 0
  const isLocationValid = formData.business_location.length > 0
  const isPasswordValid = formData.password.length >= 6
  const isPasswordMatch = formData.password === formData.password_confirm && formData.password_confirm.length > 0

  const isFormValid = isFirstNameValid && isLastNameValid && isPhoneValid && 
                     isEmailValid && isBusinessNameValid && isBusinessTypeValid && 
                     isLocationValid && isPasswordValid && isPasswordMatch

  const getFieldError = (fieldName, value, validator) => {
    if (!touched[fieldName]) return ''
    if (!value) return `${fieldName.replace('_', ' ')} is required`
    return validator(value) || ''
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
      {/* Error Message */}
      {error && (
        <div className="bg-ubuntu-red-light border border-ubuntu-red text-ubuntu-red px-4 py-3 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Personal Information Section */}
      <div className="bg-ubuntu-gray-50 rounded-xl p-6 border border-ubuntu-gray-200">
        <h3 className="text-lg font-semibold text-ubuntu-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-ubuntu-green" />
          Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-ubuntu-gray-700 mb-2">
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ubuntu-gray-400 h-4 w-4" />
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-ubuntu-gray-400 text-ubuntu-gray-900 focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors ${
                  touched.first_name && !isFirstNameValid
                    ? 'border-ubuntu-red focus:ring-ubuntu-red focus:border-ubuntu-red'
                    : 'border-ubuntu-gray-300'
                } ${isLoading ? 'bg-ubuntu-gray-100 cursor-not-allowed' : ''}`}
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
                minLength={2}
              />
            </div>
            {touched.first_name && isFirstNameValid && (
              <p className="mt-1 text-xs text-ubuntu-green flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Looks good
              </p>
            )}
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-ubuntu-gray-700 mb-2">
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ubuntu-gray-400 h-4 w-4" />
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-ubuntu-gray-400 text-ubuntu-gray-900 focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors ${
                  touched.last_name && !isLastNameValid
                    ? 'border-ubuntu-red focus:ring-ubuntu-red focus:border-ubuntu-red'
                    : 'border-ubuntu-gray-300'
                } ${isLoading ? 'bg-ubuntu-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
                minLength={2}
              />
            </div>
            {touched.last_name && isLastNameValid && (
              <p className="mt-1 text-xs text-ubuntu-green flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Looks good
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-ubuntu-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ubuntu-gray-400 h-4 w-4" />
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                required
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-ubuntu-gray-400 text-ubuntu-gray-900 focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors ${
                  touched.phone_number && !isPhoneValid
                    ? 'border-ubuntu-red focus:ring-ubuntu-red focus:border-ubuntu-red'
                    : 'border-ubuntu-gray-300'
                } ${isLoading ? 'bg-ubuntu-gray-100 cursor-not-allowed' : ''}`}
                placeholder="254 712 345 678"
                value={formData.phone_number}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
                maxLength={14}
              />
            </div>
            {touched.phone_number && isPhoneValid && (
              <p className="mt-1 text-xs text-ubuntu-green flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Valid phone number
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ubuntu-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ubuntu-gray-400 h-4 w-4" />
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-ubuntu-gray-400 text-ubuntu-gray-900 focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors ${
                  touched.email && !isEmailValid
                    ? 'border-ubuntu-red focus:ring-ubuntu-red focus:border-ubuntu-red'
                    : 'border-ubuntu-gray-300'
                } ${isLoading ? 'bg-ubuntu-gray-100 cursor-not-allowed' : ''}`}
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </div>
            {touched.email && isEmailValid && (
              <p className="mt-1 text-xs text-ubuntu-green flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Valid email
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Business Information Section */}
      <div className="bg-ubuntu-gray-50 rounded-xl p-6 border border-ubuntu-gray-200">
        <h3 className="text-lg font-semibold text-ubuntu-gray-900 mb-4 flex items-center">
          <Building className="h-5 w-5 mr-2 text-ubuntu-green" />
          Business Information
        </h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="business_name" className="block text-sm font-medium text-ubuntu-gray-700 mb-2">
              Business Name
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ubuntu-gray-400 h-4 w-4" />
              <input
                id="business_name"
                name="business_name"
                type="text"
                required
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-ubuntu-gray-400 text-ubuntu-gray-900 focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors ${
                  touched.business_name && !isBusinessNameValid
                    ? 'border-ubuntu-red focus:ring-ubuntu-red focus:border-ubuntu-red'
                    : 'border-ubuntu-gray-300'
                } ${isLoading ? 'bg-ubuntu-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Fresh Produce Ltd"
                value={formData.business_name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
                minLength={2}
              />
            </div>
            {touched.business_name && isBusinessNameValid && (
              <p className="mt-1 text-xs text-ubuntu-green flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Valid business name
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="business_type" className="block text-sm font-medium text-ubuntu-gray-700 mb-2">
                Business Type
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ubuntu-gray-400 h-4 w-4" />
                <select
                  id="business_type"
                  name="business_type"
                  required
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-ubuntu-gray-900 focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors appearance-none ${
                    touched.business_type && !isBusinessTypeValid
                      ? 'border-ubuntu-red focus:ring-ubuntu-red focus:border-ubuntu-red'
                      : 'border-ubuntu-gray-300'
                  } ${isLoading ? 'bg-ubuntu-gray-100 cursor-not-allowed' : ''}`}
                  value={formData.business_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                >
                  <option value="">Select business type</option>
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="business_location" className="block text-sm font-medium text-ubuntu-gray-700 mb-2">
                Business Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ubuntu-gray-400 h-4 w-4" />
                <select
                  id="business_location"
                  name="business_location"
                  required
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-ubuntu-gray-900 focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors appearance-none ${
                    touched.business_location && !isLocationValid
                      ? 'border-ubuntu-red focus:ring-ubuntu-red focus:border-ubuntu-red'
                      : 'border-ubuntu-gray-300'
                  } ${isLoading ? 'bg-ubuntu-gray-100 cursor-not-allowed' : ''}`}
                  value={formData.business_location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                >
                  <option value="">Select location</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-ubuntu-gray-50 rounded-xl p-6 border border-ubuntu-gray-200">
        <h3 className="text-lg font-semibold text-ubuntu-gray-900 mb-4 flex items-center">
          <Lock className="h-5 w-5 mr-2 text-ubuntu-green" />
          Security
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ubuntu-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ubuntu-gray-400 h-4 w-4" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className={`block w-full pl-10 pr-10 py-3 border rounded-lg placeholder-ubuntu-gray-400 text-ubuntu-gray-900 focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors ${
                  touched.password && !isPasswordValid
                    ? 'border-ubuntu-red focus:ring-ubuntu-red focus:border-ubuntu-red'
                    : 'border-ubuntu-gray-300'
                } ${isLoading ? 'bg-ubuntu-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Minimum 6 characters"
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
                  <EyeOff className="h-4 w-4 text-ubuntu-gray-400 hover:text-ubuntu-gray-600 transition-colors" />
                ) : (
                  <Eye className="h-4 w-4 text-ubuntu-gray-400 hover:text-ubuntu-gray-600 transition-colors" />
                )}
              </button>
            </div>
            {touched.password && isPasswordValid && (
              <p className="mt-1 text-xs text-ubuntu-green flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Strong password
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password_confirm" className="block text-sm font-medium text-ubuntu-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ubuntu-gray-400 h-4 w-4" />
              <input
                id="password_confirm"
                name="password_confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className={`block w-full pl-10 pr-10 py-3 border rounded-lg placeholder-ubuntu-gray-400 text-ubuntu-gray-900 focus:outline-none focus:ring-2 focus:ring-ubuntu-green focus:border-ubuntu-green transition-colors ${
                  touched.password_confirm && !isPasswordMatch
                    ? 'border-ubuntu-red focus:ring-ubuntu-red focus:border-ubuntu-red'
                    : 'border-ubuntu-gray-300'
                } ${isLoading ? 'bg-ubuntu-gray-100 cursor-not-allowed' : ''}`}
                placeholder="Confirm your password"
                value={formData.password_confirm}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
                minLength={6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-ubuntu-gray-400 hover:text-ubuntu-gray-600 transition-colors" />
                ) : (
                  <Eye className="h-4 w-4 text-ubuntu-gray-400 hover:text-ubuntu-gray-600 transition-colors" />
                )}
              </button>
            </div>
            {touched.password_confirm && isPasswordMatch && (
              <p className="mt-1 text-xs text-ubuntu-green flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Passwords match
              </p>
            )}
            {touched.password_confirm && formData.password_confirm && !isPasswordMatch && (
              <p className="mt-1 text-xs text-ubuntu-red flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Passwords don't match
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="group relative w-full flex justify-center items-center py-4 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-ubuntu-green hover:bg-ubuntu-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ubuntu-green disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Creating Account...
            </div>
          ) : (
            <div className="flex items-center">
              <UserPlus className="h-5 w-5 mr-3" />
              Create UbuntuCap Account
            </div>
          )}
        </button>
      </div>

      {/* Terms Notice */}
      <div className="bg-ubuntu-blue-light rounded-lg p-4 border border-ubuntu-blue-light">
        <p className="text-ubuntu-blue text-sm text-center">
          By creating an account, you agree to our{' '}
          <a href="/terms" className="font-semibold hover:underline">Terms of Service</a>{' '}
          and{' '}
          <a href="/privacy" className="font-semibold hover:underline">Privacy Policy</a>
        </p>
      </div>
    </form>
  )
}

export default RegisterForm