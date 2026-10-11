/**
 * Create Blog Page (Protected)
 * 
 * Page for creating new blog posts.
 * Features:
 * - Uses the reusable BlogForm component
 * - Posts to API on submit
 * - Redirects to new blog's detail page on success
 * - Error handling and loading states
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import BlogForm from '../components/BlogForm'

function CreateBlog() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  /**
   * Handle blog creation
   * Posts new blog data to the API and redirects on success
   */
  const handleSubmit = async ({ title, content }) => {
    setError('')
    setLoading(true)

    try {
      const { data } = await api.post('/blogs', { title, content })
      // Navigate to the newly created blog's detail page
      navigate(`/blogs/${data._id}`)
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to create blog post. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Create New Blog</h1>
        <p className="text-slate-500 mt-2">Share your thoughts with the world</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Blog Form (no initialData for create mode) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <BlogForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}

export default CreateBlog
