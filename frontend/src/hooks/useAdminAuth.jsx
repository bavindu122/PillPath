import { useState, useContext, createContext, useEffect } from "react";
import AdminService from "../services/api/AdminService";

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("admin_token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if admin is logged in on app start
  useEffect(() => {
    if (token) {
      checkAuthStatus();
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const adminData = await AdminService.getAdminProfile();
      setAdmin(adminData);
    } catch (error) {
      console.error("Admin auth check failed:", error);
      if (
        error.message.includes("Invalid credentials") ||
        error.message.includes("401") ||
        error.message.includes("Unauthorized")
      ) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await AdminService.login(credentials);

      // ✅ Handle backend admin login response format
      if (response && response.success) {
        if (response.token) {
          setToken(response.token);
          
          // Create admin object from response
          const adminData = {
            id: response.adminId,
            username: credentials.username, // Use from credentials since backend might not return it
            adminLevel: response.adminLevel,
            isAuthenticated: true,
            userType: 'admin'
          };
          
          setAdmin(adminData);
          localStorage.setItem("admin_token", response.token);
          localStorage.setItem("admin_data", JSON.stringify(adminData));
        }
      } else if (response && !response.success) {
        throw new Error(response.message || "Admin login failed");
      }

      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint if available
      if (token) {
        await AdminService.logout();
      }
    } catch (error) {
      console.error("Admin logout error:", error);
    } finally {
      // Clear local state regardless of API call success
      setToken(null);
      setAdmin(null);
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_data");
      setError(null);
    }
  };

  // ✅ Update admin method
  const updateAdmin = (updatedAdminData) => {
    setAdmin((prevAdmin) => ({
      ...prevAdmin,
      ...updatedAdminData,
    }));
  };

  const value = {
    admin,
    token,
    loading,
    error,
    login,
    logout,
    updateAdmin,
    checkAuthStatus,
    isAuthenticated: !!token && !!admin,
    isAdmin: true, // Distinguishing flag
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};