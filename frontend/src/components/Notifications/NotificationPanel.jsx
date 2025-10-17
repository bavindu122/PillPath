import { forwardRef, useEffect, useRef } from 'react';
import { X, Check, Trash2, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/**
 * Notification panel dropdown with portal rendering
 * Displays notification list with scroll and actions
 */
const NotificationPanel = forwardRef(
  (
    {
      notifications,
      loading,
      unreadCount,
      onNotificationClick,
      onMarkAllRead,
      onDelete,
      onClose,
    },
    ref
  ) => {
    const firstFocusableRef = useRef(null);
    const lastFocusableRef = useRef(null);

    // Focus trap inside panel
    useEffect(() => {
      const handleTab = (e) => {
        if (e.key !== 'Tab') return;

        const focusableElements = ref.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      };

      document.addEventListener('keydown', handleTab);
      return () => document.removeEventListener('keydown', handleTab);
    }, [ref]);

    // Auto-focus first element when panel opens
    useEffect(() => {
      firstFocusableRef.current?.focus();
    }, []);

    const getNotificationIcon = (type) => {
      switch (type) {
        case 'success':
          return <Check className="w-5 h-5 text-green-500" />;
        case 'warning':
          return <Bell className="w-5 h-5 text-yellow-500" />;
        case 'error':
          return <X className="w-5 h-5 text-red-500" />;
        default:
          return <Bell className="w-5 h-5 text-blue-500" />;
      }
    };

    return (
      <div
        ref={ref}
        className="fixed top-20 right-4 w-96 max-w-[calc(100vw-2rem)]
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-lg shadow-2xl
          overflow-hidden
          z-[9999]
          animate-slideDown"
        style={{
          position: 'fixed',
          top: '80px',
          right: '16px',
          zIndex: 9999,
          maxHeight: 'calc(100vh - 100px)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-panel-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 z-10">
          <div className="flex items-center justify-between">
            <h2
              id="notification-panel-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({unreadCount} unread)
                </span>
              )}
            </h2>
            <button
              ref={firstFocusableRef}
              onClick={onClose}
              aria-label="Close notifications"
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700
                focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Mark All Read */}
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="mt-2 text-sm text-purple-600 dark:text-purple-400
                hover:text-purple-700 dark:hover:text-purple-300
                font-medium transition-colors
                focus:outline-none focus:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notification List */}
        <div
          className="overflow-y-auto"
          style={{
            maxHeight: 'calc(100vh - 200px)',
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-center">
                No notifications yet
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification, index) => (
                <li
                  key={notification.id}
                  className={`
                    group relative px-4 py-3
                    hover:bg-gray-50 dark:hover:bg-gray-700/50
                    transition-colors cursor-pointer
                    ${!notification.read ? 'bg-purple-50 dark:bg-purple-900/10' : ''}
                  `}
                  onClick={() => onNotificationClick(notification)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onNotificationClick(notification);
                    }
                  }}
                  aria-label={`Notification: ${notification.title}`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className={`text-sm font-medium ${
                            !notification.read
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mt-1"></span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(notification.id);
                      }}
                      aria-label={`Delete notification: ${notification.title}`}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100
                        p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600
                        focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-purple-500
                        transition-opacity"
                      ref={
                        index === notifications.length - 1
                          ? lastFocusableRef
                          : null
                      }
                    >
                      <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
);

NotificationPanel.displayName = 'NotificationPanel';

export default NotificationPanel;
