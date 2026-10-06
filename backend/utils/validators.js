/**
 * Validate email format
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Minimum 6 characters
 */
const validatePassword = (password) => {
  return password && password.length >= 6;
};

module.exports = {
  validateEmail,
  validatePassword,
};
