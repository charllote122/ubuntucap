import React, { useState } from 'react'

const RegisterForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    business_name: '',
    business_type: '',
    password: '',
    password_confirm: ''
  })

  const businessTypes = [
    'Retail Shop',
    'Agriculture',
    'Food Vendor',
    'Services',
    'Manufacturing',
    'Transport',
    'Other'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.password_confirm) {
      alert('Passwords do not match')
      return
    }
    onSubmit(formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            required
            className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-ubuntu-green focus:border-ubuntu-green"
            value={formData.first_name}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            required
            className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-ubuntu-green focus:border-ubuntu-green"
            value={formData.last_name}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          id="phone_number"
          name="phone_number"
          type="tel"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-ubuntu-green focus:border-ubuntu-green"
          placeholder="254712345678"
          value={formData.phone_number}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-ubuntu-green focus:border-ubuntu-green"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
          Business Name
        </label>
        <input
          id="business_name"
          name="business_name"
          type="text"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-ubuntu-green focus:border-ubuntu-green"
          value={formData.business_name}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="business_type" className="block text-sm font-medium text-gray-700">
          Business Type
        </label>
        <select
          id="business_type"
          name="business_type"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-ubuntu-green focus:border-ubuntu-green"
          value={formData.business_type}
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="">Select business type</option>
          {businessTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-ubuntu-green focus:border-ubuntu-green"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          id="password_confirm"
          name="password_confirm"
          type="password"
          required
          className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-ubuntu-green focus:border-ubuntu-green"
          value={formData.password_confirm}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-ubuntu-green hover:bg-ubuntu-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ubuntu-green disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : (
            'Create Account'
          )}
        </button>
      </div>
    </form>
  )
}

export default RegisterForm