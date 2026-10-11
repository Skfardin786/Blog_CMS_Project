/**
 * Edit Blog Page (Protected)
 * 
 * Page for editing existing blog posts.
 * Features:
 * - Fetches blog by ID from URL params
 * - Checks if current user is the author (redirects if not)
 * - Uses BlogForm with pre-filled data
 * - Updates via API on submit
 * - Loading and error states
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import BlogForm from '../components/BlogForm'

function EditBlog() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  /**
   * Fetch the blog post to edit
   * Also verifies the current user is the author
   */
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/blogs/${id}`)

        // Authorization check: only the author can edit their post
        const authorId = data.author?._id || data.author
        if (authorId !== user?.id) {
          // Not the author - redirect to home
          navigate('/', { replace: true })
          return
        }

        setBlog(data)
      } catch (err) {
        console.error('Failed to fetch blog:', err)
        setError('Failed to load the blog post.')
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [id, user, navigate])

  /**
   * Handle blog update
   * Sends PUT request and redirects to detail page on success
   */
  const handleSubmit = async ({ title, content }) => {
    setError('')
    setSubmitting(true)

    try {
      await api.put(`/blogs/${id}`, { title, content })
      // Navigate to the updated blog's detail page
      navigate(`/blogs/${id}`)
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update blog post. Please try again.'
      )
    } finally {
      setSubmitting(false)
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

  // Error state (blog not found or fetch failed)
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
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Edit Blog</h1>
        <p className="text-slate-500 mt-2">Update your blog post</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Blog Form (with initialData for edit mode) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <BlogForm initialData={blog} onSubmit={handleSubmit} loading={submitting} />
      </div>
    </div>
  )
}

export default EditBlog
