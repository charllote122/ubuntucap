import React, { useState, useEffect } from 'react'
import Header from '../components/common/Header'
import StatsCard from '../components/common/StatsCard'
import { CreditCard, Users, Zap, Shield, ArrowRight, CheckCircle, Star, Clock, DollarSign } from 'lucide-react'
import { loanService } from '../services/loanService'

const Dashboard = () => {
  const [platformStats, setPlatformStats] = useState({
    loansDisbursed: 10000,
    approvalRate: 95,
    totalFunding: 50000000,
    processingTime: 24
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlatformStats()
  }, [])

  const fetchPlatformStats = async () => {
    try {
      // TODO: Replace with actual API call
      // const stats = await loanService.getPlatformStats();
      // setPlatformStats(stats);
      
      // Simulate API call delay
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Failed to fetch platform stats:', error)
      setLoading(false)
    }
  }

  const features = [
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "USSD & Mobile Access",
      description: "Apply for loans from any phone. Use *384*12345# for basic phones or our mobile app for smartphones.",
      benefits: ["No internet required", "Works on all phones", "24/7 access"]
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "AI-Powered Approval",
      description: "Instant credit decisions using alternative data. Get approved in hours, not weeks.",
      benefits: ["No collateral needed", "Alternative credit scoring", "Fast decisions"]
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Banking",
      description: "Built on Ubuntu principles - we succeed when our community succeeds.",
      benefits: ["Group lending options", "Community support", "Shared success"]
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Transparent",
      description: "Bank-level security with clear, upfront terms. No hidden fees or charges.",
      benefits: ["SSL encrypted", "Regulatory compliant", "Transparent pricing"]
    }
  ]

  const howItWorks = [
    {
      step: 1,
      title: "Register",
      description: "Create your account with basic business information",
      icon: <Users className="h-6 w-6" />
    },
    {
      step: 2,
      title: "Apply",
      description: "Submit your loan application in under 5 minutes",
      icon: <CreditCard className="h-6 w-6" />
    },
    {
      step: 3,
      title: "Get Approved",
      description: "Receive instant AI-powered credit decision",
      icon: <CheckCircle className="h-6 w-6" />
    },
    {
      step: 4,
      title: "Receive Funds",
      description: "Get money directly to your M-Pesa account",
      icon: <DollarSign className="h-6 w-6" />
    }
  ]

  const testimonials = [
    {
      name: "Sarah Wanjiku",
      business: "Fresh Produce Vendor",
      location: "Nairobi",
      testimonial: "UbuntuCap helped me expand my vegetable stall. The USSD service is perfect for someone like me who doesn't own a smartphone!",
      rating: 5
    },
    {
      name: "John Otieno",
      business: "Tailoring Shop",
      location: "Kisumu",
      testimonial: "I got my first business loan in 24 hours. No complicated paperwork, just simple and fast service.",
      rating: 5
    },
    {
      name: "Grace Akinyi",
      business: "Beauty Salon",
      location: "Mombasa",
      testimonial: "The community-focused approach makes UbuntuCap different. They truly understand small business needs.",
      rating: 4
    }
  ]

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-ubuntu-gray-300'}`} 
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ubuntu-green-lighter via-ubuntu-blue-light to-ubuntu-purple-light">
      <Header />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-ubuntu-green-light text-ubuntu-green-dark text-sm font-medium mb-6">
            <Zap className="h-4 w-4 mr-2" />
            Financing Africa's Economic Engine
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-ubuntu-gray-900 mb-6 leading-tight">
            Capital for the{' '}
            <span className="text-ubuntu-green bg-gradient-to-r from-ubuntu-green to-ubuntu-green-dark bg-clip-text text-transparent">
              Underserved
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-ubuntu-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get quick, accessible loans for your small business. No collateral needed. 
            Built on the philosophy of Ubuntu - <em>"I am because we are."</em>
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <a 
              href="/apply" 
              className="group bg-ubuntu-green text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-ubuntu-green-dark transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
            >
              Apply for Loan
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="/register" 
              className="group border-2 border-ubuntu-green text-ubuntu-green px-8 py-4 rounded-lg text-lg font-semibold hover:bg-ubuntu-green hover:text-white transition-all duration-300 flex items-center justify-center"
            >
              Create Free Account
            </a>
          </div>

          {/* USSD Callout */}
          <div className="bg-ubuntu-gray-800 rounded-2xl p-6 max-w-md mx-auto">
            <div className="text-center text-white">
              <CreditCard className="h-8 w-8 mx-auto mb-3" />
              <p className="font-mono text-lg mb-2">*384*12345#</p>
              <p className="text-ubuntu-gray-300 text-sm">Use this USSD code on any phone</p>
              <p className="text-ubuntu-green-light text-xs mt-2">No smartphone? No problem!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 border-y border-ubuntu-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <StatsCard 
              number={loading ? "..." : `${platformStats.loansDisbursed.toLocaleString()}+`} 
              label="Loans Disbursed" 
              icon={<DollarSign className="h-6 w-6" />}
            />
            <StatsCard 
              number={loading ? "..." : `${platformStats.approvalRate}%`} 
              label="Approval Rate" 
              icon={<CheckCircle className="h-6 w-6" />}
            />
            <StatsCard 
              number={loading ? "..." : `KSh ${(platformStats.totalFunding / 1000000).toFixed(0)}M+`} 
              label="Total Funding" 
              icon={<Users className="h-6 w-6" />}
            />
            <StatsCard 
              number={loading ? "..." : `${platformStats.processingTime}h`} 
              label="Average Processing" 
              icon={<Clock className="h-6 w-6" />}
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-ubuntu-gray-900 mb-4">
            Designed for African Entrepreneurs
          </h2>
          <p className="text-lg text-ubuntu-gray-600 max-w-2xl mx-auto">
            We've built UbuntuCap specifically to address the unique challenges faced by small businesses in Africa
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-white p-8 rounded-2xl shadow-sm border border-ubuntu-gray-200 hover:shadow-xl transition-all duration-300 hover:border-ubuntu-green-light"
            >
              <div className="w-14 h-14 bg-ubuntu-green-light rounded-xl flex items-center justify-center mb-6 text-ubuntu-green group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-ubuntu-gray-900 mb-3">{feature.title}</h3>
              <p className="text-ubuntu-gray-600 mb-4 leading-relaxed">{feature.description}</p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center text-sm text-ubuntu-gray-500">
                    <CheckCircle className="h-4 w-4 text-ubuntu-green mr-2" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-ubuntu-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ubuntu-gray-900 mb-4">
              How UbuntuCap Works
            </h2>
            <p className="text-lg text-ubuntu-gray-600 max-w-2xl mx-auto">
              Getting funding for your business has never been easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-ubuntu-gray-200 flex items-center justify-center mx-auto group-hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 bg-ubuntu-green-light rounded-lg flex items-center justify-center text-ubuntu-green">
                      {step.icon}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-ubuntu-green rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-ubuntu-gray-900 mb-2">{step.title}</h3>
                <p className="text-ubuntu-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-ubuntu-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-ubuntu-gray-600 max-w-2xl mx-auto">
            Hear from entrepreneurs who have transformed their businesses with UbuntuCap
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-ubuntu-gray-200">
              <div className="flex items-center mb-4">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-ubuntu-gray-600 italic mb-6">"{testimonial.testimonial}"</p>
              <div className="border-t border-ubuntu-gray-200 pt-4">
                <p className="font-semibold text-ubuntu-gray-900">{testimonial.name}</p>
                <p className="text-sm text-ubuntu-gray-600">{testimonial.business}</p>
                <p className="text-sm text-ubuntu-green">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-ubuntu-green to-ubuntu-green-dark py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start Your Business Journey Today
          </h2>
          <p className="text-xl text-ubuntu-green-light mb-8 max-w-2xl mx-auto">
            Join thousands of African entrepreneurs building their dreams with UbuntuCap
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a 
              href="/register" 
              className="bg-white text-ubuntu-green px-8 py-4 rounded-lg text-lg font-semibold hover:bg-ubuntu-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started Free
            </a>
            <a 
              href="/calculator" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-ubuntu-green transition-all duration-300"
            >
              Calculate Your Loan
            </a>
          </div>
          <p className="text-ubuntu-green-lighter text-sm mt-6">
            No credit card required • No hidden fees • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  )
}

export default Dashboard