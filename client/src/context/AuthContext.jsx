/**
 * Authentication Context
 * 
 * Provides global auth state management using React Context API.
 * Handles:
 * - User login/register via API calls
 * - Persistent auth state via localStorage
 * - Loading state during initial auth check
 * - Logout functionality
 */
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

// Create the auth context with default values
const AuthContext = createContext(null)

/**
 * AuthProvider Component
 * Wraps the app to provide authentication state to all children
 */
export function AuthProvider({ children }) {
  // User object (null when not logged in)
  const [user, setUser] = useState(null)
  // Loading flag - true during initial auth check
  const [loading, setLoading] = useState(true)

  /**
   * On mount: Check localStorage for existing auth session
   * This allows users to stay logged in across page refreshes
   */
  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (token && storedUser) {
      try {
        // Parse the stored user object
        setUser(JSON.parse(storedUser))
      } catch (err) {
        // If parsing fails, clear invalid data
        console.error('Failed to parse stored user data:', err)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }

    // Auth check complete
    setLoading(false)
  }, [])

  /**
   * Login function
   * Sends credentials to the API, stores token and user data
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {object} API response data
   */
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    // Store auth data in localStorage for persistence
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    // Update state to trigger re-renders
    setUser(data.user)
    return data
  }

  /**
   * Register function
   * Creates a new account, stores token and user data
   * @param {string} name - User's display name
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {object} API response data
   */
  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    // Store auth data in localStorage for persistence
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    // Update state to trigger re-renders
    setUser(data.user)
    return data
  }

  /**
   * Logout function
   * Clears all auth data from localStorage and state
   */
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  // Provide auth state and methods to all children
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook to access auth context
 * Must be used within an AuthProvider
 * @returns {object} Auth context value (user, loading, login, register, logout)
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
