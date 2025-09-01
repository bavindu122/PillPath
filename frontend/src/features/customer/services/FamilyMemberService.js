import ApiService from '../../../services/api/AuthService';
import { tokenUtils } from '../../../utils/tokenUtils';

class FamilyMemberService {
  // Get all family members for the current authenticated user
  async getFamilyMembers(token) {
    try {
      console.log('Fetching family members for current user...');
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await this.makeDirectRequest('http://localhost:8080/api/members/family-members', {
        method: 'GET',
        headers
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
      
      // Transform frontend data to match backend DTO structure
      const backendData = {
        name: memberData.name,
        relation: memberData.relation,
        age: memberData.age,
        profilePicture: memberData.profilePicture || "",
        email: memberData.email || "",
        phone: memberData.phone || "",
        lastPrescriptionDate: memberData.lastPrescriptionDate || null,
        activePrescriptions: memberData.activePrescriptions || 0,
        totalPrescriptions: memberData.totalPrescriptions || 0,
        allergies: Array.isArray(memberData.allergies) ? memberData.allergies : [],
        bloodType: memberData.bloodType || "",
        medicalConditions: Array.isArray(memberData.medicalConditions) ? memberData.medicalConditions : [],
        currentMedications: Array.isArray(memberData.currentMedications) ? memberData.currentMedications : []
      };
      
      const response = await this.makeDirectRequest('http://localhost:8080/api/members/family-members', {
        method: 'POST',
        body: backendData
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

  // Update family member profile
  // Since backend doesn't have update endpoint, we'll use delete + add approach
  async updateFamilyMemberProfile(familyMemberId, profileData) {
    try {
      console.log('=== UPDATING FAMILY MEMBER PROFILE ===');
      console.log('Family member ID:', familyMemberId);
      console.log('Profile data:', profileData);
      
      // First, test authentication with debug endpoint
      console.log('Testing authentication...');
      try {
        await this.debugAuth();
        console.log('✅ Authentication test passed');
      } catch (authError) {
        console.error('❌ Authentication test failed:', authError);
        throw new Error('Authentication failed. Please log in again.');
      }
      
      // For family members that need updating, we'll use delete + add approach
      // since the backend doesn't have an update endpoint yet
      
      // First, get the current family member data
      const currentMembers = await this.getFamilyMembers();
      const currentMember = currentMembers.find(member => member.id === familyMemberId);
      
      if (!currentMember) {
        throw new Error('Family member not found');
      }
      
      // Merge current data with updates
      const updatedData = {
        ...currentMember,
        ...profileData,
        // Ensure arrays are properly handled
        allergies: Array.isArray(profileData.allergies) ? profileData.allergies : currentMember.allergies || [],
        medicalConditions: Array.isArray(profileData.medicalConditions) ? profileData.medicalConditions : currentMember.medicalConditions || [],
        currentMedications: Array.isArray(profileData.currentMedications) ? profileData.currentMedications : currentMember.currentMedications || []
      };
      
      // Delete the old member
      await this.deleteFamilyMember(familyMemberId);
      
      // Add the updated member (it will get a new ID)
      const newMember = await this.addFamilyMember(updatedData);
      
      console.log('Family member updated via delete + add:', newMember);
      
      return {
        success: true,
        familyMember: newMember,
        message: 'Family member profile updated successfully'
      };
      
    } catch (error) {
      console.error('Family member update service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update family member profile'
      };
    }
  }

  // Upload family member profile picture
  async uploadFamilyMemberProfilePicture(familyMemberId, file) {
    try {
      console.log('=== UPLOADING FAMILY MEMBER PROFILE PICTURE ===');
      console.log('Family member ID:', familyMemberId);
      console.log('File details:', { name: file.name, size: file.size, type: file.type });
      
      // Since backend doesn't have this endpoint yet, we'll simulate it
      // In a real implementation, you would upload to your backend's file storage
      console.warn('⚠️ Family member profile picture upload not implemented in backend');
      console.log('Missing endpoint: POST /api/members/family-members/{id}/upload-picture');
      
      // For now, create a simulated URL using the file name
      const mockImageUrl = URL.createObjectURL(file);
      
      console.log('Using local file URL for preview:', mockImageUrl);
      
      return {
        success: true,
        imageUrl: mockImageUrl,
        message: 'Profile picture updated locally (backend implementation needed for persistence)'
      };
      
    } catch (error) {
      console.error('Family member picture upload service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to upload profile picture'
      };
    }
  }

  // Get family member profile by ID
  async getFamilyMemberProfile(familyMemberId) {
    try {
      console.log('=== GETTING FAMILY MEMBER PROFILE ===');
      console.log('Family member ID:', familyMemberId);
      
      // Since backend doesn't have a single member endpoint, get all and filter
      const allMembers = await this.getFamilyMembers();
      const member = allMembers.find(m => m.id === familyMemberId);
      
      if (!member) {
        throw new Error('Family member not found');
      }
      
      console.log('Family member profile retrieved:', member);
      return {
        success: true,
        familyMember: member,
        message: 'Family member profile retrieved successfully'
      };
    } catch (error) {
      console.error('Family member profile service error:', error);
      return {
        success: false,
        message: error.message || 'Failed to retrieve family member profile'
      };
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
    const token = localStorage.getItem("auth_token") || tokenUtils.getAuthToken();
    console.log('🔑 Auth token found:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    console.log('🔍 Using token utils check:', !!tokenUtils.getAuthToken());
    console.log('🔍 Customer authenticated:', tokenUtils.isCustomerAuthenticated());
    
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    try {
      console.log("Making direct API request:", url);
      console.log("Request config:", {
        method: config.method || 'GET',
        headers: {
          ...config.headers,
          Authorization: config.headers.Authorization ? `Bearer ${config.headers.Authorization.substring(7, 27)}...` : 'NO AUTH'
        },
        bodyType: typeof config.body
      });
      
      const response = await fetch(url, config);

      let data;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log("Direct API response:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        dataType: typeof data,
        data: data
      });

      if (!response.ok) {
        // Provide detailed error information for debugging
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        if (response.status === 403) {
          errorMessage = `Authentication failed (403). Check if: 1) Token is valid, 2) User has permission, 3) Endpoint exists. Response: "${JSON.stringify(data)}"`;
          
          // Additional debugging for 403 errors
          console.error('🚨 403 AUTHENTICATION ERROR DEBUG:');
          console.error('1. Token exists:', !!token);
          console.error('2. Authorization header set:', !!config.headers.Authorization);
          console.error('3. Endpoint URL:', url);
          console.error('4. Request method:', config.method || 'GET');
          console.error('5. Response data:', data);
          
        } else if (response.status === 404) {
          errorMessage = `Endpoint not found (404). URL: ${url}. This endpoint might not be implemented in the backend.`;
        } else if (response.status === 401) {
          errorMessage = `Unauthorized (401). Token might be expired or missing.`;
        }
        
        // Handle different error formats from backend
        if (data && typeof data === "object") {
          if (data.message) {
            errorMessage += ` Backend message: ${data.message}`;
          } else if (data.error) {
            errorMessage += ` Backend error: ${data.error}`;
          }
        } else if (typeof data === "string" && data) {
          errorMessage += ` Response: ${data}`;
        }
        
        throw new Error(errorMessage);
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
