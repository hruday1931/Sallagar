// Admin Authentication Helper Utility
// This utility provides simple admin authorization checks using localStorage

/**
 * Check if the current user is an admin
 * @returns {boolean} - True if user is admin, false otherwise
 */
export const isAdmin = () => {
  return localStorage.getItem('is_admin') === 'true';
};

/**
 * Set admin status in localStorage
 * @param {boolean} status - The admin status to set
 */
export const setAdminStatus = (status) => {
  localStorage.setItem('is_admin', status ? 'true' : 'false');
};

/**
 * Clear admin status from localStorage
 */
export const clearAdminStatus = () => {
  localStorage.removeItem('is_admin');
};

/**
 * Simple admin login function
 * In a production environment, this should be replaced with proper authentication
 * @param {string} password - The admin password
 * @returns {boolean} - True if login successful, false otherwise
 */
export const adminLogin = (password) => {
  // Simple password check - in production, use proper authentication
  const ADMIN_PASSWORD = 'admin123'; // Change this to a secure password
  
  if (password === ADMIN_PASSWORD) {
    setAdminStatus(true);
    return true;
  }
  
  return false;
};

/**
 * Admin logout function
 */
export const adminLogout = () => {
  clearAdminStatus();
};
