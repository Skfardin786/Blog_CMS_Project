/**
 * Blog Controller
 * ---------------
 * Handles all CRUD operations for blog posts.
 *
 * Key patterns demonstrated:
 *   - Mongoose populate() to join data across collections
 *   - Ownership checks (only the author can edit/delete their posts)
 *   - Consistent JSON response format
 *   - Using ApiError for meaningful error messages
 */

const Blog = require('../models/Blog');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Get all blogs
 * @route   GET /api/blogs
 * @access  Public
 */
const getBlogs = async (req, res, next) => {
  try {
    // Find all blogs, populate the author field with name & email,
    // and sort by newest first (descending createdAt)
    const blogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single blog by ID
 * @route   GET /api/blogs/:id
 * @access  Public
 */
const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      'author',
      'name email'
    );

    // If no blog is found with this ID, return 404
    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new blog
 * @route   POST /api/blogs
 * @access  Private (requires authentication)
 */
const createBlog = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    // Validate required fields
    if (!title || !content) {
      throw new ApiError(400, 'Please provide title and content');
    }

    // Create the blog with the authenticated user's ID as the author
    // req.user.id comes from the auth middleware (protect)
    const blog = await Blog.create({
      title,
      content,
      author: req.user.id,
    });

    // Populate the author field on the newly created blog
    // so the response includes author name & email instead of just the ID
    await blog.populate('author', 'name email');

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing blog
 * @route   PUT /api/blogs/:id
 * @access  Private (requires authentication + ownership)
 */
const updateBlog = async (req, res, next) => {
  try {
    // 1. Find the blog by ID
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    // 2. Check ownership — only the author can update their blog
    //    .toString() converts the ObjectId to a string for comparison
    if (blog.author.toString() !== req.user.id) {
      throw new ApiError(403, 'You are not authorized to update this blog');
    }

    // 3. Update the fields
    const { title, content } = req.body;
    if (title) blog.title = title;
    if (content) blog.content = content;

    // 4. Save the updated blog (triggers validation and hooks)
    await blog.save();

    // 5. Populate author data for the response
    await blog.populate('author', 'name email');

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a blog
 * @route   DELETE /api/blogs/:id
 * @access  Private (requires authentication + ownership)
 */
const deleteBlog = async (req, res, next) => {
  try {
    // 1. Find the blog by ID
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      throw new ApiError(404, 'Blog not found');
    }

    // 2. Check ownership — only the author can delete their blog
    if (blog.author.toString() !== req.user.id) {
      throw new ApiError(403, 'You are not authorized to delete this blog');
    }

    // 3. Delete the blog document from MongoDB
    await blog.deleteOne();

    res.status(200).json({
      success: true,
      data: { message: 'Blog deleted successfully' },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBlogs, getBlog, createBlog, updateBlog, deleteBlog };
