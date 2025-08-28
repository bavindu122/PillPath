import ApiService from '../../../services/api/AuthService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const familyService = {
  // Add new family member
  addFamilyMember: async (memberData) => {
    try {
      console.log('=== ADDING FAMILY MEMBER ===');
      console.log('Member data:', memberData);
      console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
      
      // Transform frontend data to match DTO structure
      const memberDTO = {
        name: memberData.name,
        relation: memberData.relation,
        age: parseInt(memberData.age),
        profilePicture: memberData.profilePicture || null,
        email: memberData.email || null,
        phone: memberData.phone || null,
        lastPrescriptionDate: memberData.lastPrescriptionDate || null,
        activePrescriptions: memberData.activePrescriptions || 0,
        totalPrescriptions: memberData.totalPrescriptions || 0,
        allergies: memberData.allergies ? memberData.allergies.filter(allergy => allergy.trim() !== "") : [],
        bloodType: memberData.bloodType || null,
        medicalConditions: memberData.medicalConditions ? memberData.medicalConditions.filter(condition => condition.trim() !== "") : [],
        currentMedications: memberData.currentMedications || []
      };
      
      console.log('Transformed DTO:', memberDTO);
      
      // Use ApiService request method for consistency
      const result = await ApiService.request('customers/family-members', {
        method: 'POST',
        body: memberDTO,
      });
      
      console.log('Add family member successful:', result);
      return result;
      
    } catch (error) {
      console.error('Add family member failed:', error);
      
      // Check if this is a development environment or backend is not ready
      const isDevelopment = import.meta.env.DEV;
      const isBackendNotReady = error.message.includes('404') || error.message.includes('fetch');
      
      if (isDevelopment && isBackendNotReady) {
        console.warn('Backend not available, using mock data for development');
        // Return mock data for development
        return {
          ...memberData,
          id: Date.now(), // Use timestamp as mock ID
          lastPrescriptionDate: memberData.lastPrescriptionDate || new Date().toISOString().split('T')[0],
          activePrescriptions: 0,
          totalPrescriptions: 0
        };
      }
      
      throw error;
    }
  },

  // Get all family members
  getFamilyMembers: async () => {
    try {
      console.log('=== FETCHING FAMILY MEMBERS ===');
      
      const result = await ApiService.request('customers/family-members', {
        method: 'GET',
      });
      
      console.log('Fetch family members successful:', result);
      return result;
      
    } catch (error) {
      console.error('Fetch family members failed:', error);
      throw error;
    }
  },

  // Update family member
  updateFamilyMember: async (memberId, memberData) => {
    try {
      console.log('=== UPDATING FAMILY MEMBER ===');
      console.log('Member ID:', memberId, 'Data:', memberData);
      
      // Transform frontend data to match DTO structure
      const memberDTO = {
        name: memberData.name,
        relation: memberData.relation,
        age: parseInt(memberData.age),
        profilePicture: memberData.profilePicture || null,
        email: memberData.email || null,
        phone: memberData.phone || null,
        lastPrescriptionDate: memberData.lastPrescriptionDate || null,
        activePrescriptions: memberData.activePrescriptions || 0,
        totalPrescriptions: memberData.totalPrescriptions || 0,
        allergies: memberData.allergies ? memberData.allergies.filter(allergy => allergy.trim() !== "") : [],
        bloodType: memberData.bloodType || null,
        medicalConditions: memberData.medicalConditions ? memberData.medicalConditions.filter(condition => condition.trim() !== "") : [],
        currentMedications: memberData.currentMedications || []
      };
      
      const result = await ApiService.request(`customers/family-members/${memberId}`, {
        method: 'PUT',
        body: memberDTO,
      });
      
      console.log('Update family member successful:', result);
      return result;
      
    } catch (error) {
      console.error('Update family member failed:', error);
      throw error;
    }
  },

  // Delete family member
  deleteFamilyMember: async (memberId) => {
    try {
      console.log('=== DELETING FAMILY MEMBER ===');
      console.log('Member ID:', memberId);
      
      const result = await ApiService.request(`customers/family-members/${memberId}`, {
        method: 'DELETE',
      });
      
      console.log('Delete family member successful:', result);
      return result;
      
    } catch (error) {
      console.error('Delete family member failed:', error);
      throw error;
    }
  },

  // Get family member by ID
  getFamilyMember: async (memberId) => {
    try {
      console.log('=== FETCHING FAMILY MEMBER ===');
      console.log('Member ID:', memberId);
      
      const result = await ApiService.request(`customers/family-members/${memberId}`, {
        method: 'GET',
      });
      
      console.log('Fetch family member successful:', result);
      return result;
      
    } catch (error) {
      console.error('Fetch family member failed:', error);
      throw error;
    }
  }
};
