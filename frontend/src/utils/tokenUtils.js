export const tokenUtils = {
  // Access token (short-lived)
  getAuthToken: () => localStorage.getItem("auth_token"),
  setAuthToken: (token) => localStorage.setItem("auth_token", token),
  removeAuthToken: () => localStorage.removeItem("auth_token"),

  // Refresh token (long-lived)
  getRefreshToken: () => localStorage.getItem("refresh_token"),
  setRefreshToken: (token) => localStorage.setItem("refresh_token", token),
  removeRefreshToken: () => localStorage.removeItem("refresh_token"),

  // Admin tokens (optional)
  getAdminToken: () => localStorage.getItem("admin_token"),
  setAdminToken: (token) => localStorage.setItem("admin_token", token),
  removeAdminToken: () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_data");
  },

  // Clear all tokens and stored auth data
  clearAllTokens: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_data");
    localStorage.removeItem("user_data");
    localStorage.removeItem("user_type");
  },

  // Check authentication state
  isCustomerAuthenticated: () => !!localStorage.getItem("auth_token"),
  isAdminAuthenticated: () => !!localStorage.getItem("admin_token"),

  // Authorization headers
  getAuthHeaders: () => {
    const token = tokenUtils.getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  getAdminAuthHeaders: () => {
    const token = tokenUtils.getAdminToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
