import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Bell } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import useNotifications from '../../hooks/useNotifications';
import useClickOutside from '../../hooks/useClickOutside';

/**
 * Floating notification bell component with fixed positioning
 * Renders on all pages for authenticated users
 */
const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);
  const panelRef = useRef(null);
  
  const { 
    notifications, 
    unreadCount, 
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications
  } = useNotifications();

  // Close panel on outside click
  useClickOutside([bellRef, panelRef], () => {
    if (isOpen) setIsOpen(false);
  });

  // Close panel on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        bellRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Close panel on route change
  useEffect(() => {
    const handleRouteChange = () => setIsOpen(false);
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Auto-refresh notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refreshNotifications();
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, [refreshNotifications]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Optional: Navigate to notification target
    if (notification.link) {
      window.location.href = notification.link;
    }
  };

  return (
    <>
      {/* Fixed Bell Button */}
      <div
        ref={bellRef}
        className="fixed top-4 right-4 z-[9999]"
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 9999,
        }}
      >
        <button
          onClick={handleToggle}
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
          aria-expanded={isOpen}
          aria-haspopup="true"
          className={`
            relative p-3 rounded-full
            bg-white dark:bg-gray-800
            border-2 border-gray-200 dark:border-gray-700
            shadow-lg hover:shadow-xl
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
            ${isOpen ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-400' : ''}
            hover:scale-105 active:scale-95
          `}
        >
          <Bell
            className={`w-6 h-6 transition-colors ${
              isOpen
                ? 'text-purple-600 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          />
          
          {/* Unread Count Badge */}
          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 flex items-center justify-center
                min-w-[20px] h-5 px-1
                text-xs font-bold text-white
                bg-red-500 rounded-full
                border-2 border-white dark:border-gray-800
                shadow-md
                animate-pulse"
              style={{
                transform: 'translate(25%, -25%)',
              }}
              aria-label={`${unreadCount} unread notifications`}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notification Panel (Portaled) */}
      {isOpen &&
        createPortal(
          <NotificationPanel
            ref={panelRef}
            notifications={notifications}
            loading={loading}
            unreadCount={unreadCount}
            onNotificationClick={handleNotificationClick}
            onMarkAllRead={markAllAsRead}
            onDelete={deleteNotification}
            onClose={() => setIsOpen(false)}
          />,
          document.body
        )}
    </>
  );
};

export default NotificationBell;
