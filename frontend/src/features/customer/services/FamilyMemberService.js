import ApiService from '../../../services/api/AuthService';
import { getAuthHeaders } from '../../../utils/tokenUtils';

class FamilyMemberService {
  // Get all family members for the current authenticated user
  async getFamilyMembers() {
    try {
      console.log('Fetching family members for current user...');
      
      // Use the correct endpoint path that matches the backend controller
      // Backend controller is mapped to "/api/members" but our ApiService 
      // adds "/api/v1/" prefix, so we need to adjust
      const response = await this.makeDirectRequest('http://localhost:8080/api/members/family-members', {
        method: 'GET'
      });
      
      console.log('Family members fetched successfully:', response);
      return response;
    } catch (error) {
      console.error('Error fetching family members:', error);
      throw error;
    }
  }

  // Add a new family member
  async addFamilyMember(memberData) {
    try {
      console.log('Adding family member:', memberData);
      const response = await this.makeDirectRequest('http://localhost:8080/api/members/family-members', {
        method: 'POST',
        body: memberData
      });
      console.log('Family member added successfully:', response);
      return response;
    } catch (error) {
      console.error('Error adding family member:', error);
      throw error;
    }
  }

  // Delete a family member
  async deleteFamilyMember(memberId) {
    try {
      console.log(`Deleting family member ${memberId}...`);
      const response = await this.makeDirectRequest(`http://localhost:8080/api/members/family-members/${memberId}`, {
        method: 'DELETE'
      });
      console.log('Family member deleted successfully');
      return response;
    } catch (error) {
      console.error('Error deleting family member:', error);
      throw error;
    }
  }

  // Direct request method that bypasses the v1 prefix
  async makeDirectRequest(url, options = {}) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization && !config.headers.Authorization) {
      config.headers = { ...config.headers, ...authHeaders };
    }

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    try {
      console.log("Making direct API request:", url, config);
      const response = await fetch(url, config);

      let data;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log("Direct API response:", response.status, data);

      if (!response.ok) {
        // Handle different error formats from backend
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
      console.error("Direct API request failed:", error);
      throw error;
    }
  }

  // Debug authentication (for testing purposes)
  async debugAuth() {
    try {
      const response = await this.makeDirectRequest('http://localhost:8080/api/members/debug-auth', {
        method: 'GET'
      });
      console.log('Debug auth response:', response);
      return response;
    } catch (error) {
      console.error('Error in debug auth:', error);
      throw error;
    }
  }
}

export default new FamilyMemberService();