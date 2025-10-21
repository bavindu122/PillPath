import { tokenUtils } from "../../../utils/tokenUtils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

/**
 * Service for managing pharmacist profile operations
 */
export const pharmacistProfileService = {
  /**
   * Get current pharmacist's profile
   * @returns {Promise<Object>} Pharmacist profile data
   */
  async getMyProfile() {
    const response = await fetch(`${API_BASE_URL}/pharmacist/profile`, {
      method: "GET",
      headers: {
        ...tokenUtils.getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch profile");
    }

    return data;
  },

  /**
   * Update current pharmacist's profile
   * @param {Object} profileData - Updated profile information
   * @returns {Promise<Object>} Updated profile data
   */
  async updateMyProfile(profileData) {
    const response = await fetch(`${API_BASE_URL}/pharmacist/profile`, {
      method: "PUT",
      headers: {
        ...tokenUtils.getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update profile");
    }

    return data;
  },

  /**
   * Upload profile picture
   * @param {File} file - Image file to upload
   * @returns {Promise<Object>} Upload result with imageUrl
   */
  async uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/pharmacist/profile/picture`, {
      method: "POST",
      headers: {
        ...tokenUtils.getAuthHeaders(),
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to upload profile picture");
    }

    return data;
  },

  /**
   * Delete profile picture
   * @returns {Promise<Object>} Result of deletion
   */
  async deleteProfilePicture() {
    const response = await fetch(`${API_BASE_URL}/pharmacist/profile/picture`, {
      method: "DELETE",
      headers: {
        ...tokenUtils.getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete profile picture");
    }

    return data;
  },
};

export default pharmacistProfileService;
