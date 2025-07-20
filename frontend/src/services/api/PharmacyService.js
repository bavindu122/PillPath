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

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return;
      }

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Pharmacy API request failed:', error);
      throw error;
    }
  }

  // ✅ Pharmacy registration
  async registerPharmacy(pharmacyData) {
    console.log('Registering pharmacy with data:', pharmacyData);
    return this.request('pharmacies/register', {
      method: 'POST',
      body: pharmacyData,
    });
  }

  // Get pharmacy profile
  async getPharmacyProfile() {
    return this.request('pharmacies/profile', {
      method: 'GET',
    });
  }

  // Update pharmacy profile
  async updatePharmacyProfile(profileData) {
    return this.request('pharmacies/profile', {
      method: 'PUT',
      body: profileData,
    });
  }
}

export default new PharmacyService();