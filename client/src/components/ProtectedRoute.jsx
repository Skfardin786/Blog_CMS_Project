/**
 * ProtectedRoute Component
 * 
 * Route guard that checks authentication status:
 * - Shows loading spinner while auth state is being determined
 * - Redirects unauthenticated users to /login
 * - Renders child routes (Outlet) for authenticated users
 */
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute() {
  const { user, loading } = useAuth()

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Render protected child routes
  return <Outlet />
}

export default ProtectedRoute
