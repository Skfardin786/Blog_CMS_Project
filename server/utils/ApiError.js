/**
 * Custom API Error Class
 * ----------------------
 * Extends the built-in Error class to include an HTTP status code.
 * This lets us throw meaningful errors in our controllers
 * (e.g., `throw new ApiError(404, 'Blog not found')`)
 * and have our error-handling middleware send the right response.
 *
 * Why a custom class?
 *   - The default Error only has a `message` property.
 *   - We need a `statusCode` so the error handler knows
 *     what HTTP status to return (400, 401, 404, etc.).
 */

class ApiError extends Error {
  constructor(statusCode, message) {
    // Call the parent Error constructor with the message
    super(message);

    this.statusCode = statusCode;

    // Preserve the class name in stack traces for easier debugging
    this.name = this.constructor.name;

    // Captures a clean stack trace, excluding the constructor call itself
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
