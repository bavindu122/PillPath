import { tokenUtils } from "../../utils/tokenUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

class PharmacyService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}/${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // ✅ FIXED: Only add admin auth token for admin-specific operations
    // Don't add admin token for public registration endpoints
    if (endpoint.startsWith("admin/")) {
      const adminAuthHeaders = tokenUtils.getAdminAuthHeaders();
      if (adminAuthHeaders.Authorization && !config.headers.Authorization) {
        config.headers = { ...config.headers, ...adminAuthHeaders };
      }
    } else if (
      endpoint !== "pharmacies/register" &&
      endpoint !== "pharmacies/public"
    ) {
      // Add regular auth token for non-admin, non-registration endpoints
      const token = localStorage.getItem("auth_token");
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    try {
      console.log("Making Pharmacy API request:", url, config);
      const response = await fetch(url, config);

      let data;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log("Pharmacy API response:", response.status, data);

      if (!response.ok) {
        if (response.status === 401 && endpoint.startsWith("admin/")) {
          tokenUtils.removeAdminToken();
          window.location.href = "/admin/login";
          return;
        }

        if (data && typeof data === "object") {
          if (data.message) {
            throw new Error(data.message);
          } else if (data.error) {
            throw new Error(data.error);
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("Pharmacy API request failed:", error);
      throw error;
    }
  }

  // ✅ Get pharmacy statistics for admin dashboard
  async getPharmacyStats() {
    return this.request("admin/pharmacies/stats", {
      method: "GET",
    });
  }

  // ✅ Get all pharmacies with pagination and filtering
  async getAllPharmacies(params = {}) {
    const defaultParams = {
      search: "",
      status: "All",
      page: 0,
      size: 12,
      sortBy: "createdAt",
      sortDir: "desc",
    };

    const queryParams = { ...defaultParams, ...params };
    const searchParams = new URLSearchParams();

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request(`admin/pharmacies?${searchParams.toString()}`, {
      method: "GET",
    });
  }

  // ✅ Get pharmacy details by ID
  async getPharmacyById(pharmacyId) {
    return this.request(`admin/pharmacies/${pharmacyId}`, {
      method: "GET",
    });
  }

  // ✅ Approve pharmacy registration (Updated to PUT)
  async approvePharmacy(pharmacyId) {
    return this.request(`admin/pharmacies/${pharmacyId}/approve`, {
      method: "PUT",
      body: {}, // Empty body as per your backend spec
    });
  }

  // ✅ Reject pharmacy registration (Updated to PUT)
  async rejectPharmacy(pharmacyId, reason) {
    return this.request(`admin/pharmacies/${pharmacyId}/reject`, {
      method: "PUT",
      body: { reason },
    });
  }

  // ✅ Suspend pharmacy (Updated to PUT)
  async suspendPharmacy(pharmacyId, reason) {
    return this.request(`admin/pharmacies/${pharmacyId}/suspend`, {
      method: "PUT",
      body: { reason },
    });
  }

  // ✅ Activate pharmacy (Updated to PUT)
  async activatePharmacy(pharmacyId) {
    return this.request(`admin/pharmacies/${pharmacyId}/activate`, {
      method: "PUT",
      body: {}, // Empty body as per your backend spec
    });
  }

  // ✅ Generic pharmacy management method using PharmacyManagementDTO
  async managePharmacy(pharmacyId, action, reason = null) {
    const body = {
      pharmacyId: parseInt(pharmacyId),
      action: action, // "approve", "reject", "suspend", "activate"
    };

    if (reason) {
      body.reason = reason;
    }

    return this.request(`admin/pharmacies/${pharmacyId}/manage`, {
      method: "PUT",
      body,
    });
  }

  // ✅ Batch pharmacy operations
  async batchManagePharmacies(operations) {
    return this.request("admin/pharmacies/batch", {
      method: "PUT",
      body: operations, // Array of PharmacyManagementDTO objects
    });
  }

  // ✅ UPDATED: Register pharmacy with location validation (NO AUTH TOKEN)
  async registerPharmacy(pharmacyData) {
    try {
      console.log("Preparing pharmacy registration data with location...");

      // ✅ Validate required fields including location
      const requiredFields = [
        "name",
        "address",
        "phoneNumber",
        "email",
        "licenseNumber",
        "licenseExpiryDate",
        "latitude",
        "longitude",
        "adminFirstName",
        "adminLastName",
        "adminEmail",
        "adminPassword",
        "adminPhoneNumber",
        "adminPosition",
      ];

      for (const field of requiredFields) {
        if (!pharmacyData[field] && pharmacyData[field] !== 0) {
          throw new Error(`${field} is required`);
        }
      }

      // ✅ Validate coordinates
      const lat = parseFloat(pharmacyData.latitude);
      const lng = parseFloat(pharmacyData.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Valid latitude and longitude are required");
      }

      if (lat < -90 || lat > 90) {
        throw new Error("Latitude must be between -90 and 90");
      }

      if (lng < -180 || lng > 180) {
        throw new Error("Longitude must be between -180 and 180");
      }

      // ✅ FIXED: Clean up operating hours - remove empty strings
      const cleanOperatingHours = {};
      Object.entries(pharmacyData.operatingHours || {}).forEach(
        ([day, hours]) => {
          if (hours && hours.trim()) {
            cleanOperatingHours[day] = hours.trim();
          }
        }
      );

      const registrationRequest = {
        // Pharmacy details
        name: pharmacyData.name.trim(),
        address: pharmacyData.address.trim(),
        phoneNumber: pharmacyData.phoneNumber.trim(),
        email: pharmacyData.email.trim().toLowerCase(),
        licenseNumber: pharmacyData.licenseNumber.trim(),
        licenseExpiryDate: pharmacyData.licenseExpiryDate,
        operatingHours: cleanOperatingHours,
        services: pharmacyData.services || [],
        deliveryAvailable: pharmacyData.deliveryAvailable || false,
        deliveryRadius: pharmacyData.deliveryRadius
          ? parseInt(pharmacyData.deliveryRadius, 10)
          : null,

        // ✅ Location data
        latitude: lat,
        longitude: lng,

        // Admin details
        adminFirstName: pharmacyData.adminFirstName.trim(),
        adminLastName: pharmacyData.adminLastName.trim(),
        adminEmail: pharmacyData.adminEmail.trim().toLowerCase(),
        adminPassword: pharmacyData.adminPassword,
        adminPhoneNumber: pharmacyData.adminPhoneNumber.trim(),
        adminPosition: pharmacyData.adminPosition.trim(),
        adminLicenseNumber: pharmacyData.adminLicenseNumber
          ? pharmacyData.adminLicenseNumber.trim()
          : "",
      };

      console.log(
        "Sending pharmacy registration request with location:",
        registrationRequest
      );

      // ✅ FIXED: Call registration endpoint without any auth headers
      return this.request("pharmacies/register", {
        method: "POST",
        body: registrationRequest,
        headers: {
          "Content-Type": "application/json",
          // No Authorization header for registration
        },
      });
    } catch (error) {
      console.error("Pharmacy registration preparation failed:", error);
      throw error;
    }
  }

  // ✅ NEW: Get all pharmacies for customer "find pharmacy" feature
  async getPharmaciesForCustomers(filters = {}) {
    const params = new URLSearchParams();

    // Location-based search
    if (filters.latitude && filters.longitude) {
      params.append("lat", filters.latitude);
      params.append("lng", filters.longitude);
    }
    if (filters.radius) {
      params.append("radius", filters.radius);
    }

    // Service filters
    if (filters.hasDelivery) {
      params.append("hasDelivery", filters.hasDelivery);
    }
    if (filters.has24HourService) {
      params.append("has24HourService", filters.has24HourService);
    }

    // Search filters
    if (filters.search) {
      params.append("search", filters.search);
    }

    const queryString = params.toString();
    const endpoint = `pharmacies/public${queryString ? `?${queryString}` : ""}`;

    return this.request(endpoint, {
      method: "GET",
    });
  }

  // ✅ NEW: Update pharmacy location
  async updatePharmacyLocation(pharmacyId, locationData) {
    const lat = parseFloat(locationData.latitude);
    const lng = parseFloat(locationData.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      throw new Error("Valid latitude and longitude are required");
    }

    if (lat < -90 || lat > 90) {
      throw new Error("Latitude must be between -90 and 90");
    }

    if (lng < -180 || lng > 180) {
      throw new Error("Longitude must be between -180 and 180");
    }

    return this.request(`pharmacies/${pharmacyId}/location`, {
      method: "PUT",
      body: {
        latitude: lat,
        longitude: lng,
        address: locationData.address,
      },
    });
  }
}

export default new PharmacyService();
