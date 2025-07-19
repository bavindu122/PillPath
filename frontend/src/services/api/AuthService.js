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
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Customer registration
  async registerCustomer(customerData) {
    return this.request('customers/register', {
      method: 'POST',
      body: customerData,
    });
  }

  // Pharmacy registration
  // async registerPharmacy(pharmacyData) {
  //   return this.request('auth/register/pharmacy', {
  //     method: 'POST',
  //     body: pharmacyData,
  //   });
  // }

  // // Login
  // async login(credentials) {
  //   return this.request('auth/login', {
  //     method: 'POST',
  //     body: credentials,
  //   });
  // }

  // // Get user profile
  // async getUserProfile() {
  //   return this.request('auth/profile', {
  //     method: 'GET',
  //   });
  // }
}

export default new ApiService();