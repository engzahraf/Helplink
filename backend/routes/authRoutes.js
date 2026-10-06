const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new student account
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Login user (student or admin)
 */
router.post('/login', login);

module.exports = router;
