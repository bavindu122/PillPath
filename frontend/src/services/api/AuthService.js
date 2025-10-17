import PharmacyService from "./PharmacyService";
import { tokenUtils } from "../../utils/tokenUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}/${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // ✅ FIXED: Only add auth token for authenticated endpoints, not registration or password reset
    if (!endpoint.includes("/register") && 
        !endpoint.includes("/login") && 
        !endpoint.includes("/password-reset")) {
      const authHeaders = tokenUtils.getAuthHeaders();
      if (authHeaders.Authorization && !config.headers.Authorization) {
        config.headers = { ...config.headers, ...authHeaders };
      }
    }

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    try {
      console.log("Making API request:", url, config);
      const response = await fetch(url, config);

      let data;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log("API response:", response.status, data);

      if (!response.ok) {
        // Handle different error formats from backend
        if (data && typeof data === "object") {
          if (data.message) {
            throw new Error(data.message);
          } else if (data.error) {
            throw new Error(data.error);
          } else if (!data.success && data.errors) {
            const errorMessages = Array.isArray(data.errors)
              ? data.errors.join(", ")
              : Object.values(data.errors).join(", ");
            throw new Error(errorMessages);
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // ✅ Customer registration (NO AUTH TOKEN)
  async registerCustomer(userData) {
    try {
      console.log("Preparing customer registration data...");

      const registrationRequest = {
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        email: userData.email.trim().toLowerCase(),
        phone: userData.phone ? userData.phone.trim() : "",
        password: userData.password,
        dateOfBirth: userData.dateOfBirth,
        termsAccepted: userData.termsAccepted,
      };

      if (!registrationRequest.email || !registrationRequest.password) {
        throw new Error("Email and password are required");
      }

      if (!registrationRequest.firstName || !registrationRequest.lastName) {
        throw new Error("First name and last name are required");
      }

      if (!registrationRequest.dateOfBirth) {
        throw new Error("Date of birth is required");
      }

      if (!registrationRequest.termsAccepted) {
        throw new Error("Terms acceptance is required");
      }

      console.log(
        "Sending customer registration request:",
        registrationRequest
      );

      return this.request("customers/register", {
        method: "POST",
        body: registrationRequest,
        headers: {
          "Content-Type": "application/json",
          // No Authorization header for registration
        },
      });
    } catch (error) {
      console.error("Customer registration preparation failed:", error);
      throw error;
    }
  }

  // ✅ UPDATED: Pharmacy registration with location validation (NO AUTH TOKEN)
  async registerPharmacy(pharmacyData) {
    try {
      console.log(
        "AuthService: Preparing pharmacy registration with location..."
      );

      // ✅ Additional validation before calling PharmacyService
      if (!pharmacyData.latitude || !pharmacyData.longitude) {
        throw new Error(
          "Pharmacy location (latitude and longitude) is required"
        );
      }

      // ✅ Validate coordinates format
      const lat = parseFloat(pharmacyData.latitude);
      const lng = parseFloat(pharmacyData.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error(
          "Invalid coordinate format. Please provide valid numbers for latitude and longitude"
        );
      }

      console.log(
        "AuthService: Location validated, calling PharmacyService..."
      );

      // ✅ Call PharmacyService which includes location in the request
      return PharmacyService.registerPharmacy(pharmacyData);
    } catch (error) {
      console.error("AuthService: Pharmacy registration failed:", error);
      throw error;
    }
  }

  // ✅ Unified login method
  async login(credentials) {
    const loginRequest = {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    };

    console.log("Sending unified login request:", loginRequest);

    return this.request("users/login", {
      method: "POST",
      body: loginRequest,
      headers: {
        "Content-Type": "application/json",
        // No Authorization header for login
      },
    });
  }

  // ✅ Refresh access token using refresh token
  async refreshToken(refreshToken) {
    try {
      if (!refreshToken) throw new Error("No refresh token provided");

      console.log("Requesting token refresh...");
      return this.request("auth/refresh", {
        method: "POST",
        body: { refreshToken },
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  }

  // ✅ Get user profile (works for all user types)
  async getUserProfile() {
    return this.request("customer/profile", {
      method: "GET",
    });
  }

  // ✅ Update user profile
  async updateUserProfile(profileData) {
    return this.request("users/profile", {
      method: "PUT",
      body: profileData,
    });
  }

  // ✅ User logout - Handle potential 403 errors gracefully
  async logout() {
    try {
      // // If backend supports revoking refresh tokens, send it
      // const refreshToken = localStorage.getItem("refresh_token");
      // if (refreshToken) {
      //   return this.request("auth/revoke", {
      //     method: "POST",
      //     body: { refreshToken },
      //     headers: { "Content-Type": "application/json" },
      //   });
      // }

      // Fallback to simple logout endpoint if refresh token not present
      return this.request("users/logout", {
        method: "POST",
      });
    } catch (error) {
      // If logout fails with 403 or other auth errors, we still want to clear local data
      console.warn(
        "Logout API call failed, but clearing local session:",
        error.message
      );
      return { success: true, message: "Local logout completed" };
    }
  }

  // ✅ NEW: Get pharmacies for find pharmacy feature
  async getPharmacies(filters = {}) {
    return PharmacyService.getPharmaciesForCustomers(filters);
  }

  // ✅ Keep backward compatibility
  async loginCustomer(credentials) {
    return this.login(credentials);
  }

  async loginPharmacyAdmin(credentials) {
    return this.login(credentials);
  }

  async getProfile(userType = "customer") {
    return this.getUserProfile();
  }

  // ✅ Password Reset Methods
  
  /**
   * Request a password reset link to be sent to the user's email
   * @param {string} email - The user's email address
   * @returns {Promise} Response from the server
   */
  async requestPasswordReset(email) {
    return this.request("password-reset/request", {
      method: "POST",
      body: { email: email.trim().toLowerCase() },
      headers: { "Content-Type": "application/json" },
    });
  }

  /**
   * Verify if a password reset token is valid
   * @param {string} token - The reset token from the email link
   * @returns {Promise} Response indicating token validity
   */
  async verifyResetToken(token) {
    return this.request(`password-reset/verify?token=${encodeURIComponent(token)}`, {
      method: "GET",
    });
  }

  /**
   * Reset the password using a valid token
   * @param {Object} resetData - Object containing token, newPassword, and confirmPassword
   * @returns {Promise} Response from the server
   */
  async resetPassword(resetData) {
    return this.request("password-reset/reset", {
      method: "POST",
      body: {
        token: resetData.token,
        newPassword: resetData.newPassword,
        confirmPassword: resetData.confirmPassword,
      },
      headers: { "Content-Type": "application/json" },
    });
  }
}

export default new ApiService();
