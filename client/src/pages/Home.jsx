/**
 * Home Page
 * 
 * Landing page that displays all blog posts in a responsive grid.
 * Features:
 * - Fetches all blogs from API on mount
 * - Responsive grid layout (1/2/3 columns)
 * - Loading spinner and error handling
 * - Empty state message when no blogs exist
 */
import { useState, useEffect } from 'react'
import api from '../services/api'
import BlogCard from '../components/BlogCard'

function Home() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /**
   * Fetch all blogs from the API on component mount
   */
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await api.get('/blogs')
        setBlogs(data)
      } catch (err) {
        console.error('Failed to fetch blogs:', err)
        setError('Failed to load blog posts. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  // Loading state with spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg inline-block">
          <p className="font-medium">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Latest Blog Posts</h1>
        <p className="text-slate-500 mt-2">Discover stories, ideas, and insights</p>
      </div>

      {/* Blog Grid or Empty State */}
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-slate-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-600 mb-1">No blog posts yet</h3>
          <p className="text-slate-400">Be the first to create a blog post!</p>
        </div>
      )}
    </div>
  )
}

export default Home
