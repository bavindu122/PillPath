/**
 * Authentication API functions for password reset and other auth operations
 */
import AuthService from "./AuthService";

/**
 * Request a password reset link
 * @param {string} email - User's email address
 */
export const requestPasswordReset = async (email) => {
  return AuthService.requestPasswordReset(email);
};

/**
 * Verify a password reset token
 * @param {string} token - Reset token from email
 */
export const verifyResetToken = async (token) => {
  return AuthService.verifyResetToken(token);
};

/**
 * Reset password using token
 * @param {Object} resetData - Contains token, newPassword, confirmPassword
 */
export const resetPassword = async (resetData) => {
  return AuthService.resetPassword(resetData);
};

/**
 * User login
 * @param {Object} credentials - Contains email and password
 */
export const login = async (credentials) => {
  return AuthService.login(credentials);
};

/**
 * User logout
 */
export const logout = async () => {
  return AuthService.logout();
};

/**
 * Register customer
 * @param {Object} userData - Customer registration data
 */
export const registerCustomer = async (userData) => {
  return AuthService.registerCustomer(userData);
};

/**
 * Register pharmacy
 * @param {Object} pharmacyData - Pharmacy registration data
 */
export const registerPharmacy = async (pharmacyData) => {
  return AuthService.registerPharmacy(pharmacyData);
};
