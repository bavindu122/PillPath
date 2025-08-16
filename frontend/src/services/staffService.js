import api from './api';

const staffService = {
  // Get all staff members for a pharmacy
  getPharmacyStaff: async (pharmacyId) => {
    try {
      const response = await api.get(`/pharmacy/${pharmacyId}/staff`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pharmacy staff:', error);
      throw error;
    }
  },

  // Add a new staff member to a pharmacy
  addStaffMember: async (pharmacyId, staffData) => {
    try {
      const response = await api.post(`/pharmacy/${pharmacyId}/staff`, staffData);
      return response.data;
    } catch (error) {
      console.error('Error adding staff member:', error);
      throw error;
    }
  },

  // Update an existing staff member
  updateStaffMember: async (staffId, staffData) => {
    try {
      const response = await api.put(`/staff/${staffId}`, staffData);
      return response.data;
    } catch (error) {
      console.error('Error updating staff member:', error);
      throw error;
    }
  },

  // Delete a staff member
  deleteStaffMember: async (staffId) => {
    try {
      const response = await api.delete(`/staff/${staffId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting staff member:', error);
      throw error;
    }
  },

  // Get staff member by ID
  getStaffMemberById: async (staffId) => {
    try {
      const response = await api.get(`/staff/${staffId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching staff member:', error);
      throw error;
    }
  },

  // Get all staff members (admin function)
  getAllStaff: async () => {
    try {
      const response = await api.get('/staff');
      return response.data;
    } catch (error) {
      console.error('Error fetching all staff:', error);
      throw error;
    }
  }
};

export default staffService;