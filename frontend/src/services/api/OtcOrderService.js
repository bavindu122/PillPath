const API_BASE_URL = 'http://localhost:8080/api/otc-orders';

export const orderService = {
  /**
   * Create a new order
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>} Created order
   */
  createOrder: async (orderData) => {
    try {
      console.log('🚀 Sending order request to:', API_BASE_URL);
      
      // ✅ Transform the data to match backend expectations
      const transformedData = {
        customerId: orderData.customerId,
        paymentMethod: orderData.paymentMethod || 'CASH',  // ✅ Backend accepts: CASH, CREDIT_CARD, DEBIT_CARD, DIGITAL_WALLET, INSURANCE
        deliveryAddress: orderData.deliveryAddress || 'Default Address',
        notes: orderData.notes || '',
        items: [{  // ✅ Create items array
          otcProductId: orderData.productId,  // ✅ Map productId to otcProductId
          pharmacyId: orderData.pharmacyId,
          quantity: orderData.quantity
        }]
      };
      
      console.log('📦 Transformed order data:', transformedData);

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData)  // ✅ Send transformed data
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Order created successfully:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Error creating order:', error);
      throw error;
    }
  },

  /**
   * Get customer orders
   * @param {number} customerId - Customer ID
   * @returns {Promise<Array>} List of orders
   */
  getCustomerOrders: async (customerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/${customerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  },

  /**
   * Get pharmacy orders
   * @param {number} pharmacyId - Pharmacy ID
   * @returns {Promise<Array>} List of orders
   */
  getPharmacyOrders: async (pharmacyId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pharmacy/${pharmacyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching pharmacy orders:', error);
      throw error;
    }
  },
};





























// const API_BASE_URL = 'http://localhost:8080/api/otc-orders';

// export const orderService = {
//   /**
//    * Create a new OTC order
//    * @param {Object} orderData - Order details
//    * @returns {Promise<Object>} Order response
//    */
//   createOrder: async (orderData) => {
//     try {
//       console.log('🚀 Sending order request to:', API_BASE_URL);
//       console.log('📦 Order data:', orderData);

//       const response = await fetch(API_BASE_URL, {
//         method: 'POST',
//         mode: 'cors',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(orderData),
//       });

//       console.log('📡 Response status:', response.status);
//       console.log('📡 Response ok:', response.ok);

//       // Handle 403 Forbidden
//       if (response.status === 403) {
//         throw new Error('Backend is blocking the request. Please configure CORS and Security.');
//       }

//       // Handle 401 Unauthorized
//       if (response.status === 401) {
//         throw new Error('Please login to place an order.');
//       }

//       // Handle other error responses
//       if (!response.ok) {
//         let errorMessage = 'Failed to create order';
//         try {
//           const errorData = await response.json();
//           errorMessage = errorData.message || errorData.error || errorMessage;
//         } catch (e) {
//           errorMessage = `Server error: ${response.status} ${response.statusText}`;
//         }
//         throw new Error(errorMessage);
//       }

//       // Parse successful response
//       const contentType = response.headers.get('content-type');
//       if (contentType && contentType.includes('application/json')) {
//         const data = await response.json();
//         console.log('✅ Order created successfully:', data);
//         return data;
//       } else {
//         // Handle empty or non-JSON response
//         console.log('✅ Order created (no JSON response)');
//         return { 
//           orderId: 'ORD-' + Date.now(), 
//           status: 'SUCCESS',
//           message: 'Order created successfully' 
//         };
//       }
//     } catch (error) {
//       console.error('❌ Error creating order:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get customer orders
//    * @param {number} customerId - Customer ID
//    * @returns {Promise<Array>} List of orders
//    */
//   getCustomerOrders: async (customerId) => {
//     try {
//       console.log('📥 Fetching orders for customer:', customerId);

//       const response = await fetch(`${API_BASE_URL}/customer/${customerId}`, {
//         method: 'GET',
//         mode: 'cors',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch customer orders');
//       }

//       const data = await response.json();
//       console.log('✅ Customer orders fetched:', data);
//       return data;
//     } catch (error) {
//       console.error('❌ Error fetching customer orders:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get pharmacy orders
//    * @param {number} pharmacyId - Pharmacy ID
//    * @returns {Promise<Array>} List of orders
//    */
//   getPharmacyOrders: async (pharmacyId) => {
//     try {
//       console.log('📥 Fetching orders for pharmacy:', pharmacyId);

//       const response = await fetch(`${API_BASE_URL}/pharmacy/${pharmacyId}`, {
//         method: 'GET',
//         mode: 'cors',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch pharmacy orders');
//       }

//       const data = await response.json();
//       console.log('✅ Pharmacy orders fetched:', data);
//       return data;
//     } catch (error) {
//       console.error('❌ Error fetching pharmacy orders:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get order by ID
//    * @param {string} orderId - Order ID
//    * @returns {Promise<Object>} Order details
//    */
//   getOrderById: async (orderId) => {
//     try {
//       console.log('📥 Fetching order:', orderId);

//       const response = await fetch(`${API_BASE_URL}/${orderId}`, {
//         method: 'GET',
//         mode: 'cors',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch order details');
//       }

//       const data = await response.json();
//       console.log('✅ Order details fetched:', data);
//       return data;
//     } catch (error) {
//       console.error('❌ Error fetching order details:', error);
//       throw error;
//     }
//   },

//   /**
//    * Update order status
//    * @param {string} orderId - Order ID
//    * @param {string} status - New status
//    * @returns {Promise<Object>} Updated order
//    */
//   updateOrderStatus: async (orderId, status) => {
//     try {
//       console.log('🔄 Updating order status:', orderId, status);

//       const response = await fetch(`${API_BASE_URL}/${orderId}/status`, {
//         method: 'PATCH',
//         mode: 'cors',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update order status');
//       }

//       const data = await response.json();
//       console.log('✅ Order status updated:', data);
//       return data;
//     } catch (error) {
//       console.error('❌ Error updating order status:', error);
//       throw error;
//     }
//   },

//   /**
//    * Cancel order
//    * @param {string} orderId - Order ID
//    * @returns {Promise<Object>} Cancelled order
//    */
//   cancelOrder: async (orderId) => {
//     try {
//       console.log('❌ Cancelling order:', orderId);

//       const response = await fetch(`${API_BASE_URL}/${orderId}/cancel`, {
//         method: 'POST',
//         mode: 'cors',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to cancel order');
//       }

//       const data = await response.json();
//       console.log('✅ Order cancelled:', data);
//       return data;
//     } catch (error) {
//       console.error('❌ Error cancelling order:', error);
//       throw error;
//     }
//   },
// };

// export default orderService;





























































// const API_BASE_URL = 'http://localhost:8080/api/otc-orders';

// export const orderService = {
//   createOrder: async (orderData) => {
//     try {
//       console.log('🚀 Sending order request to:', API_BASE_URL);
//       console.log('📦 Order data:', orderData);

//       // ✅ Get authentication token from localStorage
//       const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      
//       const headers = {
//         'Content-Type': 'application/json',
//       };

//       // ✅ Add Authorization header if token exists
//       if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//         console.log('🔑 Token added to request');
//       } else {
//         console.warn('⚠️ No authentication token found');
//       }

//       const response = await fetch(API_BASE_URL, {
//         method: 'POST',
//         headers: headers,
//         body: JSON.stringify(orderData),
//       });

//       console.log('📡 Response status:', response.status);
//       console.log('📡 Response ok:', response.ok);

//       // ✅ Handle 403 Forbidden specifically
//       if (response.status === 403) {
//         throw new Error('Access forbidden. Please login and try again.');
//       }

//       // ✅ Handle 401 Unauthorized
//       if (response.status === 401) {
//         throw new Error('Please login to place an order.');
//       }

//       if (!response.ok) {
//         let errorMessage = 'Failed to create order';
//         try {
//           const errorData = await response.json();
//           errorMessage = errorData.message || errorMessage;
//         } catch (e) {
//           errorMessage = `Server error: ${response.status} ${response.statusText}`;
//         }
//         throw new Error(errorMessage);
//       }

//       const contentType = response.headers.get('content-type');
//       if (contentType && contentType.includes('application/json')) {
//         return await response.json();
//       } else {
//         return { 
//           orderId: 'TEMP-' + Date.now(), 
//           status: 'SUCCESS',
//           message: 'Order created successfully' 
//         };
//       }
//     } catch (error) {
//       console.error('❌ Error creating order:', error);
//       throw error;
//     }
//   },

//   getCustomerOrders: async (customerId) => {
//     try {
//       const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
//       const headers = {
//         'Content-Type': 'application/json',
//       };

//       if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//       }

//       const response = await fetch(`${API_BASE_URL}/customer/${customerId}`, {
//         method: 'GET',
//         headers: headers,
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch orders');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching customer orders:', error);
//       throw error;
//     }
//   },

//   getPharmacyOrders: async (pharmacyId) => {
//     try {
//       const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
//       const headers = {
//         'Content-Type': 'application/json',
//       };

//       if (token) {
//         headers['Authorization'] = `Bearer ${token}`;
//       }

//       const response = await fetch(`${API_BASE_URL}/pharmacy/${pharmacyId}`, {
//         method: 'GET',
//         headers: headers,
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch orders');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching pharmacy orders:', error);
//       throw error;
//     }
//   },
// };




























































// const API_BASE_URL = 'http://localhost:8080/api/otc-orders';

// export const orderService = {
//   /**
//    * Create a new OTC order
//    * @param {Object} orderData - Order details
//    * @returns {Promise<Object>} Order response
//    */
//   createOrder: async (orderData) => {
//     try {
//       console.log('🚀 Sending order request to:', API_BASE_URL);
//       console.log('📦 Order data:', orderData);

//       const response = await fetch(API_BASE_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           // Add authentication token if needed
//           // 'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(orderData),
//       });

//       console.log('📡 Response status:', response.status);
//       console.log('📡 Response ok:', response.ok);

//       // ✅ Handle 403 Forbidden specifically
//       if (response.status === 403) {
//         throw new Error('Access forbidden. Please check CORS configuration or authentication.');
//       }

//       if (!response.ok) {
//         // ✅ Try to parse error response, but handle empty responses
//         let errorMessage = 'Failed to create order';
//         try {
//           const errorData = await response.json();
//           errorMessage = errorData.message || errorMessage;
//         } catch (e) {
//           // If JSON parsing fails, use status text
//           errorMessage = `Server error: ${response.status} ${response.statusText}`;
//         }
//         throw new Error(errorMessage);
//       }

//       // ✅ Check if response has content before parsing
//       const contentType = response.headers.get('content-type');
//       if (contentType && contentType.includes('application/json')) {
//         return await response.json();
//       } else {
//         // If backend returns empty response or HTML, return a default success
//         return { 
//           orderId: 'TEMP-' + Date.now(), 
//           status: 'SUCCESS',
//           message: 'Order created successfully' 
//         };
//       }
//     } catch (error) {
//       console.error('❌ Error creating order:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get customer orders
//    * @param {number} customerId - Customer ID
//    * @returns {Promise<Array>} List of orders
//    */
//   getCustomerOrders: async (customerId) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/customer/${customerId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch orders');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching customer orders:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get pharmacy orders
//    * @param {number} pharmacyId - Pharmacy ID
//    * @returns {Promise<Array>} List of orders
//    */
//   getPharmacyOrders: async (pharmacyId) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/pharmacy/${pharmacyId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch orders');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching pharmacy orders:', error);
//       throw error;
//     }
//   },
// };









































// const API_BASE_URL = 'http://localhost:8080/api/otc-orders';

// export const orderService = {
//   /**
//    * Create a new OTC order
//    * @param {Object} orderData - Order details
//    * @returns {Promise<Object>} Order response
//    */
//   createOrder: async (orderData) => {
//     try {
//       const response = await fetch(API_BASE_URL, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           // Add authentication token if needed
//           // 'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(orderData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to create order');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error creating order:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get customer orders
//    * @param {number} customerId - Customer ID
//    * @returns {Promise<Array>} List of orders
//    */
//   getCustomerOrders: async (customerId) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/customer/${customerId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch orders');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching customer orders:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get pharmacy orders
//    * @param {number} pharmacyId - Pharmacy ID
//    * @returns {Promise<Array>} List of orders
//    */
//   getPharmacyOrders: async (pharmacyId) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/pharmacy/${pharmacyId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch orders');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching pharmacy orders:', error);
//       throw error;
//     }
//   },
// };