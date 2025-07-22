export const tokenUtils = {
  // Get customer auth token
  getAuthToken: () => localStorage.getItem('auth_token'),
  
  // Get admin auth token
  getAdminToken: () => localStorage.getItem('admin_token'),
  
  // Set customer auth token
  setAuthToken: (token) => localStorage.setItem('auth_token', token),
  
  // Set admin auth token
  setAdminToken: (token) => localStorage.setItem('admin_token', token),
  
  // Remove customer auth token
  removeAuthToken: () => localStorage.removeItem('auth_token'),
  
  // Remove admin auth token
  removeAdminToken: () => localStorage.removeItem('admin_token'),
  
  // Clear all tokens
  clearAllTokens: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
  },
  
  // Check if customer is authenticated
  isCustomerAuthenticated: () => !!localStorage.getItem('auth_token'),
  
  // Check if admin is authenticated
  isAdminAuthenticated: () => !!localStorage.getItem('admin_token'),
  
  // Get authorization header for customer
  getAuthHeaders: () => {
    const token = tokenUtils.getAuthToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },
  
  // Get authorization header for admin
  getAdminAuthHeaders: () => {
    const token = tokenUtils.getAdminToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};