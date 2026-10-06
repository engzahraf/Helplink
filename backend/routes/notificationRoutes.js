const express = require('express');
const { authenticate } = require('../middleware/auth');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} = require('../controllers/notificationController');

const router = express.Router();

// All notification routes require authentication
router.use(authenticate);

/**
 * GET /api/notifications
 * Get all notifications for current user
 */
router.get('/', getNotifications);

/**
 * GET /api/notifications/unread-count
 * Get unread notification count
 * NOTE: This must be before /:id route to avoid conflict
 */
router.get('/unread-count', getUnreadCount);

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read
 * NOTE: This must be before /:id route to avoid conflict
 */
router.put('/read-all', markAllAsRead);

/**
 * PUT /api/notifications/:id/read
 * Mark a specific notification as read
 */
router.put('/:id/read', markAsRead);

module.exports = router;
