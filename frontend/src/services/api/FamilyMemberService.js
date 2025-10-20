const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const familyMemberService = {
  // Update family member profile
  updateFamilyMemberProfile: async (familyMemberId, profileData) => {
    try {
      console.log('=== UPDATING FAMILY MEMBER PROFILE ===');
      console.log('Family member ID:', familyMemberId);
// Simple logger that checks VITE_ENABLE_LOGGING environment variable
function logger(...args) {
  if (import.meta.env.VITE_ENABLE_LOGGING === 'true') {
    console.log(...args);
  }
}
function logError(...args) {
  if (import.meta.env.VITE_ENABLE_LOGGING === 'true') {
    console.error(...args);
  }
}

export const familyMemberService = {
  // Update family member profile
  updateFamilyMemberProfile: async (familyMemberId, profileData) => {
    try {
      logger('=== UPDATING FAMILY MEMBER PROFILE ===');
      logger('Family member ID:', familyMemberId);
      logger('Profile data:', profileData);
      
      // Get token using the same method as ApiService
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}/customers/family-members/${familyMemberId}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });
      
      console.log('Family member update response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Family member update successful:', result);
        return {
          success: true,
          familyMember: result,
          message: 'Family member profile updated successfully'
        };
      } else {
        const errorData = await response.json();
        console.error('Family member update error:', errorData);
        return {
          success: false,
          message: errorData.message || 'Failed to update family member profile'
        };
      }
    } catch (error) {
      console.error('Family member update service error:', error);
      return {
        success: false,
        message: error.message || 'Network error occurred'
      };
    }
  },

  // Upload family member profile picture
  uploadFamilyMemberProfilePicture: async (familyMemberId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      console.log('=== UPLOADING FAMILY MEMBER PROFILE PICTURE ===');
      console.log('Family member ID:', familyMemberId);
      console.log('File details:', { name: file.name, size: file.size, type: file.type });
      
      // Get token using the same method as ApiService
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}/customers/family-members/${familyMemberId}/upload-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });
      
      console.log('Family member picture upload response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Family member picture upload successful:', result);
        return {
          success: true,
          imageUrl: result.imageUrl || result.profilePictureUrl,
          message: 'Profile picture uploaded successfully'
        };
      } else {
        const errorData = await response.json();
        console.error('Family member picture upload error:', errorData);
        return {
          success: false,
          message: errorData.message || 'Failed to upload profile picture'
        };
      }
    } catch (error) {
      console.error('Family member picture upload service error:', error);
      return {
        success: false,
        message: error.message || 'Network error occurred'
      };
    }
  },

  // Get family member profile
  getFamilyMemberProfile: async (familyMemberId) => {
    try {
      console.log('=== GETTING FAMILY MEMBER PROFILE ===');
      console.log('Family member ID:', familyMemberId);
      
      // Get token using the same method as ApiService
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}/customers/family-members/${familyMemberId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Family member profile response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Family member profile retrieved:', result);
        return {
          success: true,
          familyMember: result,
          message: 'Family member profile retrieved successfully'
        };
      } else {
        const errorData = await response.json();
        console.error('Family member profile error:', errorData);
        return {
          success: false,
          message: errorData.message || 'Failed to get family member profile'
        };
      }
    } catch (error) {
      console.error('Family member profile service error:', error);
      return {
        success: false,
        message: error.message || 'Network error occurred'
      };
    }
  }
};
