import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import notificationService from '../services/api/notificationService';

/**
 * Notifications Context
 * Provides global notification state and actions
 */
const NotificationsContext = createContext(null);

/**
 * NotificationsProvider Component
 * Manages notification state and provides it to the app
 */
export const NotificationsProvider = ({ children }) => {
  const { user, userType, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch notifications from API
   */
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !user || !userType) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get user ID based on user type
      const userId = user.customerId || user.id;
      const apiUserType = userType === 'pharmacy-admin' ? 'PHARMACIST' : 
                          userType === 'pharmacist' ? 'PHARMACIST' : 
                          'CUSTOMER';
      
      const data = await notificationService.getNotifications(userId, apiUserType);
      
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message || 'Failed to load notifications');
      
      // Set fallback empty state
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, userType]);

  /**
   * Mark a single notification as read
   */
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated || !user || !userType) return;

    try {
      const userId = user.customerId || user.id;
      const apiUserType = userType === 'pharmacy-admin' ? 'PHARMACIST' : 
                          userType === 'pharmacist' ? 'PHARMACIST' : 
                          'CUSTOMER';
      
      await notificationService.markAllAsRead(userId, apiUserType);
      
      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }, [isAuthenticated, user, userType]);

  /**
   * Delete a notification
   */
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      
      // Update local state
      const deletedNotif = notifications.find((n) => n.id === notificationId);
      
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notificationId)
      );
      
      if (deletedNotif && !deletedNotif.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  }, [notifications]);

  /**
   * Refresh notifications (manual trigger)
   */
  const refresh = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /**
   * Auto-refresh notifications periodically (60 seconds)
   */
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

/**
 * useNotifications Hook
 * Access notification state and actions from context
 */
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  
  return context;
};

export default NotificationsContext;
