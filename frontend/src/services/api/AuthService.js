import PharmacyService from "./PharmacyService";

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

    // Add auth token if available
    const token = localStorage.getItem("auth_token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
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

  // ✅ Customer registration
  async registerCustomer(userData) {
    try {
      console.log("Preparing customer registration data...");

      const registrationRequest = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || "",
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

      console.log("Sending customer registration request:", registrationRequest);

      return this.request("customers/register", {
        method: "POST",
        body: registrationRequest,
      });
    } catch (error) {
      console.error("Customer registration preparation failed:", error);
      throw error;
    }
  }

  // ✅ Pharmacy registration
  async registerPharmacy(pharmacyData) {
    return PharmacyService.registerPharmacy(pharmacyData);
  }

  // ✅ UPDATED: Unified login method
  async login(credentials) {
    const loginRequest = {
      email: credentials.email,
      password: credentials.password,
    };

    console.log("Sending unified login request:", loginRequest);

    return this.request("users/login", {
      method: "POST",
      body: loginRequest,
    });
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

  // ✅ User logout
  async logout() {
    return this.request("users/logout", {
      method: "POST",
    });
  }

  // ✅ Remove old separate methods as they're no longer needed
  // Keep backward compatibility for now
  async loginCustomer(credentials) {
    return this.login(credentials);
  }

  async loginPharmacyAdmin(credentials) {
    return this.login(credentials);
  }

  async getProfile(userType = "customer") {
    return this.getUserProfile();
  }
}

export default new ApiService();