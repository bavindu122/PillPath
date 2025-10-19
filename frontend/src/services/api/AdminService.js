const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

class AdminService {
  // Overview stat cards summary
  async getOverviewSummary() {
    return this.request("admin/overview/summary", {
      method: "GET",
    });
  }

  // Overview charts data
  async getOverviewCharts() {
    return this.request("admin/overview/charts", {
      method: "GET",
    });
  }

  // Analytics KPIs (stat cards on Analytics page)
  async getAnalyticsKpis() {
    return this.request("admin/analytics/kpis", {
      method: "GET",
    });
  }

  // Analytics charts (Analytics page)
  async getAnalyticsCharts(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(
      `admin/analytics/charts${queryParams ? `?${queryParams}` : ""}`,
      {
        method: "GET",
      }
    );
  }

  // Pharmacy performance (single endpoint, no pagination/sort)
  async getPharmacyPerformance() {
    return this.request("admin/analytics/pharmacy-performance", {
      method: "GET",
    });
  }

  // Customer activity (single endpoint, no pagination/sort)
  async getCustomerActivity() {
    return this.request("admin/analytics/customer-activity", {
      method: "GET",
    });
  }

  // Suspended accounts (single endpoint, no pagination/sort)
  async getSuspendedAccounts() {
    return this.request("admin/analytics/suspended-accounts", {
      method: "GET",
    });
  }
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

  // Get single customer details
  async getCustomerById(customerId) {
    return this.request(`admin/customers/${customerId}`, {
      method: "GET",
    });
  }

  // Suspend a customer
  async suspendCustomer(customerId, reason) {
    return this.request(`admin/customers/${customerId}/suspend`, {
      method: "PATCH",
      body: { reason },
    });
  }

  // Activate a customer
  async activateCustomer(customerId) {
    return this.request(`admin/customers/${customerId}/activate`, {
      method: "PATCH",
      body: {},
    });
  }

  // ✅ Get all orders
  async getOrders(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(`admin/orders${queryParams ? `?${queryParams}` : ""}`, {
      method: "GET",
    });
  }
  async getAnnouncements(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(
      `admin/announcements${queryParams ? `?${queryParams}` : ""}`,
      {
        method: "GET",
      }
    );
  }

  async addAnnouncement(announcementData) {
    return this.request("admin/announcements", {
      method: "POST",
      body: announcementData,
    });
  }

  async updateAnnouncement(announcementId, announcementData) {
    return this.request(`admin/announcements/${announcementId}`, {
      method: "PUT",
      body: announcementData,
    });
  }

  async deleteAnnouncement(announcementId) {
    return this.request(`admin/announcements/${announcementId}`, {
      method: "DELETE",
    });
  }

  async toggleAnnouncementStatus(announcementId) {
    return this.request(`admin/announcements/${announcementId}/toggle-status`, {
      method: "PATCH",
    });
  }

  async getPublicAnnouncements(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(
      `public/announcements${queryParams ? `?${queryParams}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Don't include Authorization header for public endpoints
        },
      }
    );
  }

  // ✅ Get all prescriptions
  async getPrescriptions(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.request(
      `admin/prescriptions${queryParams ? `?${queryParams}` : ""}`,
      {
        method: "GET",
      }
    );
  }

  // ✅ Get prescription statistics
  async getPrescriptionStatistics() {
    return this.request("admin/prescriptions/statistics", {
      method: "GET",
    });
  }

  // ✅ Get single prescription details
  async getPrescriptionById(prescriptionId) {
    return this.request(`admin/prescriptions/${prescriptionId}`, {
      method: "GET",
    });
  }

  // ✅ Update prescription status
  async updatePrescriptionStatus(
    prescriptionId,
    status,
    reason = null,
    adminNotes = null
  ) {
    return this.request(`admin/prescriptions/${prescriptionId}/status`, {
      method: "PATCH",
      body: {
        status,
        reason,
        adminNotes,
      },
    });
  }
}

export default new AdminService();
