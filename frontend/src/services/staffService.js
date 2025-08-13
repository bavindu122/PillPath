import api from './api.js';

const staffService = {
  // Get all staff members for a pharmacy
async getStaffByPharmacy(pharmacyId) {
  try {
    console.log(`Fetching staff for pharmacy ${pharmacyId}`);
    
    // Debug authentication
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    console.log('Auth token exists:', !!token);
    console.log('User data:', user ? JSON.parse(user) : null);
    
    // Verify the token is being sent in headers
    console.log('Request headers:', {
      'Authorization': token ? `Bearer ${token}` : 'No token',
      'Content-Type': 'application/json'
    });
    
    // Updated endpoint to match backend PharmacyAdminController
    const response = await api.get(`/pharmacy-admin/pharmacies/${pharmacyId}/staff`);
    console.log('Staff members fetched successfully:', response.data);
    return response.data;
  } catch (error) {
      console.error('Error fetching staff members:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // More specific error handling
      if (error.response?.status === 403) {
        throw new Error('Access denied. You may not have permission to view staff for this pharmacy.');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication expired. Please log in again.');
      } else if (error.response?.status === 404) {
        throw new Error('Pharmacy not found or has no staff members.');
      } else {
        throw new Error(error.response?.data?.message || 'Failed to fetch staff members');
      }
    }
  },

  // Add a new staff member to a pharmacy
  async addStaffMember(pharmacyId, staffData) {
    try {
      console.log(`Adding staff member to pharmacy ${pharmacyId}:`, staffData);
      
      // Prepare request body to match PharmacistCreateRequest DTO
      const requestBody = {
        firstName: staffData.firstName,
        lastName: staffData.lastName,
        email: staffData.email,
        password: staffData.password,
        phoneNumber: staffData.phoneNumber,
        position: staffData.position,
        licenseNumber: staffData.licenseNumber,
        pharmacyId: parseInt(pharmacyId), // Ensure it's a number
      };

      // Updated endpoint to match backend PharmacyAdminController
      const response = await api.post('/pharmacy-admin/staff', requestBody);
      console.log('Staff member added successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding staff member:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 403) {
        throw new Error('Access denied. You may not have permission to add staff members.');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication expired. Please log in again.');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Invalid staff member data.');
      } else {
        throw new Error(error.response?.data?.message || 'Failed to add staff member');
      }
    }
  },

  // Update staff member information
  async updateStaffMember(staffId, staffData) {
    try {
      console.log(`Updating staff member ${staffId}:`, staffData);
      
      const requestBody = {
        firstName: staffData.firstName,
        lastName: staffData.lastName,
        email: staffData.email,
        phoneNumber: staffData.phoneNumber,
        position: staffData.position,
        licenseNumber: staffData.licenseNumber,
      };

      const response = await api.put(`/pharmacy-admin/staff/${staffId}`, requestBody);
      console.log('Staff member updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating staff member:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Access denied. You may not have permission to update staff members.');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication expired. Please log in again.');
      } else if (error.response?.status === 404) {
        throw new Error('Staff member not found.');
      } else {
        throw new Error(error.response?.data?.message || 'Failed to update staff member');
      }
    }
  },

  // Delete a staff member
  async deleteStaffMember(staffId) {
    try {
      console.log(`Deleting staff member ${staffId}`);
      const response = await api.delete(`/pharmacy-admin/staff/${staffId}`);
      console.log('Staff member deleted successfully');
      return response.data;
    } catch (error) {
      console.error('Error deleting staff member:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Access denied. You may not have permission to delete staff members.');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication expired. Please log in again.');
      } else if (error.response?.status === 404) {
        throw new Error('Staff member not found.');
      } else {
        throw new Error(error.response?.data?.message || 'Failed to delete staff member');
      }
    }
  }
};

export default staffService;