import { tokenUtils } from '../../utils/tokenUtils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

class PharmacyService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}/${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add admin auth token for admin operations
    const adminAuthHeaders = tokenUtils.getAdminAuthHeaders();
    if (adminAuthHeaders.Authorization && !config.headers.Authorization) {
      config.headers = { ...config.headers, ...adminAuthHeaders };
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      console.log('Making Pharmacy API request:', url, config);
      const response = await fetch(url, config);
      
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log('Pharmacy API response:', response.status, data);

      if (!response.ok) {
        if (response.status === 401) {
          tokenUtils.removeAdminToken();
          window.location.href = '/admin/login';
          return;
        }
        
        if (data && typeof data === 'object') {
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
      console.error('Pharmacy API request failed:', error);
      throw error;
    }
  }

  // ✅ Get pharmacy statistics for admin dashboard
  async getPharmacyStats() {
    return this.request('admin/pharmacies/stats', {
      method: 'GET',
    });
  }

  // ✅ Get all pharmacies with pagination and filtering
  async getAllPharmacies(params = {}) {
    const defaultParams = {
      search: '',
      status: 'All',
      page: 0,
      size: 12,
      sortBy: 'createdAt',
      sortDir: 'desc',
    };
    
    const queryParams = { ...defaultParams, ...params };
    const searchParams = new URLSearchParams();
    
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return this.request(`admin/pharmacies?${searchParams.toString()}`, {
      method: 'GET',
    });
  }

  // ✅ Get pharmacy details by ID
  async getPharmacyById(pharmacyId) {
    return this.request(`admin/pharmacies/${pharmacyId}`, {
      method: 'GET',
    });
  }

  // ✅ Approve pharmacy registration (Updated to PUT)
  async approvePharmacy(pharmacyId) {
    return this.request(`admin/pharmacies/${pharmacyId}/approve`, {
      method: 'PUT',
      body: {}, // Empty body as per your backend spec
    });
  }

  // ✅ Reject pharmacy registration (Updated to PUT)
  async rejectPharmacy(pharmacyId, reason) {
    return this.request(`admin/pharmacies/${pharmacyId}/reject`, {
      method: 'PUT',
      body: { reason },
    });
  }

  // ✅ Suspend pharmacy (Updated to PUT)
  async suspendPharmacy(pharmacyId, reason) {
    return this.request(`admin/pharmacies/${pharmacyId}/suspend`, {
      method: 'PUT',
      body: { reason },
    });
  }

  // ✅ Activate pharmacy (Updated to PUT)
  async activatePharmacy(pharmacyId) {
    return this.request(`admin/pharmacies/${pharmacyId}/activate`, {
      method: 'PUT',
      body: {}, // Empty body as per your backend spec
    });
  }

  // ✅ Generic pharmacy management method using PharmacyManagementDTO
  async managePharmacy(pharmacyId, action, reason = null) {
    const body = {
      pharmacyId: parseInt(pharmacyId),
      action: action, // "approve", "reject", "suspend", "activate"
    };
    
    if (reason) {
      body.reason = reason;
    }

    return this.request(`admin/pharmacies/${pharmacyId}/manage`, {
      method: 'PUT',
      body,
    });
  }

  // ✅ Batch pharmacy operations
  async batchManagePharmacies(operations) {
    return this.request('admin/pharmacies/batch', {
      method: 'PUT',
      body: operations, // Array of PharmacyManagementDTO objects
    });
  }
}

export default new PharmacyService();