const { pool } = require('../config/database');

/**
 * Get all notifications for current user
 * GET /api/notifications
 */
const getNotifications = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.user.id;
    const { is_read, page = 1, limit = 10 } = req.query;

    let query = `
      SELECT n.id, n.user_id, n.request_id, n.message, n.is_read, n.created_at,
             sr.title as request_title, sr.status as request_status
      FROM notifications n
      LEFT JOIN support_requests sr ON n.request_id = sr.id
      WHERE n.user_id = ?
    `;
    const params = [userId];

    // Filter by read status if provided
    if (is_read !== undefined) {
      query += ' AND n.is_read = ?';
      params.push(is_read === 'true' || is_read === 1);
    }

    // Add pagination
    const offset = (page - 1) * limit;
    query += ` ORDER BY n.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const [notifications] = await connection.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM notifications WHERE user_id = ?';
    const countParams = [userId];

    if (is_read !== undefined) {
      countQuery += ' AND is_read = ?';
      countParams.push(is_read === 'true' || is_read === 1);
    }

    const [countResult] = await connection.query(countQuery, countParams);
    const total = countResult[0].total;

    return res.status(200).json({
      success: true,
      notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications',
    });
  } finally {
    connection.release();
  }
};

/**
 * Mark notification as read
 * PUT /api/notifications/:id/read
 */
const markAsRead = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    // Check if notification belongs to user
    const [notifications] = await connection.query(
      'SELECT * FROM notifications WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );

    if (notifications.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    // Mark as read
    await connection.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = ?',
      [notificationId]
    );

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
    });
  } finally {
    connection.release();
  }
};

/**
 * Mark all notifications as read for current user
 * PUT /api/notifications/read-all
 */
const markAllAsRead = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.user.id;

    const [result] = await connection.query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      affectedRows: result.affectedRows,
    });

  } catch (error) {
    console.error('Mark all as read error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as read',
    });
  } finally {
    connection.release();
  }
};

/**
 * Get unread notification count for current user
 * GET /api/notifications/unread-count
 */
const getUnreadCount = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.user.id;

    const [result] = await connection.query(
      'SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );

    return res.status(200).json({
      success: true,
      unread_count: result[0].unread_count,
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
};
