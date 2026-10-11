/**
 * BlogCard Component
 * 
 * Displays a blog post preview card with:
 * - Post title (linked to detail page)
 * - Content snippet (first 150 chars, markdown stripped)
 * - Author name and formatted date
 * - Hover effects for interactivity
 * 
 * @param {object} props.blog - Blog object with _id, title, content, author, createdAt
 */
import { Link } from 'react-router-dom'

/**
 * Strips markdown syntax from text to create a plain-text snippet
 * Removes headers, bold, italic, links, images, code blocks, etc.
 */
function stripMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/#{1,6}\s?/g, '')       // Remove headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1')     // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links, keep text
    .replace(/!\[.*?\]\(.+?\)/g, '') // Remove images
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove inline/block code
    .replace(/\n/g, ' ')             // Replace newlines with spaces
    .replace(/\s+/g, ' ')           // Collapse multiple spaces
    .trim()
}

/**
 * Formats an ISO date string to a human-readable format
 */
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function BlogCard({ blog }) {
  const snippet = stripMarkdown(blog.content).slice(0, 150)

  return (
    <article className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        {/* Blog Title */}
        <Link to={`/blogs/${blog._id}`}>
          <h2 className="text-lg font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
            {blog.title}
          </h2>
        </Link>

        {/* Content Snippet */}
        <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
          {snippet}{snippet.length >= 150 ? '...' : ''}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            {/* Author icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-slate-600">
              {blog.author?.name || 'Unknown'}
            </span>
          </span>
          <time dateTime={blog.createdAt}>
            {formatDate(blog.createdAt)}
          </time>
        </div>
      </div>
    </article>
  )
}

export default BlogCard
