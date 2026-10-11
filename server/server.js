/**
 * Server Entry Point
 * ------------------
 * This is the main file that bootstraps the Express application.
 *
 * Startup sequence:
 *   1. Load environment variables from .env
 *   2. Import dependencies and modules
 *   3. Create the Express app and configure middleware
 *   4. Mount the API routes
 *   5. Attach the global error handler (must be AFTER routes)
 *   6. Connect to MongoDB, then start listening for requests
 *
 * Why error handler goes AFTER routes:
 *   Express processes middleware in order. The error handler needs
 *   to catch errors thrown by our route handlers, so it must be
 *   registered after them.
 */

// 1. Load environment variables FIRST — before any other imports
//    that might need process.env values
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Import our modules
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const errorHandler = require('./middleware/errorHandler');

// 2. Create the Express application
const app = express();

// 3. Global Middleware
// --------------------
// cors() — Allows requests from other origins (e.g., React frontend on port 3000)
app.use(cors());

// express.json() — Parses incoming JSON request bodies
// Without this, req.body would be undefined for POST/PUT requests
app.use(express.json());

// 4. Mount API Routes
// --------------------
// All auth-related routes will be prefixed with /api/auth
app.use('/api/auth', authRoutes);

// All blog-related routes will be prefixed with /api/blogs
app.use('/api/blogs', blogRoutes);

// 5. Global Error Handler (MUST be after routes)
// ------------------------------------------------
app.use(errorHandler);

// 6. Connect to Database and Start Server
// -----------------------------------------
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
