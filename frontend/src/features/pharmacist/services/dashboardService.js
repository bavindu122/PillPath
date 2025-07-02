const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class DashboardService {
  _getHeaders() {
    return {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    };
  }

  _getUrl(endpoint) {
    return `${API_BASE_URL}${endpoint}`;
  }

  async getStats() {
    try {
      const response = await fetch(this._getUrl('/pharmacist/stats'), {
        headers: this._getHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  async getPrescriptionQueue() {
    try {
      const response = await fetch(`${API_BASE_URL}/pharmacist/prescriptions/queue`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch prescription queue');
      return await response.json();
    } catch (error) {
      console.error('Error fetching prescription queue:', error);
      throw error;
    }
  }

  async updatePrescriptionStatus(prescriptionId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/pharmacist/prescriptions/${prescriptionId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) throw new Error('Failed to update prescription status');
      return await response.json();
    } catch (error) {
      console.error('Error updating prescription status:', error);
      throw error;
    }
  }

  async getInventoryAlerts() {
    try {
      const response = await fetch(`${API_BASE_URL}/pharmacist/inventory/alerts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch inventory alerts');
      return await response.json();
    } catch (error) {
      console.error('Error fetching inventory alerts:', error);
      throw error;
    }
  }

  async getMessages() {
    try {
      const response = await fetch(`${API_BASE_URL}/pharmacist/messages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch messages');
      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }
}

export default new DashboardService();