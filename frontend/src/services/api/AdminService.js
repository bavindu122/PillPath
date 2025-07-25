const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

class AdminService {
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
    const token = localStorage.getItem("admin_token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    try {
      console.log("Making Admin API request:", url, config);
      const response = await fetch(url, config);

      let data;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log("Admin API response:", response.status, data);

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
      console.error("Admin API request failed:", error);
      throw error;
    }
  }

  // ✅ Admin login
  // In AdminService.js
  async login(credentials) {
    const loginRequest = {
      username: credentials.username,
      password: credentials.password,
    };

    console.log("Sending admin login request:", loginRequest);

    // ✅ Update endpoint to match your backend
    return this.request("users/admin/login", {
      // or whatever your actual endpoint is
      method: "POST",
      body: loginRequest,
    });
  }

  // ✅ Get admin profile - Updated to handle mock authentication
  async getAdminProfile() {
    // ✅ For now, return mock data since backend might not have profile endpoint ready
    const adminData = JSON.parse(localStorage.getItem("admin_data") || "{}");

    if (adminData && adminData.id) {
      return {
        id: adminData.id,
        username: adminData.username,
        adminLevel: adminData.adminLevel,
        isAuthenticated: true,
        userType: "admin",
      };
    }

    // If no stored data, make actual API call
    return this.request("users/admin/profile", {
      method: "GET",
    });
  }

  // ✅ Admin logout
  async logout() {
    return this.request("users/admin/logout", {
      method: "POST",
    });
  }
  //   // ✅ Get admin profile
  //   async getAdminProfile() {
  //     return this.request('users/admin/profile', {
  //       method: 'GET',
  //     });
  //   }

  // ✅ Admin logout
  async logout() {
    return this.request("users/admin/logout", {
      method: "POST",
    });
  }

  // ✅ Get dashboard stats
  async getDashboardStats() {
    return this.request("users/admin/dashboard/stats", {
      method: "GET",
    });
  }

  // ✅ Get all pharmacies
  async getPharmacies(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(
      `admin/pharmacies${queryParams ? `?${queryParams}` : ""}`,
      {
        method: "GET",
      }
    );
  }

  // ✅ Approve pharmacy
  async approvePharmacy(pharmacyId) {
    return this.request(`admin/pharmacies/${pharmacyId}/approve`, {
      method: "POST",
    });
  }

  // ✅ Reject pharmacy
  async rejectPharmacy(pharmacyId, reason) {
    return this.request(`admin/pharmacies/${pharmacyId}/reject`, {
      method: "POST",
      body: { reason },
    });
  }

  // ✅ Get all customers
  async getCustomers(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(
      `admin/customers${queryParams ? `?${queryParams}` : ""}`,
      {
        method: "GET",
      }
    );
  }

  // ✅ Get all orders
  async getOrders(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(`admin/orders${queryParams ? `?${queryParams}` : ""}`, {
      method: "GET",
    });
  }
}

export default new AdminService();
