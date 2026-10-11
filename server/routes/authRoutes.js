/**
 * Auth Routes
 * -----------
 * Defines the API endpoints for user authentication.
 *
 * Route structure:
 *   POST /api/auth/register  → Create a new account
 *   POST /api/auth/login     → Login and get a JWT token
 *
 * These routes are PUBLIC — no authentication required.
 */

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST /api/auth/register — Register a new user
router.post('/register', register);

// POST /api/auth/login — Login an existing user
router.post('/login', login);

module.exports = router;
