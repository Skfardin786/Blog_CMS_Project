/**
 * Blog Routes
 * -----------
 * Defines the API endpoints for blog CRUD operations.
 *
 * Route structure:
 *   GET    /api/blogs       → Get all blogs (Public)
 *   GET    /api/blogs/:id   → Get a single blog (Public)
 *   POST   /api/blogs       → Create a new blog (Protected)
 *   PUT    /api/blogs/:id   → Update a blog (Protected + Owner only)
 *   DELETE /api/blogs/:id   → Delete a blog (Protected + Owner only)
 *
 * The `protect` middleware is applied to routes that require authentication.
 * It verifies the JWT token before the controller runs.
 */

const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const protect = require('../middleware/auth');

// Public routes — anyone can read blogs
router.get('/', getBlogs);
router.get('/:id', getBlog);

// Protected routes — must be logged in (JWT required)
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;
