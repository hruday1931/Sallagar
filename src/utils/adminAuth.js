// Admin Authentication Helper Utility
// This utility provides simple admin authorization checks using localStorage

/**
 * Check if the current user is an admin
 * @returns {boolean} - True if user is admin, false otherwise
 */
export const isAdmin = () => {
  const token = localStorage.getItem('is_admin');
  // Strict check: only true if token is exactly the string 'true'
  // This prevents null, undefined, 'null', or any other value from being truthy
  return token === 'true';
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
 * @param {string} dbPassword - The admin password from database (optional)
 * @returns {boolean} - True if login successful, false otherwise
 */
export const adminLogin = (password, dbPassword = null) => {
  // Use database password if provided, otherwise fallback to environment variable
  const ADMIN_PASSWORD = dbPassword || import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'; // Fallback for local development
  
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
