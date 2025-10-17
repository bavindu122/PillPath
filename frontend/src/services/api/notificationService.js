import api from '../api';

/**
 * Notification Service
 * Handles all notification-related API calls
 */
const notificationService = {
  /**
   * Get all notifications for the current user
   * @returns {Promise<Object>} { notifications: Array, unreadCount: Number }
   */
  async getNotifications() {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      // Return fallback data for development/testing
      if (process.env.NODE_ENV === 'development') {
        return {
          notifications: this.getMockNotifications(),
          unreadCount: 3,
        };
      }
      
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
      
      // Silent fail in development
      if (process.env.NODE_ENV === 'development') {
        return { success: true };
      }
      
      throw error;
    }
  },

  /**
   * Mark all notifications as read
   * @returns {Promise<Object>}
   */
  async markAllAsRead() {
    try {
      const response = await api.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      
      // Silent fail in development
      if (process.env.NODE_ENV === 'development') {
        return { success: true };
      }
      
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
      
      // Silent fail in development
      if (process.env.NODE_ENV === 'development') {
        return { success: true };
      }
      
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
      
      // Return fallback count for development
      if (process.env.NODE_ENV === 'development') {
        return 3;
      }
      
      throw error;
    }
  },

  /**
   * Mock notifications for development/testing
   * @private
   */
  getMockNotifications() {
    return [
      {
        id: 1,
        type: 'success',
        title: 'Prescription Ready',
        message: 'Your prescription is ready for pickup at Main Street Pharmacy.',
        link: '/customer/prescriptions/123',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
      },
      {
        id: 2,
        type: 'info',
        title: 'New Pharmacy Added',
        message: 'A new pharmacy has been added near your location.',
        link: '/customer/find-pharmacy',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      },
      {
        id: 3,
        type: 'warning',
        title: 'Medication Reminder',
        message: 'Remember to take your evening medication at 8:00 PM.',
        link: null,
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      },
      {
        id: 4,
        type: 'success',
        title: 'Order Confirmed',
        message: 'Your order #12345 has been confirmed and is being processed.',
        link: '/customer/orders/12345',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      },
      {
        id: 5,
        type: 'info',
        title: 'Account Update',
        message: 'Your profile has been successfully updated.',
        link: '/customer/profile',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      },
    ];
  },
};

export default notificationService;
