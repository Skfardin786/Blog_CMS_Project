/**
 * Blog Detail Page
 * 
 * Displays a full blog post with:
 * - Title, author, and formatted date
 * - Full markdown-rendered content
 * - Edit and Delete buttons (visible only to the author)
 * - Delete confirmation dialog
 * - Loading and error states
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

/**
 * Formats an ISO date string to a readable format
 */
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function BlogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  /**
   * Fetch the blog post by ID on mount
   */
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/blogs/${id}`)
        setBlog(data)
      } catch (err) {
        console.error('Failed to fetch blog:', err)
        setError('Blog post not found or failed to load.')
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [id])

  /**
   * Check if the current user is the author of this blog
   */
  const isAuthor = () => {
    if (!user || !blog) return false
    const authorId = blog.author?._id || blog.author
    return authorId === user.id
  }

  /**
   * Handle blog deletion with confirmation dialog
   */
  const handleDelete = async () => {
    // Show browser confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to delete this blog post? This action cannot be undone.'
    )
    if (!confirmed) return

    setDeleting(true)
    try {
      await api.delete(`/blogs/${id}`)
      // Navigate to home after successful deletion
      navigate('/')
    } catch (err) {
      console.error('Failed to delete blog:', err)
      setError('Failed to delete the blog post. Please try again.')
      setDeleting(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    )
  }

  // Error state
  if (error && !blog) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg inline-block">
          <p className="font-medium">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto">
      {/* Blog Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {blog.title}
        </h1>

        {/* Author and Date Meta */}
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-slate-700">
              {blog.author?.name || 'Unknown'}
            </span>
          </span>
          <span>•</span>
          <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
        </div>

        {/* Author Action Buttons */}
        {isAuthor() && (
          <div className="flex items-center gap-3 mt-6">
            <Link
              to={`/blogs/${blog._id}/edit`}
              className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </header>

      {/* Error Message (for delete failures) */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Blog Content - Rendered Markdown */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="prose">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>
      </div>

      {/* Back Link */}
      <div className="mt-8">
        <Link
          to="/"
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to all posts
        </Link>
      </div>
    </article>
  )
}

export default BlogDetail
