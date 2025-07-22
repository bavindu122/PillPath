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
  const [token, setToken] = useState(localStorage.getItem("auth_token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    if (token) {
      checkAuthStatus();
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const userData = await ApiService.getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error("Auth check failed:", error);
      const errorCode = error.code || mapErrorMessageToCode(error.message);
      if (errorCode === "INVALID_CREDENTIALS" || errorCode === "UNAUTHORIZED") {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, userType) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (userType === "customer") {
        response = await ApiService.registerCustomer(userData);

        // ✅ Handle backend response format
        if (response && response.success) {
          // If backend returns token immediately upon registration
          if (response.token) {
            setToken(response.token);
            setUser({
              ...response.user || response.customer,
              userType: 'customer'
            });
            localStorage.setItem("auth_token", response.token);
          }
        } else if (response && !response.success) {
          // Handle registration failure
          throw new Error(response.message || "Registration failed");
        }
      } else if (userType === "pharmacy") {
        // ✅ For pharmacies, just register (no immediate login)
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

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ApiService.login(credentials);

      // ✅ Handle backend login response format
      if (response && response.success) {
        if (response.token) {
          setToken(response.token);
          setUser({
            ...response.user || response.customer,
            userType: 'customer'
          });
          localStorage.setItem("auth_token", response.token);
        }
      } else if (response && !response.success) {
        throw new Error(response.message || "Login failed");
      }

      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    setError(null);
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
    loading,
    error,
    register,
    login,
    logout,
    updateUser,
    checkAuthStatus,
    isAuthenticated: !!token,
    userType: user?.userType || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};