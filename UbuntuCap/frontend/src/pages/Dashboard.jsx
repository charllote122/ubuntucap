import React from 'react'
import Header from '../components/common/Header'
import StatsCard from '../components/common/StatsCard'
import { CreditCard, Users, Zap, Shield } from 'lucide-react'

const Dashboard = () => {
  const features = [
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "USSD Access",
      description: "Apply for loans from any phone, no smartphone or internet required."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Quick Approval",
      description: "AI-powered credit scoring with decisions in hours, not weeks."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Focus",
      description: "Built on Ubuntu principles - we grow when our community grows."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Trusted",
      description: "Bank-level security with transparent terms and conditions."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Financing for <span className="text-ubuntu-green">African Entrepreneurs</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get quick, accessible loans for your small business. No collateral needed. 
            Built on the philosophy of Ubuntu - "I am because we are."
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a 
              href="/apply" 
              className="bg-ubuntu-green text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-ubuntu-green-dark transition-colors shadow-lg"
            >
              Apply for Loan
            </a>
            <a 
              href="/register" 
              className="border border-ubuntu-green text-ubuntu-green px-8 py-4 rounded-lg text-lg font-semibold hover:bg-ubuntu-green-light transition-colors"
            >
              Create Account
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose UbuntuCap?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're building the future of inclusive finance for African small businesses
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-ubuntu-green-light rounded-lg flex items-center justify-center mb-4 text-ubuntu-green">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatsCard number="10,000+" label="Loans Disbursed" />
            <StatsCard number="95%" label="Approval Rate" />
            <StatsCard number="KSh 50M+" label="Total Funding" />
            <StatsCard number="24h" label="Average Processing" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Ready to Grow Your Business?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of entrepreneurs who have transformed their businesses with UbuntuCap financing.
        </p>
        <a 
          href="/register" 
          className="bg-ubuntu-green text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-ubuntu-green-dark transition-colors shadow-lg"
        >
          Get Started Today
        </a>
      </section>
    </div>
  )
}

export default Dashboard