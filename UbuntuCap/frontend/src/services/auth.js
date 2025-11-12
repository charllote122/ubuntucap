// Authentication utility functions
export const isAuthenticated = () => {
  return localStorage.getItem('auth_token') !== null
}

export const getAuthToken = () => {
  return localStorage.getItem('auth_token')
}

export const setAuthToken = (token) => {
  localStorage.setItem('auth_token', token)
}

export const removeAuthToken = () => {
  localStorage.removeItem('auth_token')
}