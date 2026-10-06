const { pool } = require('../config/database');

const VALID_CATEGORIES = ['Academic', 'Technical', 'Administrative', 'Financial', 'Accommodation', 'Other'];
const VALID_PRIORITIES = ['Low', 'Medium', 'High'];
const VALID_STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

/**
 * Create a new support request
 * POST /api/support-requests
 */
const createRequest = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const studentId = req.user.id;
    const { title, description, category, priority } = req.body;

    // Validation
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required',
      });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
      });
    }

    const finalPriority = priority && VALID_PRIORITIES.includes(priority) ? priority : 'Medium';

    // Insert support request
    const [result] = await connection.query(
      'INSERT INTO support_requests (student_id, title, description, category, priority, status) VALUES (?, ?, ?, ?, ?, ?)',
      [studentId, title, description, category, finalPriority, 'Pending']
    );

    const requestId = result.insertId;

    // Create notification for student
    await connection.query(
      'INSERT INTO notifications (user_id, request_id, message, is_read) VALUES (?, ?, ?, ?)',
      [studentId, requestId, 'Your support request has been created and is pending review', false]
    );

    return res.status(201).json({
      success: true,
      message: 'Support request created successfully',
      request: {
        id: requestId,
        title,
        description,
        category,
        priority: finalPriority,
        status: 'Pending',
      },
    });

  } catch (error) {
    console.error('Create request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create support request',
    });
  } finally {
    connection.release();
  }
};

/**
 * Get all support requests (admin) or own requests (student)
 * GET /api/support-requests
 */
const getRequests = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { status, category, priority, page = 1, limit = 10 } = req.query;

    let query = `
      SELECT sr.id, sr.student_id, sr.title, sr.description, sr.category, sr.priority, sr.status, sr.admin_response, sr.created_at, sr.updated_at,
             u.name as student_name, u.email as student_email
      FROM support_requests sr
      JOIN users u ON sr.student_id = u.id
    `;
    const params = [];

    // Add role-based filtering
    if (userRole === 'student') {
      query += ' WHERE sr.student_id = ?';
      params.push(userId);
    }

    // Add status filter
    if (status && VALID_STATUSES.includes(status)) {
      query += userRole === 'student' ? ' AND' : ' WHERE';
      query += ' sr.status = ?';
      params.push(status);
    }

    // Add category filter
    if (category && VALID_CATEGORIES.includes(category)) {
      query += (params.length > 0) ? ' AND' : ' WHERE';
      query += ' sr.category = ?';
      params.push(category);
    }

    // Add priority filter
    if (priority && VALID_PRIORITIES.includes(priority)) {
      query += (params.length > 0) ? ' AND' : ' WHERE';
      query += ' sr.priority = ?';
      params.push(priority);
    }

    // Add pagination
    const offset = (page - 1) * limit;
    query += ` ORDER BY sr.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const [requests] = await connection.query(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM support_requests sr';
    const countParams = [];

    if (userRole === 'student') {
      countQuery += ' WHERE sr.student_id = ?';
      countParams.push(userId);
    }

    const [countResult] = await connection.query(countQuery, countParams);
    const total = countResult[0].total;

    return res.status(200).json({
      success: true,
      requests,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Get requests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve support requests',
    });
  } finally {
    connection.release();
  }
};

/**
 * Get a specific support request
 * GET /api/support-requests/:id
 */
const getRequestById = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const requestId = req.params.id;

    const [requests] = await connection.query(
      `SELECT sr.id, sr.student_id, sr.title, sr.description, sr.category, sr.priority, sr.status, sr.admin_response, sr.created_at, sr.updated_at,
              u.name as student_name, u.email as student_email
       FROM support_requests sr
       JOIN users u ON sr.student_id = u.id
       WHERE sr.id = ?`,
      [requestId]
    );

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Support request not found',
      });
    }

    const request = requests[0];

    // Students can only access their own requests
    if (userRole === 'student' && request.student_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden',
      });
    }

    return res.status(200).json({
      success: true,
      request,
    });

  } catch (error) {
    console.error('Get request by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve support request',
    });
  } finally {
    connection.release();
  }
};

/**
 * Update support request (students can edit pending requests, admins can change status/response)
 * PUT /api/support-requests/:id
 */
const updateRequest = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const requestId = req.params.id;
    const { title, description, category, priority, status, admin_response } = req.body;

    // Get the request
    const [requests] = await connection.query(
      'SELECT * FROM support_requests WHERE id = ?',
      [requestId]
    );

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Support request not found',
      });
    }

    const request = requests[0];

    // Students can only edit their own pending requests
    if (userRole === 'student') {
      if (request.student_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access forbidden',
        });
      }

      if (request.status !== 'Pending') {
        return res.status(400).json({
          success: false,
          message: 'Cannot edit requests that are not pending',
        });
      }

      // Students can only update title, description, category, and priority
      const updates = [];
      const params = [];

      if (title !== undefined) {
        updates.push('title = ?');
        params.push(title);
      }
      if (description !== undefined) {
        updates.push('description = ?');
        params.push(description);
      }
      if (category && VALID_CATEGORIES.includes(category)) {
        updates.push('category = ?');
        params.push(category);
      }
      if (priority && VALID_PRIORITIES.includes(priority)) {
        updates.push('priority = ?');
        params.push(priority);
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid fields to update',
        });
      }

      params.push(requestId);
      const updateQuery = `UPDATE support_requests SET ${updates.join(', ')} WHERE id = ?`;
      await connection.query(updateQuery, params);

    } else if (userRole === 'admin') {
      // Admins can update status and response
      const updates = [];
      const params = [];

      if (status && VALID_STATUSES.includes(status)) {
        updates.push('status = ?');
        params.push(status);
      }
      if (admin_response !== undefined) {
        updates.push('admin_response = ?');
        params.push(admin_response);
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid fields to update',
        });
      }

      params.push(requestId);
      const updateQuery = `UPDATE support_requests SET ${updates.join(', ')} WHERE id = ?`;
      await connection.query(updateQuery, params);

      // Create notification for student
      const notificationMessage = `Your support request has been updated. Status: ${status || request.status}`;
      await connection.query(
        'INSERT INTO notifications (user_id, request_id, message, is_read) VALUES (?, ?, ?, ?)',
        [request.student_id, requestId, notificationMessage, false]
      );
    }

    // Return updated request
    const [updatedRequests] = await connection.query(
      'SELECT * FROM support_requests WHERE id = ?',
      [requestId]
    );

    return res.status(200).json({
      success: true,
      message: 'Support request updated successfully',
      request: updatedRequests[0],
    });

  } catch (error) {
    console.error('Update request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update support request',
    });
  } finally {
    connection.release();
  }
};

/**
 * Delete/Cancel support request (students can delete pending requests only)
 * DELETE /api/support-requests/:id
 */
const deleteRequest = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const requestId = req.params.id;

    const [requests] = await connection.query(
      'SELECT * FROM support_requests WHERE id = ?',
      [requestId]
    );

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Support request not found',
      });
    }

    const request = requests[0];

    // Only students can delete their own pending requests
    if (userRole !== 'student' || request.student_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden',
      });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only delete pending support requests',
      });
    }

    // Delete the request (cascade will handle notifications)
    await connection.query(
      'DELETE FROM support_requests WHERE id = ?',
      [requestId]
    );

    return res.status(200).json({
      success: true,
      message: 'Support request deleted successfully',
    });

  } catch (error) {
    console.error('Delete request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete support request',
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
};
