const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
} = require('../controllers/supportRequestController');

const router = express.Router();

// All support request routes require authentication
router.use(authenticate);

/**
 * POST /api/support-requests
 * Create a new support request (students only)
 */
router.post('/', authorize('student'), createRequest);

/**
 * GET /api/support-requests
 * Get support requests (students see own, admins see all)
 */
router.get('/', getRequests);

/**
 * GET /api/support-requests/:id
 * Get a specific support request
 */
router.get('/:id', getRequestById);

/**
 * PUT /api/support-requests/:id
 * Update support request
 * Students can edit pending requests (title, description, category, priority)
 * Admins can change status and add response
 */
router.put('/:id', updateRequest);

/**
 * DELETE /api/support-requests/:id
 * Delete/cancel a support request (students can delete pending requests only)
 */
router.delete('/:id', deleteRequest);

module.exports = router;
