import { useState, useContext, createContext, useEffect } from "react";
import ApiService from "../services/api/AuthService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Initialize tokens and user type on app start
  useEffect(() => {
    const customerToken = localStorage.getItem("auth_token");
    const adminToken = localStorage.getItem("admin_token");

    if (customerToken) {
      setToken(customerToken);
      setUserType("customer");
      checkAuthStatus("customer");
    } else if (adminToken) {
      setToken(adminToken);
      setUserType("pharmacy-admin");
      checkAuthStatus("pharmacy-admin");
    }
  }, []);

  const checkAuthStatus = async (type = userType) => {
    try {
      setLoading(true);
      const userData = await ApiService.getProfile(type);

      // Handle nested response structure
      const actualUserData = userData.data || userData;
      setUser({
        ...actualUserData,
        userType: type,
      });
    } catch (error) {
      console.error("Auth check failed:", error);
      if (
        error.message.includes("Unauthorized") ||
        error.message.includes("Invalid")
      ) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, type = "customer") => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (type === "customer") {
        response = await ApiService.registerCustomer(userData);

        // Handle backend response format
        if (response && response.success) {
          // Extract nested data
          const responseData = response.data || response;
          const tokenData = responseData.token || response.token;
          const userData =
            responseData.user ||
            response.user ||
            responseData.customer ||
            response.customer;

          if (tokenData) {
            setToken(tokenData);
            setUser({
              ...userData,
              userType: "customer",
            });
            setUserType("customer");
            localStorage.setItem("auth_token", tokenData);
          }
        } else if (response && !response.success) {
          throw new Error(response.message || "Registration failed");
        }
      } else if (type === "pharmacy") {
        response = await ApiService.registerPharmacy(userData);
        // Don't set token/user for pharmacy - they need admin approval
      }

      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ...existing code...

  const login = async (credentials, type = "customer") => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Enhanced debugging
      console.log("=== LOGIN ATTEMPT ===");
      console.log("Received type parameter:", type);
      console.log("Credentials:", credentials);

      const response = await ApiService.login(credentials, type);
      console.log("Login response received:", response);

      // ✅ Handle nested backend login response format
      if (response && response.success) {
        // Extract nested data - your backend returns data nested in "data" object
        const responseData = response.data || response;
        const tokenData = responseData.token || response.token;
        const userData = responseData.user || response.user;

        console.log("Extracted token:", tokenData);
        console.log("Extracted user data:", userData);
        console.log("Login type being processed:", type);

        if (tokenData && userData) {
          setToken(tokenData);
          setUser({
            ...userData,
            userType: type,
          });
          setUserType(type);

          // Store token in appropriate localStorage key
          if (type === "pharmacy-admin") {
            console.log("Storing admin token");
            localStorage.setItem("admin_token", tokenData);
            // Clear customer token if exists
            localStorage.removeItem("auth_token");
          } else {
            console.log("Storing customer token");
            localStorage.setItem("auth_token", tokenData);
            // Clear admin token if exists
            localStorage.removeItem("admin_token");
          }

          console.log(`Successfully logged in as ${type}`);
        } else {
          console.error("Missing token or user data in response");
          throw new Error(
            "Invalid response format - missing token or user data"
          );
        }
      } else if (response && !response.success) {
        throw new Error(response.message || "Login failed");
      } else {
        throw new Error("Invalid response format");
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ...rest of existing code...
  const logout = async () => {
    try {
      // Call logout API if user is logged in
      if (userType) {
        await ApiService.logout(userType);
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
      // Continue with local logout even if API fails
    } finally {
      // Clear all local state and tokens
      setToken(null);
      setUser(null);
      setUserType(null);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_data");
      setError(null);
    }
  };

  // ✅ Update user method
  const updateUser = (updatedUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUserData,
    }));
  };

  const value = {
    user,
    token,
    userType,
    loading,
    error,
    register,
    login,
    logout,
    updateUser,
    checkAuthStatus,
    isAuthenticated: !!token,
    isCustomer: userType === "customer",
    isPharmacyAdmin: userType === "pharmacy-admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
