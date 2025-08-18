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

    // ✅ UPDATED: Add pharmacy admin auth token for pharmacy-specific endpoints
    if (endpoint.startsWith("admin/")) {
      const adminAuthHeaders = tokenUtils.getAdminAuthHeaders();
      if (adminAuthHeaders.Authorization && !config.headers.Authorization) {
        config.headers = { ...config.headers, ...adminAuthHeaders };
      }
    } else if (endpoint.startsWith("pharmacies/pharmacy-profile") || endpoint.startsWith("pharmacies/") && endpoint !== "pharmacies/register") {
      // Add pharmacy admin token for pharmacy profile endpoints
      const pharmacyToken = localStorage.getItem("pharmacy_auth_token");
      if (pharmacyToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${pharmacyToken}`;
      }
    } else if (
      endpoint !== "pharmacies/register" &&
      endpoint !== "pharmacies/public" &&
      !endpoint.includes("/map")
    ) {
      // Add regular auth token for non-admin, non-registration, non-map endpoints
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
        if (response.status === 401) {
          if (endpoint.startsWith("admin/")) {
            tokenUtils.removeAdminToken();
            window.location.href = "/admin/login";
          } else if (endpoint.startsWith("pharmacies/pharmacy-profile")) {
            localStorage.removeItem("pharmacy_auth_token");
            window.location.href = "/pharmacy/login";
          }
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

  // ✅ NEW: Get pharmacy profile for logged-in pharmacy admin
  async getPharmacyProfile() {
    return this.request("pharmacies/pharmacy-profile", {
      method: "GET",
    });
  }

  // ✅ NEW: Update pharmacy profile
  async updatePharmacyProfile(profileData) {
    try {
      console.log("Updating pharmacy profile:", profileData);

      // ✅ Validate required fields
      const requiredFields = ["name", "address"];
      for (const field of requiredFields) {
        if (!profileData[field] || !profileData[field].trim()) {
          throw new Error(`${field} is required`);
        }
      }

      // ✅ Clean and prepare the update data
      const updateRequest = {
        name: profileData.name.trim(),
        address: profileData.address.trim(),
      };

      // ✅ Add optional fields if provided
      if (profileData.phoneNumber) {
        updateRequest.phoneNumber = profileData.phoneNumber.trim();
      }

      if (profileData.latitude !== undefined && profileData.longitude !== undefined) {
        const lat = parseFloat(profileData.latitude);
        const lng = parseFloat(profileData.longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
          if (lat < -90 || lat > 90) {
            throw new Error("Latitude must be between -90 and 90");
          }
          if (lng < -180 || lng > 180) {
            throw new Error("Longitude must be between -180 and 180");
          }
          updateRequest.latitude = lat;
          updateRequest.longitude = lng;
        }
      }

      if (profileData.operatingHours && typeof profileData.operatingHours === 'object') {
        // Clean up operating hours - remove empty strings
        const cleanOperatingHours = {};
        Object.entries(profileData.operatingHours).forEach(([day, hours]) => {
          if (hours && hours.trim()) {
            cleanOperatingHours[day] = hours.trim();
          }
        });
        if (Object.keys(cleanOperatingHours).length > 0) {
          updateRequest.operatingHours = cleanOperatingHours;
        }
      }

      if (profileData.services && Array.isArray(profileData.services)) {
        updateRequest.services = profileData.services.filter(service => service && service.trim());
      }

      if (profileData.deliveryAvailable !== undefined) {
        updateRequest.deliveryAvailable = Boolean(profileData.deliveryAvailable);
      }

      if (profileData.deliveryRadius !== undefined && profileData.deliveryRadius !== null) {
        const radius = parseInt(profileData.deliveryRadius, 10);
        if (!isNaN(radius) && radius > 0) {
          updateRequest.deliveryRadius = radius;
        }
      }

      console.log("Sending profile update request:", updateRequest);

      return this.request("pharmacies/pharmacy-profile", {
        method: "PUT",
        body: updateRequest,
      });
    } catch (error) {
      console.error("Pharmacy profile update preparation failed:", error);
      throw error;
    }
  }

  // ✅ NEW: Upload pharmacy images (logo/banner)
  async uploadPharmacyImage(imageFile, imageType) {
    try {
      if (!imageFile) {
        throw new Error("Image file is required");
      }

      if (!['logo', 'banner'].includes(imageType)) {
        throw new Error("Image type must be 'logo' or 'banner'");
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('type', imageType);

      // Don't set Content-Type for FormData, let browser set it
      const config = {
        method: "POST",
        body: formData,
        headers: {
          // Remove Content-Type to let browser set multipart/form-data boundary
        },
      };

      // Add pharmacy admin token
      const pharmacyToken = localStorage.getItem("pharmacy_auth_token");
      if (pharmacyToken) {
        config.headers.Authorization = `Bearer ${pharmacyToken}`;
      }

      const url = `${API_BASE_URL}/pharmacies/pharmacy-profile/upload-image`;
      const response = await fetch(url, config);

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("pharmacy_auth_token");
          window.location.href = "/pharmacy/login";
          return;
        }
        throw new Error(data.message || data.error || `Upload failed: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  }

  // ✅ Existing methods...
  async getPharmaciesForMap(params = {}) {
    const searchParams = new URLSearchParams();

    if (params.userLat && params.userLng) {
      searchParams.append("userLat", params.userLat.toString());
      searchParams.append("userLng", params.userLng.toString());
    }

    const radius = params.radiusKm || 10;
    searchParams.append("radiusKm", radius.toString());

    const queryString = searchParams.toString();
    const endpoint = `pharmacies/map${queryString ? `?${queryString}` : ""}`;

    return this.request(endpoint, {
      method: "GET",
    });
  }

  async getPharmacyStats() {
    return this.request("admin/pharmacies/stats", {
      method: "GET",
    });
  }

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

  async getPharmacyById(pharmacyId) {
    return this.request(`admin/pharmacies/${pharmacyId}`, {
      method: "GET",
    });
  }

  async approvePharmacy(pharmacyId) {
    return this.request(`admin/pharmacies/${pharmacyId}/approve`, {
      method: "PUT",
      body: {},
    });
  }

  async rejectPharmacy(pharmacyId, reason) {
    return this.request(`admin/pharmacies/${pharmacyId}/reject`, {
      method: "PUT",
      body: { reason },
    });
  }

  async suspendPharmacy(pharmacyId, reason) {
    return this.request(`admin/pharmacies/${pharmacyId}/suspend`, {
      method: "PUT",
      body: { reason },
    });
  }

  async activatePharmacy(pharmacyId) {
    return this.request(`admin/pharmacies/${pharmacyId}/activate`, {
      method: "PUT",
      body: {},
    });
  }

  async managePharmacy(pharmacyId, action, reason = null) {
    const body = {
      pharmacyId: parseInt(pharmacyId),
      action: action,
    };

    if (reason) {
      body.reason = reason;
    }

    return this.request(`admin/pharmacies/${pharmacyId}/manage`, {
      method: "PUT",
      body,
    });
  }

  async batchManagePharmacies(operations) {
    return this.request("admin/pharmacies/batch", {
      method: "PUT",
      body: operations,
    });
  }

  async registerPharmacy(pharmacyData) {
    try {
      console.log("Preparing pharmacy registration data with location...");

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

      const cleanOperatingHours = {};
      Object.entries(pharmacyData.operatingHours || {}).forEach(
        ([day, hours]) => {
          if (hours && hours.trim()) {
            cleanOperatingHours[day] = hours.trim();
          }
        }
      );

      const registrationRequest = {
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
        latitude: lat,
        longitude: lng,
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

      return this.request("pharmacies/register", {
        method: "POST",
        body: registrationRequest,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Pharmacy registration preparation failed:", error);
      throw error;
    }
  }

  async getPharmaciesForCustomers(filters = {}) {
    return this.getPharmaciesForMap({
      userLat: filters.latitude,
      userLng: filters.longitude,
      radiusKm: filters.radius || 10
    });
  }

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