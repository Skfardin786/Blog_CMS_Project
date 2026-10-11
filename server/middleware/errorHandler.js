/**
 * Global Error Handling Middleware
 * --------------------------------
 * Express recognises a middleware with 4 parameters (err, req, res, next)
 * as an error handler. This middleware catches ALL errors thrown or passed
 * via next(error) in the app.
 *
 * How it works:
 *   1. If the error is an instance of our custom ApiError, use its statusCode.
 *   2. Otherwise, default to 500 (Internal Server Error).
 *   3. Always respond with a consistent JSON shape.
 *   4. In development mode, include the stack trace for debugging.
 */

const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  // If it's our custom ApiError, use its status code; otherwise default to 500
  const statusCode = err instanceof ApiError ? err.statusCode : 500;

  // Log the error to the server console for debugging
  console.error(`❌ Error: ${err.message}`);

  // Build the response object
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  // In development, include the stack trace so we can debug easily.
  // In production, we hide it to avoid leaking implementation details.
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
