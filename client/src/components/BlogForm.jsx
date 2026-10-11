/**
 * BlogForm Component
 * 
 * Reusable form for creating and editing blog posts.
 * Features:
 * - Controlled inputs for title and content
 * - Live markdown preview with Write/Preview tab toggle
 * - Loading state on submit button
 * - Clean form styling with indigo accent colors
 * 
 * @param {object} props.initialData - Pre-filled data for edit mode (optional)
 * @param {function} props.onSubmit - Callback with { title, content } on form submit
 * @param {boolean} props.loading - Disables form and shows loading state
 */
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

function BlogForm({ initialData = null, onSubmit, loading = false }) {
  // Controlled form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  // Toggle between 'write' and 'preview' modes
  const [activeTab, setActiveTab] = useState('write')

  /**
   * Populate form fields when editing an existing blog
   * Only runs when initialData changes (e.g., after fetching blog data)
   */
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setContent(initialData.content || '')
    }
  }, [initialData])

  /**
   * Handle form submission
   * Prevents default form behavior and passes data to parent
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ title, content })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Input */}
      <div>
        <label
          htmlFor="blog-title"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Title
        </label>
        <input
          id="blog-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your blog title..."
          required
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Content Area with Write/Preview Tabs */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Content
        </label>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 mb-0">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'write'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'preview'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Preview
          </button>
        </div>

        {/* Write Mode: Textarea */}
        {activeTab === 'write' ? (
          <textarea
            id="blog-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content in Markdown..."
            required
            rows={14}
            className="w-full px-4 py-3 border border-slate-300 border-t-0 rounded-b-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors min-h-[300px] resize-y font-mono text-sm"
          />
        ) : (
          /* Preview Mode: Rendered Markdown */
          <div className="min-h-[300px] border border-slate-300 border-t-0 rounded-b-lg p-4 bg-white">
            {content ? (
              <div className="prose">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-slate-400 italic">Nothing to preview yet...</p>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading && (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {loading ? 'Publishing...' : initialData ? 'Update Blog' : 'Publish Blog'}
        </button>
      </div>
    </form>
  )
}

export default BlogForm
