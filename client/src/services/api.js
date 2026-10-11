/**
 * Axios API Instance
 * 
 * Centralized HTTP client configuration with:
 * - Base URL from environment variable
 * - Automatic JWT token injection via request interceptor
 * - 401 response handling via response interceptor (auto-logout)
 */
import axios from 'axios'

// Create axios instance with base URL from env variable, fallback to '/api'
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request Interceptor
 * Attaches JWT token from localStorage to every outgoing request
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * - Unwraps response.data so components receive { success, data } directly
 * - Handles 401 responses: only auto-redirects if a stored token exists
 *   (meaning the session expired), not on login/register credential errors
 */
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Only auto-logout if there was a stored token (expired session)
      // Don't redirect on login/register 401 errors (wrong credentials)
      const token = localStorage.getItem('token')
      if (token) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
