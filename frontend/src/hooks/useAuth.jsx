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
    const pharmacistToken = localStorage.getItem("pharmacist_token");

    if (customerToken) {
      setToken(customerToken);
      setUserType("customer");
      checkAuthStatus("customer");
    } else if (adminToken) {
      setToken(adminToken);
      setUserType("pharmacy-admin");
      checkAuthStatus("pharmacy-admin");
    } else if (pharmacistToken) {
      setToken(pharmacistToken);
      setUserType("pharmacist");
      checkAuthStatus("pharmacist");
    }
  }, []);

  const checkAuthStatus = async (type = userType) => {
    try {
      setLoading(true);

      // ✅ Check for hardcoded users in localStorage
      if (type === "pharmacy-admin" || type === "pharmacist") {
        const storageKey = `${type}_data`;
        const userData = JSON.parse(localStorage.getItem(storageKey));

        if (userData) {
          console.log(`Found hardcoded ${type} data:`, userData);
          setUser({
            ...userData,
            userType: type,
          });
          return;
        }
      }

      // For customers, proceed with normal API call
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

  // ✅ NEW: Set hardcoded user for pharmacy admin and pharmacist
  const setHardcodedUser = async (userData, type) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Setting hardcoded ${type}:`, userData);

      // Generate a fake token
      const fakeToken = `hardcoded-token-${type}-${Date.now()}`;

      // Set the user data
      setUser({
        ...userData,
        userType: type,
      });

      // Set token and user type
      setToken(fakeToken);
      setUserType(type);

      // Store in localStorage
      const storageKey =
        type === "pharmacy-admin" ? "admin_token" : "pharmacist_token";
      localStorage.setItem(storageKey, fakeToken);
      localStorage.setItem(`${type}_data`, JSON.stringify(userData));

      console.log(`Successfully set hardcoded ${type}`);
      return { success: true, message: `Logged in as ${type}` };
    } catch (error) {
      console.error("Hardcoded login error:", error);
      setError(error.message);
      throw error;
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
        // ✅ FIXED: Validate the actual form data, not response data
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

          // ✅ Handle common registration errors
          if (
            apiError.message.includes("already exists") ||
            apiError.message.includes("already registered") ||
            apiError.message.includes("email")
          ) {
            throw new Error("This email is already registered");
          }

          throw apiError;
        }

        // ✅ Handle CustomerRegistrationResponse format
        if (response && response.success) {
          console.log("Registration successful, response:", response);

          // ✅ The backend returns: { id, username, email, fullName, message, success }
          const userData = {
            id: response.id,
            username: response.username,
            email: response.email,
            fullName: response.fullName,
            userType: "customer",
          };

          console.log("Setting user data from registration response:", userData);

          // ✅ Set user but not token (user needs to login separately)
          setUser(userData);
          setUserType("customer");

          // Don't set token - user will need to login after registration
        } else if (response && !response.success) {
          console.error("Registration response indicates failure:", response);
          throw new Error(response.message || "Registration failed");
        } else {
          console.error("Unexpected registration response format:", response);
          throw new Error("Unexpected response format");
        }
      } else if (type === "pharmacy") {
        response = await ApiService.registerPharmacy(userData);
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
            localStorage.removeItem("pharmacist_token");
          } else if (type === "pharmacist") {
            console.log("Storing pharmacist token");
            localStorage.setItem("pharmacist_token", tokenData);
            // Clear other tokens
            localStorage.removeItem("auth_token");
            localStorage.removeItem("admin_token");
          } else {
            console.log("Storing customer token");
            localStorage.setItem("auth_token", tokenData);
            // Clear other tokens
            localStorage.removeItem("admin_token");
            localStorage.removeItem("pharmacist_token");
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

  const logout = async () => {
    try {
      // Only call logout API for customer logins
      if (userType === "customer") {
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
      localStorage.removeItem("pharmacist_token");
      localStorage.removeItem("pharmacy-admin_data");
      localStorage.removeItem("pharmacist_data");
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
    setHardcodedUser, // ✅ Export the new method
    isAuthenticated: !!token,
    isCustomer: userType === "customer",
    isPharmacyAdmin: userType === "pharmacy-admin",
    isPharmacist: userType === "pharmacist", // ✅ Add this check
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
