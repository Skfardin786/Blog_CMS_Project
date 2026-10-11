/**
 * Navbar Component
 * 
 * Responsive navigation bar that displays:
 * - App branding (BlogCMS logo/text)
 * - Auth-dependent navigation links:
 *   - Logged in: New Blog button, user greeting, Logout
 *   - Logged out: Login and Register links
 */
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  /**
   * Handle logout: clear auth state and redirect to login
   */
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <Link
            to="/"
            className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            BlogCMS
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {user ? (
              // Authenticated user links
              <>
                <Link
                  to="/blogs/new"
                  className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  New Blog
                </Link>
                <span className="text-sm text-slate-600 hidden sm:inline">
                  Hi, <span className="font-medium text-slate-800">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-slate-500 hover:text-red-600 transition-colors font-medium cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              // Guest user links
              <>
                <Link
                  to="/login"
                  className="text-sm text-slate-600 hover:text-indigo-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
