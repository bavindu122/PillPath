import { useState, useContext, createContext, useEffect } from "react";
import ApiService from "../services/api/AuthService";
import { tokenUtils } from "../utils/tokenUtils";

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

  // ✅ Initialize authentication on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUserType = localStorage.getItem("user_type");
    const storedUser = localStorage.getItem("user_data");
    const storedRefresh = localStorage.getItem("refresh_token");

    if (storedToken && storedUserType && storedUser) {
      try {
        setToken(storedToken);
        if (storedRefresh) tokenUtils.setRefreshToken(storedRefresh);
        setUserType(storedUserType);
        setUser(JSON.parse(storedUser));
        console.log("Restored authentication from localStorage:", {
          userType: storedUserType,
          user: JSON.parse(storedUser),
        });
      } catch (error) {
        console.error("Failed to restore authentication:", error);
        // Clear corrupted data
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_type");
        localStorage.removeItem("user_data");
      }
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const userData = await ApiService.getUserProfile();

      const actualUserData = userData.data || userData;
      setUser(actualUserData);
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

      console.log(`Starting ${type} registration with data:`, userData);

      let response;
      if (type === "customer") {
        if (!userData.email || !userData.password) {
          throw new Error("Email and password are required");
        }

        if (!userData.firstName || !userData.lastName) {
          throw new Error("First name and last name are required");
        }

        if (!userData.dateOfBirth) {
          throw new Error("Date of birth is required");
        }

        if (!userData.termsAccepted) {
          throw new Error("You must accept the terms and conditions");
        }

        console.log("Submitting customer registration:", userData);

        try {
          response = await ApiService.registerCustomer(userData);
          console.log("Registration API response:", response);
        } catch (apiError) {
          console.error("Registration API error:", apiError);

          if (
            apiError.message.includes("already exists") ||
            apiError.message.includes("already registered") ||
            apiError.message.includes("email")
          ) {
            throw new Error("This email is already registered");
          }

          throw apiError;
        }

        if (response && response.success) {
          console.log("Registration successful, response:", response);

          const userData = {
            id: response.id,
            username: response.username,
            email: response.email,
            fullName: response.fullName,
            userType: "customer",
          };

          console.log(
            "Setting user data from registration response:",
            userData
          );
          setUser(userData);
          setUserType("customer");
        } else if (response && !response.success) {
          console.error("Registration response indicates failure:", response);
          throw new Error(response.message || "Registration failed");
        } else {
          console.error("Unexpected registration response format:", response);
          throw new Error("Unexpected response format");
        }
      } else if (type === "pharmacy") {
        // ✅ UPDATED: Validate pharmacy registration data including location
        if (!userData.name || !userData.address) {
          throw new Error("Pharmacy name and address are required");
        }

        if (!userData.latitude || !userData.longitude) {
          throw new Error(
            "Pharmacy location (latitude and longitude) is required"
          );
        }

        if (!userData.adminEmail || !userData.adminPassword) {
          throw new Error("Admin email and password are required");
        }

        // ✅ Validate coordinates
        const lat = parseFloat(userData.latitude);
        const lng = parseFloat(userData.longitude);

        if (isNaN(lat) || isNaN(lng)) {
          throw new Error(
            "Valid latitude and longitude coordinates are required"
          );
        }

        if (lat < -90 || lat > 90) {
          throw new Error("Latitude must be between -90 and 90 degrees");
        }

        if (lng < -180 || lng > 180) {
          throw new Error("Longitude must be between -180 and 180 degrees");
        }

        console.log(
          "Submitting pharmacy registration with location:",
          userData
        );

        try {
          response = await ApiService.registerPharmacy(userData);
          console.log("Pharmacy registration API response:", response);
        } catch (apiError) {
          console.error("Pharmacy registration API error:", apiError);

          if (
            apiError.message.includes("already exists") ||
            apiError.message.includes("already registered") ||
            apiError.message.includes("email")
          ) {
            throw new Error("This email is already registered");
          }

          throw apiError;
        }

        if (response && response.success) {
          console.log("Pharmacy registration successful:", response);

          // Handle pharmacy registration response
          const pharmacyUserData = {
            id: response.pharmacyId || response.id,
            username: response.username,
            email: response.email,
            fullName: response.fullName,
            pharmacyName: response.pharmacyName,
            userType: "pharmacy-admin",
          };

          setUser(pharmacyUserData);
          setUserType("pharmacy-admin");
        } else if (response && !response.success) {
          console.error(
            "Pharmacy registration response indicates failure:",
            response
          );
          throw new Error(response.message || "Pharmacy registration failed");
        } else {
          console.error(
            "Unexpected pharmacy registration response format:",
            response
          );
          throw new Error("Unexpected response format");
        }
      }

      return response;
    } catch (error) {
      console.error(`${type} registration failed:`, error);
      setError(error.message || `${type} registration failed`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED: Unified login that handles all user types
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      console.log("=== UNIFIED LOGIN ATTEMPT ===");
      console.log("Credentials:", credentials);

      const response = await ApiService.login(credentials);
      console.log("Login response received:", response);

      if (response && response.success) {
        const {
          accessToken: authToken,
          refreshToken,
          token: altToken,
          userType: backendUserType,
          userProfile,
        } = response;

        // Some backends return "token" as access token or "accessToken"
        const resolvedAuthToken = authToken || altToken;

        console.log("Extracted data:", {
          token: authToken,
          userType: backendUserType,
          userProfile,
        });

        if (resolvedAuthToken && userProfile && backendUserType) {
          // ✅ Map backend userType to frontend userType
          let frontendUserType;
          switch (backendUserType) {
            case "CUSTOMER":
              frontendUserType = "customer";
              break;
            case "PHARMACY_ADMIN":
              frontendUserType = "pharmacy-admin";
              break;
            case "PHARMACIST":
              frontendUserType = "pharmacist";
              break;
            case "ADMIN":
              frontendUserType = "admin";
              break;
            default:
              frontendUserType = "customer";
          }

          // ✅ Set state
          setToken(resolvedAuthToken);
          if (refreshToken) tokenUtils.setRefreshToken(refreshToken);
          tokenUtils.setAuthToken(resolvedAuthToken);
          setUser({
            ...userProfile,
            userType: frontendUserType,
          });
          setUserType(frontendUserType);

          // ✅ Store in localStorage
          localStorage.setItem("auth_token", resolvedAuthToken);
          if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
          localStorage.setItem("user_type", frontendUserType);
          localStorage.setItem(
            "user_data",
            JSON.stringify({
              ...userProfile,
              userType: frontendUserType,
            })
          );

          console.log(`Successfully logged in as ${frontendUserType}`);

          return {
            ...response,
            userType: frontendUserType,
          };
        } else {
          console.error("Missing required data in response");
          throw new Error("Invalid response format - missing required data");
        }
      } else if (response && !response.success) {
        throw new Error(response.message || "Login failed");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Try to call logout API for authenticated users
      if (token || tokenUtils.getRefreshToken()) {
        console.log("Attempting to logout via API (revoke refresh token)...");
        await ApiService.logout();
        console.log("API logout/revoke attempted");
      }
    } catch (error) {
      // Log the error but don't prevent local cleanup
      console.warn(
        "Logout API call failed, proceeding with local cleanup:",
        error.message
      );

      // Check if it's a 403 error which might mean token is already invalid
      if (
        error.message.includes("403") ||
        error.message.includes("Forbidden")
      ) {
        console.log(
          "Token appears to be invalid/expired, clearing local session"
        );
      }
    } finally {
      // Always clear local state and tokens regardless of API call result
      console.log("Clearing local authentication data...");
      setToken(null);
      setUser(null);
      setUserType(null);

      // Clear all possible auth tokens
      tokenUtils.clearAllTokens();

      // Also remove legacy keys if any
      localStorage.removeItem("pharmacy_auth_token");
      localStorage.removeItem("admin_auth_token");
      localStorage.removeItem("user_type");
      localStorage.removeItem("user_data");

      setError(null);
      console.log("Local logout completed successfully");
    }
  };

  const updateUser = (updatedUserData) => {
    const newUserData = {
      ...user,
      ...updatedUserData,
    };

    setUser(newUserData);

    // Update localStorage
    localStorage.setItem("user_data", JSON.stringify(newUserData));
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
    isPharmacist: userType === "pharmacist",
    isAdmin: userType === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
