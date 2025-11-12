export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount)
}

export const formatPhoneNumber = (phone) => {
  // Format Kenyan phone numbers
  if (phone.startsWith('254')) {
    return `+${phone}`
  }
  return phone
}

export const calculateLoanTerms = (amount, days) => {
  const interestRate = 0.08 // 8%
  const serviceFee = Math.min(Math.max(amount * 0.02, 50), 500)
  const interest = amount * interestRate * (days / 365)
  const totalDue = amount + interest
  const disbursed = amount - serviceFee

  return {
    principal: amount,
    interestRate: (interestRate * 100).toFixed(1),
    serviceFee,
    interest: Math.round(interest),
    totalDue: Math.round(totalDue),
    disbursed: Math.round(disbursed),
    dailyPayment: Math.round(totalDue / days)
  }
}

export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    active: 'bg-blue-100 text-blue-800',
    repaid: 'bg-purple-100 text-purple-800',
    defaulted: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}