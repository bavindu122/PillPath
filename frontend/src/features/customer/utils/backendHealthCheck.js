// Backend Health Check Utility
// Use this to test if your backend endpoints are working

export const backendHealthCheck = {
  // Check if backend is running
  checkBackendHealth: async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
    
    try {
      console.log('=== BACKEND HEALTH CHECK ===');
      console.log('Checking URL:', API_BASE_URL);
      
      // Try to reach a simple endpoint
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log('✅ Backend is reachable');
        return { healthy: true, status: response.status };
      } else {
        console.log('⚠️ Backend responded but with error:', response.status);
        return { healthy: false, status: response.status, error: 'Non-200 response' };
      }
      
    } catch (error) {
      console.log('❌ Backend is not reachable:', error.message);
      return { healthy: false, error: error.message };
    }
  },

  // Check specific family members endpoint
  checkFamilyEndpoint: async () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
    const token = localStorage.getItem('auth_token');
    
    try {
      console.log('=== FAMILY ENDPOINT CHECK ===');
      console.log('Checking URL:', `${API_BASE_URL}/customers/family-members`);
      console.log('Token available:', !!token);
      
      const response = await fetch(`${API_BASE_URL}/customers/family-members`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.status === 404) {
        console.log('❌ Family members endpoint not found');
        return { exists: false, error: 'Endpoint not found' };
      } else if (response.status === 401) {
        console.log('🔒 Authentication required');
        return { exists: true, authenticated: false, error: 'Authentication required' };
      } else if (response.ok) {
        console.log('✅ Family members endpoint is working');
        const data = await response.json();
        return { exists: true, authenticated: true, data };
      } else {
        console.log('⚠️ Unexpected response:', response.status);
        return { exists: true, error: `Status ${response.status}` };
      }
      
    } catch (error) {
      console.log('❌ Error checking family endpoint:', error.message);
      return { exists: false, error: error.message };
    }
  },

  // Test adding a family member
  testAddMember: async () => {
    const testMember = {
      name: "Test Member",
      relation: "Other",
      age: 25,
      email: "test@example.com",
      phone: "+1234567890",
      allergies: ["None"],
      bloodType: "O+",
      medicalConditions: ["None"],
      currentMedications: []
    };

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
    const token = localStorage.getItem('auth_token');
    
    try {
      console.log('=== TESTING ADD MEMBER ===');
      console.log('Test data:', testMember);
      
      const response = await fetch(`${API_BASE_URL}/customers/family-members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(testMember),
      });
      
      console.log('Add member test response:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Add member test successful:', data);
        return { success: true, data };
      } else {
        const errorText = await response.text();
        console.log('❌ Add member test failed:', response.status, errorText);
        return { success: false, status: response.status, error: errorText };
      }
      
    } catch (error) {
      console.log('❌ Add member test error:', error.message);
      return { success: false, error: error.message };
    }
  }
};

// Convenience function to run all checks
export const runAllHealthChecks = async () => {
  console.log('🔍 Running backend health checks...');
  
  const healthCheck = await backendHealthCheck.checkBackendHealth();
  const familyCheck = await backendHealthCheck.checkFamilyEndpoint();
  
  return {
    backend: healthCheck,
    familyEndpoint: familyCheck,
    summary: {
      backendReachable: healthCheck.healthy,
      familyEndpointExists: familyCheck.exists,
      authenticated: familyCheck.authenticated
    }
  };
};
