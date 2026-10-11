/**
 * Auth Controller
 * ---------------
 * Handles user registration and login.
 *
 * Authentication flow:
 *   1. User registers with name, email, and password.
 *   2. Password is hashed automatically by the User model's pre-save hook.
 *   3. A JWT token is generated and returned to the client.
 *   4. The client stores this token and sends it with every request
 *      in the Authorization header to access protected routes.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Helper: Generate a JWT token
 * ----------------------------
 * jwt.sign(payload, secret, options)
 *   - payload: data to encode (we use the user's MongoDB _id)
 *   - secret: the key used to sign the token (from .env)
 *   - expiresIn: how long the token is valid (7 days here)
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate that all required fields are present
    if (!name || !email || !password) {
      throw new ApiError(400, 'Please provide name, email, and password');
    }

    // 2. Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'A user with this email already exists');
    }

    // 3. Create the user (password is hashed automatically by the pre-save hook)
    const user = await User.create({ name, email, password });

    // 4. Generate a JWT token for the new user
    const token = generateToken(user._id);

    // 5. Send back the token and user info (excluding password)
    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error); // Pass error to the global error handler
  }
};

/**
 * @desc    Login an existing user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate that email and password are provided
    if (!email || !password) {
      throw new ApiError(400, 'Please provide email and password');
    }

    // 2. Find the user and explicitly include the password field
    //    (it's excluded by default because of `select: false` in the schema)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // 3. Compare the provided password with the stored hash
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // 4. Generate a JWT token
    const token = generateToken(user._id);

    // 5. Send back the token and user info
    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
