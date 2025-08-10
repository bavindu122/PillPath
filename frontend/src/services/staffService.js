import api from './api';

const staffService = {
  // Get all staff members for a pharmacy
  getStaffByPharmacy: async (pharmacyId) => {
    try {
      const response = await api.get(`/staff/pharmacy/${pharmacyId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch staff members');
    }
  },

  // Get active staff members for a pharmacy
  getActiveStaffByPharmacy: async (pharmacyId) => {
    try {
      const response = await api.get(`/staff/pharmacy/${pharmacyId}/active`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch active staff members');
    }
  },

  // Get staff member by ID
  getStaffById: async (staffId) => {
    try {
      const response = await api.get(`/staff/${staffId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch staff member');
    }
  },

  // Add new staff member
  addStaffMember: async (pharmacyId, staffData) => {
    try {
      const response = await api.post(`/staff/pharmacy/${pharmacyId}/add`, staffData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add staff member');
    }
  },

  // Update staff member
  updateStaffMember: async (staffId, staffData) => {
    try {
      const response = await api.put(`/staff/${staffId}`, staffData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update staff member');
    }
  },

  // Delete staff member
  deleteStaffMember: async (staffId) => {
    try {
      const response = await api.delete(`/staff/${staffId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete staff member');
    }
  }
};

export default staffService;
