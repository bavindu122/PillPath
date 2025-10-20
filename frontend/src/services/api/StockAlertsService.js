const API_BASE_URL = 'http://localhost:8080';

/**
 * Fetch low stock alerts for a pharmacy
 * @param {number} pharmacyId - The pharmacy ID
 * @returns {Promise<Array>} Array of stock alerts
 */
export const getStockAlerts = async (pharmacyId) => {
  try {
    console.log('📡 Fetching stock alerts for pharmacy:', pharmacyId);
    
    const response = await fetch(`${API_BASE_URL}/api/otc/pharmacy/${pharmacyId}/stock-alerts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stock alerts: ${response.status}`);
    }

    const alerts = await response.json();
    console.log('✅ Stock alerts loaded:', alerts.length);
    
    return alerts;
  } catch (error) {
    console.error('❌ Error fetching stock alerts:', error);
    throw error;
  }
};