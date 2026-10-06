const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  changePassword,
} = require('../controllers/userController');

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

/**
 * GET /api/users/profile
 * Get current user's profile
 */
router.get('/profile', getProfile);

/**
 * PUT /api/users/profile
 * Update current user's profile
 */
router.put('/profile', updateProfile);

/**
 * PUT /api/users/change-password
 * Change user's password
 */
router.put('/change-password', changePassword);

module.exports = router;
