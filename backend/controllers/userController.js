const bcrypt = require('bcrypt');
const { pool } = require('../config/database');
const { validateEmail, validatePassword } = require('../utils/validators');

/**
 * Get user profile
 * GET /api/users/profile
 */
const getProfile = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.user.id;

    const [users] = await connection.query(
      'SELECT id, username, name, email, role, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user: users[0],
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
    });
  } finally {
    connection.release();
  }
};

/**
 * Update user profile
 * PUT /api/users/profile
 * Only name and email can be updated, not role
 */
const updateProfile = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    // Validation
    if (!name && !email) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (name or email) is required for update',
      });
    }

    if (email && !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Get current user
    const [currentUsers] = await connection.query(
      'SELECT id, email FROM users WHERE id = ?',
      [userId]
    );

    if (currentUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // If email is being changed, check if new email already exists
    if (email && email !== currentUsers[0].email) {
      const [existingEmails] = await connection.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingEmails.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Email already in use',
        });
      }
    }

    // Build update query
    const updates = [];
    const params = [];

    if (name) {
      updates.push('name = ?');
      params.push(name);
    }
    if (email) {
      updates.push('email = ?');
      params.push(email);
    }

    params.push(userId);

    const updateQuery = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    await connection.query(updateQuery, params);

    // Return updated profile
    const [updatedUsers] = await connection.query(
      'SELECT id, username, name, email, role, created_at FROM users WHERE id = ?',
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUsers[0],
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  } finally {
    connection.release();
  }
};

/**
 * Change password
 * PUT /api/users/change-password
 */
const changePassword = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password, new password, and confirmation are required',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirmation do not match',
      });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password',
      });
    }

    // Get current user
    const [users] = await connection.query(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, users[0].password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await connection.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });

  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to change password',
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};
