import PharmacyService from './PharmacyService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

class ApiService {
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
      console.log('Making API request:', url, config);
      const response = await fetch(url, config);
      
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log('API response:', response.status, data);

      if (!response.ok) {
        // Handle different error formats from backend
        if (data && typeof data === 'object') {
          if (data.message) {
            throw new Error(data.message);
          } else if (data.error) {
            throw new Error(data.error);
          } else if (!data.success && data.errors) {
            // Handle validation errors
            const errorMessages = Array.isArray(data.errors) 
              ? data.errors.join(', ') 
              : Object.values(data.errors).join(', ');
            throw new Error(errorMessages);
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ✅ Customer registration - Updated to match exact DTO structure
  async registerCustomer(userData) {
    // ✅ Include ALL fields that match CustomerRegistrationRequest DTO
    const registrationRequest = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      dateOfBirth: userData.dateOfBirth,
      termsAccepted: userData.termsAccepted // ✅ Now included since it's in the DTO
    };

    console.log('Sending customer registration request:', registrationRequest);
    
    return this.request('customers/register', {
      method: 'POST',
      body: registrationRequest,
    });
  }

  // ✅ Pharmacy registration
  async registerPharmacy(pharmacyData) {
    return PharmacyService.registerPharmacy(pharmacyData);
  }

  // ✅ Customer login - Updated endpoint
  async login(credentials) {
    const loginRequest = {
      email: credentials.email,
      password: credentials.password
    };

    console.log('Sending login request:', loginRequest);
    
    return this.request('customers/login', {
      method: 'POST',
      body: loginRequest,
    });
  }

  // ✅ Get customer profile
  async getUserProfile() {
    return this.request('customers/profile', {
      method: 'GET',
    });
  }

  // ✅ Update customer profile
  async updateUserProfile(profileData) {
    return this.request('customers/profile', {
      method: 'PUT',
      body: profileData,
    });
  }

  // ✅ Customer logout
  async logout() {
    return this.request('customers/logout', {
      method: 'POST',
    });
  }
}

export default new ApiService();