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
  // Start loading as true so we don't redirect before hydrating admin state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if admin is logged in on app start
  // Check if admin is logged in on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        if (token) {
          // ✅ First check if we have stored admin data
          const storedAdminData = localStorage.getItem("admin_data");
          if (storedAdminData) {
            try {
              const adminData = JSON.parse(storedAdminData);
              console.log("Loading stored admin data:", adminData);
              setAdmin(adminData);
              return; // Skip API call if we have valid stored data
            } catch (error) {
              console.error("Error parsing stored admin data:", error);
            }
          }

          // ✅ If no stored data, hydrate minimal admin from token and attempt API (non-blocking)
          setAdmin(
            (prev) =>
              prev || {
                id: undefined,
                username: "admin",
                adminLevel: "ADMIN",
                isAuthenticated: true,
                userType: "admin",
              }
          );
          await checkAuthStatus();
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  const checkAuthStatus = async () => {
    try {
      const adminData = await AdminService.getAdminProfile();
      console.log("Fetched admin profile:", adminData);
      setAdmin(adminData);
    } catch (error) {
      console.error("Admin auth check failed:", error);
      if (
        error.message?.includes?.("Invalid credentials") ||
        error.message?.includes?.("401") ||
        error.message?.includes?.("Unauthorized")
      ) {
        logout();
      }
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await AdminService.login(credentials);

      console.log("Admin login response:", response);

      // ✅ Handle backend admin login response format
      if (response && response.success) {
        // ✅ Create a mock token if backend doesn't provide one
        const token =
          response.token || `admin_token_${Date.now()}_${response.adminId}`;

        setToken(token);

        // Create admin object from response
        const adminData = {
          id: response.adminId,
          username: credentials.username,
          adminLevel: response.adminLevel,
          isAuthenticated: true,
          userType: "admin",
        };

        setAdmin(adminData);
        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_data", JSON.stringify(adminData));

        console.log("Admin login successful, data stored:", {
          token,
          adminData,
        });
        return response;
      } else {
        throw new Error(response?.message || "Admin login failed");
      }
    } catch (error) {
      console.error("Admin login error:", error);
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
