const API_BASE_URL = 'http://localhost:8080';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  // Try different possible token storage keys
  const token = localStorage.getItem('token') || 
                localStorage.getItem('authToken') || 
                localStorage.getItem('pharmacyAdminToken') ||
                localStorage.getItem('accessToken') ||
                localStorage.getItem('jwtToken');
  
  console.log('🔑 Token retrieved:', token ? 'Present ✅' : 'Not found ❌');
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
    console.log('🔐 Authorization header added');
  } else {
    console.warn('⚠️ No valid token found - making request without authentication');
  }
  
  return headers;
};

/**
 * Fetch all pharmacy orders
 * @param {string} status - Optional filter by status
 * @returns {Promise<Array>} Array of pharmacy orders
 */
export const getPharmacyOrders = async (status = null) => {
  try {
    console.log('📡 Fetching pharmacy orders...');
    
    const url = status 
      ? `${API_BASE_URL}/api/v1/orders/pharmacy?status=${status}`
      : `${API_BASE_URL}/api/v1/orders/pharmacy`;
    
    console.log('🌐 Request URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    console.log('📥 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }

    const orders = await response.json();
    console.log('✅ Pharmacy orders loaded:', orders.length);
    
    return orders;
  } catch (error) {
    console.error('❌ Error fetching pharmacy orders:', error);
    throw error;
  }
};

/**
 * Get a specific pharmacy order by ID
 * @param {number} pharmacyOrderId - The order ID
 * @returns {Promise<Object>} Order details
 */
export const getPharmacyOrderById = async (pharmacyOrderId) => {
  try {
    console.log('📡 Fetching pharmacy order:', pharmacyOrderId);
    
    const response = await fetch(
      `${API_BASE_URL}/api/v1/orders/pharmacy/${pharmacyOrderId}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      throw new Error(`Order not found: ${response.status}`);
    }

    const order = await response.json();
    console.log('✅ Order loaded:', order);
    
    return order;
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    throw error;
  }
};

/**
 * Update pharmacy order status
 * @param {number} pharmacyOrderId - The order ID
 * @param {string} newStatus - The new status
 * @returns {Promise<Object>} Updated order
 */
export const updatePharmacyOrderStatus = async (pharmacyOrderId, newStatus) => {
  try {
    console.log(`📝 Updating order ${pharmacyOrderId} to status: ${newStatus}`);
    
    const response = await fetch(
      `${API_BASE_URL}/api/v1/orders/pharmacy/${pharmacyOrderId}/status`,
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Error updating status:', error);
      throw new Error(error.error || 'Failed to update status');
    }

    const updated = await response.json();
    console.log('✅ Status updated successfully');
    return updated;
  } catch (error) {
    console.error('❌ Error updating status:', error);
    throw error;
  }
};

/**
 * Pharmacy Order Status enum
 */
export const PharmacyOrderStatus = {
  RECEIVED: 'RECEIVED',
  PREPARING: 'PREPARING',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  HANDED_OVER: 'HANDED_OVER',
  CANCELLED: 'CANCELLED',
};

/**
 * Get status display info
 */
export const getStatusInfo = (status) => {
  const statusMap = {
    RECEIVED: { label: 'Received', color: '#2196F3', icon: '📥' },
    PREPARING: { label: 'Preparing', color: '#FF9800', icon: '⚡' },
    READY_FOR_PICKUP: { label: 'Ready', color: '#4CAF50', icon: '✅' },
    HANDED_OVER: { label: 'Completed', color: '#9C27B0', icon: '🎉' },
    CANCELLED: { label: 'Cancelled', color: '#f44336', icon: '❌' },
  };
  return statusMap[status] || { label: status, color: '#666', icon: '❓' };
};






































// // filepath: d:\Pillpath\PillPath\frontend\src\services\api\PharmacyOrderService.js
// const API_BASE_URL = 'http://localhost:8080';

// /**
//  * Fetch all pharmacy orders for the authenticated pharmacy admin
//  * @param {string} token - JWT token for pharmacy admin (optional for testing)
//  * @param {string} status - Optional filter by status
//  * @returns {Promise<Array>} Array of pharmacy orders
//  */
// export const getPharmacyOrders = async (token, status = null) => {
//   try {
//     console.log('📡 Fetching pharmacy orders...');
//     console.log('🔑 Token:', token ? 'Present' : 'Not provided');
    
//     const url = status 
//       ? `${API_BASE_URL}/api/v1/orders/pharmacy?status=${status}`
//       : `${API_BASE_URL}/api/v1/orders/pharmacy`;
    
//     const headers = {
//       'Content-Type': 'application/json',
//     };
    
//     // ✅ Only add Authorization if token exists and is valid
//     if (token && token !== 'undefined' && token !== 'null') {
//       headers['Authorization'] = `Bearer ${token}`;
//       console.log('🔐 Authorization header added');
//     } else {
//       console.log('⚠️ No valid token - making request without authentication');
//     }
    
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: headers,
//     });

//     console.log('📥 Response status:', response.status);

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('❌ Error response:', errorText);
//       throw new Error(`Failed to fetch orders: ${response.status}`);
//     }

//     const orders = await response.json();
//     console.log('✅ Pharmacy orders loaded:', orders.length);
    
//     return orders;
//   } catch (error) {
//     console.error('❌ Error fetching pharmacy orders:', error);
//     throw error;
//   }
// };

// /**
//  * Get a specific pharmacy order by ID
//  */
// export const getPharmacyOrderById = async (token, pharmacyOrderId) => {
//   try {
//     const headers = {
//       'Content-Type': 'application/json',
//     };
    
//     if (token && token !== 'undefined' && token !== 'null') {
//       headers['Authorization'] = `Bearer ${token}`;
//     }
    
//     const response = await fetch(
//       `${API_BASE_URL}/api/v1/orders/pharmacy/${pharmacyOrderId}`,
//       {
//         method: 'GET',
//         headers: headers,
//       }
//     );

//     if (!response.ok) {
//       throw new Error('Order not found');
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('❌ Error fetching order:', error);
//     throw error;
//   }
// };

// /**
//  * Update pharmacy order status
//  */
// export const updatePharmacyOrderStatus = async (token, pharmacyOrderId, newStatus) => {
//   try {
//     console.log(`📝 Updating order ${pharmacyOrderId} to status: ${newStatus}`);
    
//     const headers = {
//       'Content-Type': 'application/json',
//     };
    
//     if (token && token !== 'undefined' && token !== 'null') {
//       headers['Authorization'] = `Bearer ${token}`;
//     }
    
//     const response = await fetch(
//       `${API_BASE_URL}/api/v1/orders/pharmacy/${pharmacyOrderId}/status`,
//       {
//         method: 'PATCH',
//         headers: headers,
//         body: JSON.stringify({ status: newStatus }),
//       }
//     );

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to update status');
//     }

//     const updated = await response.json();
//     console.log('✅ Status updated successfully');
//     return updated;
//   } catch (error) {
//     console.error('❌ Error updating status:', error);
//     throw error;
//   }
// };

// /**
//  * Pharmacy Order Status enum
//  */
// export const PharmacyOrderStatus = {
//   RECEIVED: 'RECEIVED',
//   PREPARING: 'PREPARING',
//   READY_FOR_PICKUP: 'READY_FOR_PICKUP',
//   HANDED_OVER: 'HANDED_OVER',
//   CANCELLED: 'CANCELLED',
// };

// /**
//  * Get status display info
//  */
// export const getStatusInfo = (status) => {
//   const statusMap = {
//     RECEIVED: { label: 'Received', color: '#2196F3', icon: '📥' },
//     PREPARING: { label: 'Preparing', color: '#FF9800', icon: '⚡' },
//     READY_FOR_PICKUP: { label: 'Ready', color: '#4CAF50', icon: '✅' },
//     HANDED_OVER: { label: 'Completed', color: '#9C27B0', icon: '🎉' },
//     CANCELLED: { label: 'Cancelled', color: '#f44336', icon: '❌' },
//   };
//   return statusMap[status] || { label: status, color: '#666', icon: '❓' };
// };










































// const API_BASE_URL = 'http://localhost:8080';

// /**
//  * Fetch all pharmacy orders for the authenticated pharmacy admin
//  * @param {string} token - JWT token for pharmacy admin
//  * @param {string} status - Optional filter by status
//  * @returns {Promise<Array>} Array of pharmacy orders
//  */
// export const getPharmacyOrders = async (token, status = null) => {
//   try {
//     console.log('📡 Fetching pharmacy orders...');
    
//     const url = status 
//       ? `${API_BASE_URL}/api/v1/orders/pharmacy?status=${status}`
//       : `${API_BASE_URL}/api/v1/orders/pharmacy`;
    
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch orders: ${response.status}`);
//     }

//     const orders = await response.json();
//     console.log('✅ Pharmacy orders loaded:', orders.length);
    
//     return orders;
//   } catch (error) {
//     console.error('❌ Error fetching pharmacy orders:', error);
//     throw error;
//   }
// };

// /**
//  * Get a specific pharmacy order by ID
//  */
// export const getPharmacyOrderById = async (token, pharmacyOrderId) => {
//   try {
//     const response = await fetch(
//       `${API_BASE_URL}/api/v1/orders/pharmacy/${pharmacyOrderId}`,
//       {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error('Order not found');
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('❌ Error fetching order:', error);
//     throw error;
//   }
// };

// /**
//  * Update pharmacy order status
//  */
// export const updatePharmacyOrderStatus = async (token, pharmacyOrderId, newStatus) => {
//   try {
//     console.log(`📝 Updating order ${pharmacyOrderId} to status: ${newStatus}`);
    
//     const response = await fetch(
//       `${API_BASE_URL}/api/v1/orders/pharmacy/${pharmacyOrderId}/status`,
//       {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status: newStatus }),
//       }
//     );

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to update status');
//     }

//     const updated = await response.json();
//     console.log('✅ Status updated successfully');
//     return updated;
//   } catch (error) {
//     console.error('❌ Error updating status:', error);
//     throw error;
//   }
// };

// /**
//  * Pharmacy Order Status enum
//  */
// export const PharmacyOrderStatus = {
//   RECEIVED: 'RECEIVED',
//   PREPARING: 'PREPARING',
//   READY_FOR_PICKUP: 'READY_FOR_PICKUP',
//   HANDED_OVER: 'HANDED_OVER',
//   CANCELLED: 'CANCELLED',
// };

// /**
//  * Get status display info
//  */
// export const getStatusInfo = (status) => {
//   const statusMap = {
//     RECEIVED: { label: 'Received', color: '#2196F3', icon: '📥' },
//     PREPARING: { label: 'Preparing', color: '#FF9800', icon: '⚡' },
//     READY_FOR_PICKUP: { label: 'Ready', color: '#4CAF50', icon: '✅' },
//     HANDED_OVER: { label: 'Completed', color: '#9C27B0', icon: '🎉' },
//     CANCELLED: { label: 'Cancelled', color: '#f44336', icon: '❌' },
//   };
//   return statusMap[status] || { label: status, color: '#666', icon: '❓' };
// };