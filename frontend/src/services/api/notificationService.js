import api from '../api';

/**
 * Notification Service
 * Handles all notification-related API calls
 */
const notificationService = {
  /**
   * Get all notifications for the current user
   * @param {number} userId - The user ID
   * @param {string} userType - The user type (CUSTOMER, PHARMACIST, PHARMACY)
   * @returns {Promise<Object>} { notifications: Array, unreadCount: Number }
   */
  async getNotifications(userId, userType) {
    try {
      const response = await api.get(`/notifications?userId=${userId}&userType=${userType}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  /**
   * Mark a notification as read
   * @param {string|number} notificationId - The notification ID
   * @returns {Promise<Object>}
   */
  async markAsRead(notificationId) {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   * @param {number} userId - The user ID
   * @param {string} userType - The user type (CUSTOMER, PHARMACIST, PHARMACY)
   * @returns {Promise<Object>}
   */
  async markAllAsRead(userId, userType) {
    try {
      const response = await api.put(`/notifications/read-all?userId=${userId}&userType=${userType}`);
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Delete a notification
   * @param {string|number} notificationId - The notification ID
   * @returns {Promise<Object>}
   */
  async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  /**
   * Get unread notification count
   * @returns {Promise<number>}
   */
  async getUnreadCount() {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data.count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },
};

export default notificationService;
