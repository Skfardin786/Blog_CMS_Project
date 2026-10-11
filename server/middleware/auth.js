/**
 * Authentication Middleware (JWT)
 * --------------------------------
 * This middleware protects routes that require a logged-in user.
 *
 * How JWT auth works:
 *   1. The client sends a token in the Authorization header:
 *      "Authorization: Bearer <token>"
 *   2. We extract the token, verify it with our secret key.
 *   3. If valid, we attach the decoded payload (user id) to `req.user`
 *      so downstream controllers know which user is making the request.
 *   4. If the token is missing or invalid, we reject with 401 Unauthorized.
 */

const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

const protect = (req, res, next) => {
  try {
    // 1. Get the Authorization header
    const authHeader = req.headers.authorization;

    // 2. Check that the header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access denied. No token provided.');
    }

    // 3. Extract the token (everything after "Bearer ")
    const token = authHeader.split(' ')[1];

    // 4. Verify the token using our secret key
    //    jwt.verify() throws an error if the token is expired or tampered with
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach the user's id from the token payload to the request object
    //    This makes req.user.id available in all protected route handlers
    req.user = { id: decoded.id };

    // 6. Move to the next middleware / route handler
    next();
  } catch (error) {
    // If jwt.verify throws (expired, malformed, etc.), catch it here
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(401, 'Invalid or expired token.'));
    }
  }
};

module.exports = protect;
