const API_BASE_URL = 'http://localhost:8080';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  const token = localStorage.getItem('token') || 
                localStorage.getItem('authToken') || 
                localStorage.getItem('pharmacyAdminToken') ||
                localStorage.getItem('accessToken') ||
                localStorage.getItem('jwtToken');
  
  console.log('🔑 Dashboard - Token retrieved:', token ? 'Present ✅' : 'Not found ❌');
  return token;
};

/**
 * Get authentication headers
 */
const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token && token !== 'undefined' && token !== 'null') {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('🔐 Dashboard - Authorization header added');
  } else {
    console.warn('⚠️ Dashboard - No valid token found');
  }
  
  return headers;
};

/**
 * Fetch dashboard statistics
 * @param {number} pharmacyAdminId - The pharmacy admin ID
 * @returns {Promise<Object>} Dashboard statistics
 */
export const getDashboardStatistics = async (pharmacyAdminId = 1) => {
  try {
    console.log('📊 Fetching dashboard statistics for pharmacy admin:', pharmacyAdminId);
    
    const url = `${API_BASE_URL}/api/v1/pharmacy/dashboard/${pharmacyAdminId}/statistics`;
    
    console.log('🌐 Request URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      throw new Error(`Failed to fetch dashboard statistics: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Dashboard statistics loaded:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching dashboard statistics:', error);
    throw error;
  }
};