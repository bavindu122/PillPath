import ApiService from '../../../services/api/AuthService';

export const staffService = {
  // Get all staff members for a pharmacy
  getPharmacyStaff: async (pharmacyId, searchTerm = '') => {
    try {
      const searchParam = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
      const response = await ApiService.request(`pharmacy-admin/pharmacies/${pharmacyId}/staff${searchParam}`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error fetching pharmacy staff:', error);
      throw error;
    }
  },

  // Get a specific staff member
  getStaffMember: async (staffId) => {
    try {
      const response = await ApiService.request(`pharmacy-admin/staff/${staffId}`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error fetching staff member:', error);
      throw error;
    }
  },

  // Create a new staff member
  createStaffMember: async (staffData) => {
    try {
      const response = await ApiService.request('pharmacy-admin/staff', {
        method: 'POST',
        body: staffData
      });
      return response;
    } catch (error) {
      console.error('Error creating staff member:', error);
      throw error;
    }
  },

  // Update an existing staff member
  updateStaffMember: async (staffId, staffData) => {
    try {
      const response = await ApiService.request(`pharmacy-admin/staff/${staffId}`, {
        method: 'PUT',
        body: staffData
      });
      return response;
    } catch (error) {
      console.error('Error updating staff member:', error);
      throw error;
    }
  },

  // Delete a staff member
  deleteStaffMember: async (staffId) => {
    try {
      const response = await ApiService.request(`pharmacy-admin/staff/${staffId}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      console.error('Error deleting staff member:', error);
      throw error;
    }
  },

  // Toggle staff member status
  toggleStaffStatus: async (staffId, isActive) => {
    try {
      const response = await ApiService.request(`pharmacy-admin/staff/${staffId}/toggle-status`, {
        method: 'PATCH',
        body: { isActive }
      });
      return response;
    } catch (error) {
      console.error('Error toggling staff status:', error);
      throw error;
    }
  },

  // Get staff count for a pharmacy
  getStaffCount: async (pharmacyId) => {
    try {
      const response = await ApiService.request(`pharmacy-admin/pharmacies/${pharmacyId}/staff/count`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error fetching staff count:', error);
      throw error;
    }
  },

  // Verify if staff member belongs to pharmacy
  verifyStaffBelongsToPharmacy: async (pharmacyId, staffId) => {
    try {
      const response = await ApiService.request(`pharmacy-admin/pharmacies/${pharmacyId}/staff/${staffId}/verify`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error verifying staff membership:', error);
      throw error;
    }
  },

  // Upload profile picture for staff member - FIXED to handle the /api/v1 in base URL
  uploadProfilePicture: async (staffId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Use fetch directly since FormData needs special handling
      // Handle the /api/v1 in base URL by removing it for this endpoint
      const token = localStorage.getItem('auth_token');
      const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api/v1', ''); // Remove /api/v1
      const response = await fetch(`${baseUrl}/api/pharmacy-admin/staff/${staffId}/profile-picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload profile picture');
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  },

  // Remove profile picture for staff member
  removeProfilePicture: async (staffId) => {
    try {
      const response = await ApiService.request(`pharmacy-admin/staff/${staffId}/profile-picture`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      console.error('Error removing profile picture:', error);
      throw error;
    }
  },
};

export default staffService;