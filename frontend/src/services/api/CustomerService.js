import ApiService from './AuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const customerService = {
  // Upload profile picture
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      console.log('=== UPLOADING PROFILE PICTURE ===');
      console.log('File details:', { name: file.name, size: file.size, type: file.type });
      
      // Get token using the same method as ApiService
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${API_BASE_URL}/customers/profile/upload-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it automatically with boundary
        },
        body: formData
      });
      
      console.log('Upload response status:', response.status);
      
      // Handle response
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          return;
        }
        
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Upload successful:', result);
      return result;
      
    } catch (error) {
      console.error('Profile picture upload failed:', error);
      throw error;
    }
  },

  // Update profile data using ApiService
  updateProfile: async (profileData) => {
    try {
      console.log('=== UPDATING PROFILE ===');
      console.log('Profile data:', profileData);
      
      // Use ApiService request method for consistency
      const result = await ApiService.request('customers/profile', {
        method: 'PUT',
        body: profileData,
      });
      
      console.log('Profile update successful:', result);
      return result;
      
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  },

  // Get customer profile using ApiService
  getProfile: async () => {
    try {
      console.log('=== FETCHING PROFILE ===');
      
      // Use ApiService request method for consistency
      const result = await ApiService.request('customers/profile', {
        method: 'GET',
      });
      
      console.log('Profile fetch successful:', result);
      return result;
      
    } catch (error) {
      console.error('Profile fetch failed:', error);
      throw error;
    }
  }
};