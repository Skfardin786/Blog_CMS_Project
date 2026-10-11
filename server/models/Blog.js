/**
 * Blog Model
 * ----------
 * Defines the schema for blog post documents stored in MongoDB.
 *
 * Key concepts demonstrated:
 *   - Mongoose ObjectId references (linking blogs to users)
 *   - The `ref` option enables Mongoose's `.populate()` to replace
 *     the ObjectId with the actual user document data
 *   - Content field stores markdown text that the frontend can render
 */

const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
      // This stores markdown content — the frontend will render it as HTML
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the User model — enables populate()
      required: [true, 'Blog must have an author'],
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
