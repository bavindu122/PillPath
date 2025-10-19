import { forwardRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Trash2, Bell, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useNotifications } from '../../contexts/NotificationsContext';
import { useAuth } from '../../hooks/useAuth';

/**
 * NotificationsDropdown Component
 * Reusable dropdown panel that can be anchored to any bell button
 * 
 * @param {Object} props
 * @param {React.RefObject} props.anchorRef - Reference to the button that triggered the dropdown
 * @param {boolean} props.isOpen - Whether the dropdown is open
 * @param {Function} props.onClose - Callback to close the dropdown
 * @param {string} props.position - Position relative to anchor: 'left' | 'right' (default: 'right')
 */
const NotificationsDropdown = forwardRef(
  ({ anchorRef, isOpen, onClose, position = 'right' }, ref) => {
    const location = useLocation();
    const {
      notifications,
      unreadCount,
      loading,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      refresh,
    } = useNotifications();

    const { userType } = useAuth();
    const navigate = useNavigate();
    const firstFocusableRef = useRef(null);
    const lastFocusableRef = useRef(null);

    // Close dropdown on route change
    useEffect(() => {
      if (isOpen) {
        onClose();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    // Focus trap inside panel
    useEffect(() => {
      if (!isOpen) return;

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
    }, [isOpen, ref]);

    // Auto-focus first element when panel opens
    useEffect(() => {
      if (isOpen) {
        firstFocusableRef.current?.focus();
      }
    }, [isOpen]);

    // Calculate position based on anchor
    const getDropdownStyle = () => {
      if (!anchorRef?.current) {
        return {
          position: 'fixed',
          top: '80px',
          right: '16px',
        };
      }

      const rect = anchorRef.current.getBoundingClientRect();
      const dropdownWidth = 384; // 24rem
      const dropdownMaxHeight = window.innerHeight * 0.6; // 60vh
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const isMobile = viewportWidth < 1024; // lg breakpoint
      
      // Check if anchor is in the bottom half of the screen (likely floating nav)
      const isBottomAnchor = rect.top > viewportHeight / 2;
      
      // Determine if we should open upward
      const shouldOpenUpward = isMobile && isBottomAnchor;
      
      // Calculate vertical position
      let verticalPosition;
      if (shouldOpenUpward) {
        // Open upward: position bottom of dropdown above the anchor with gap
        const bottomPosition = viewportHeight - rect.top + 8; // 8px gap
        verticalPosition = { bottom: `${bottomPosition}px` };
        
        // Ensure dropdown doesn't overflow top of viewport
        const dropdownTop = rect.top - dropdownMaxHeight - 8;
        if (dropdownTop < 16) {
          // If it would overflow, limit the height and add top constraint
          verticalPosition = {
            bottom: `${bottomPosition}px`,
            top: '16px',
          };
        }
      } else {
        // Open downward (default desktop behavior)
        verticalPosition = { top: `${rect.bottom + 8}px` };
      }

      // Calculate horizontal position
      let horizontalPosition;
      if (position === 'left') {
        horizontalPosition = { right: `${viewportWidth - rect.right}px` };
      } else {
        // Default: right-aligned
        horizontalPosition = { right: `${viewportWidth - rect.right}px` };
      }
      
      // Ensure dropdown doesn't overflow horizontally on mobile
      if (isMobile) {
        const leftEdge = viewportWidth - rect.right;
        if (leftEdge < 16) {
          horizontalPosition = { right: '16px', left: '16px' };
        }
      }

      return {
        position: 'fixed',
        ...verticalPosition,
        ...horizontalPosition,
      };
    };

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

    const handleNotificationClick = (notification) => {
      // Mark as read first
      if (!notification.read) {
        markAsRead(notification.id);
      }

      // Navigate if notification has a link
      if (notification.link) {
        try {
          let destinationPath = notification.link;
          
          // Transform old notification links to match current frontend routes
          // This handles notifications created before the route update
          
          // 1. Old prescription link: /pharmacist/prescriptions/{id} → /pharmacist/review/{id}
          if (destinationPath.match(/^\/pharmacist\/prescriptions\/\d+$/)) {
            const prescriptionId = destinationPath.match(/\/prescriptions\/(\d+)$/)[1];
            destinationPath = `/pharmacist/review/${prescriptionId}`;
          }
          
          // 1b. Handle malformed prescription links with non-numeric IDs
          if (destinationPath.match(/^\/pharmacist\/prescriptions\/[^\d]/)) {
            // Malformed link - check if notification has prescriptionId
            if (notification.prescriptionId) {
              destinationPath = `/pharmacist/review/${notification.prescriptionId}`;
            } else {
              // No prescription ID available - go to prescriptions list
              destinationPath = '/pharmacist/prescriptions';
              toast('Opening prescriptions page...', { icon: '📋', duration: 2000 });
            }
          }
          
          // 2. Old order preview link: /customer/orders/{orderId}/preview → /customer/order-preview/{prescriptionId}
          if (destinationPath.match(/^\/customer\/orders\/\d+\/preview$/)) {
            if (notification.prescriptionId) {
              destinationPath = `/customer/order-preview/${notification.prescriptionId}`;
            } else {
              // Fallback if prescriptionId not available
              destinationPath = '/customer/activities';
              toast('Opening your activities page...', { icon: 'ℹ️', duration: 2000 });
            }
          }
          
          // 3. Old order status link: /customer/orders/{numericId} → use orderCode if available
          if (destinationPath.match(/^\/customer\/orders\/\d+$/)) {
            if (notification.orderCode) {
              // Use orderCode from notification
              destinationPath = `/customer/orders/${notification.orderCode}`;
            } else {
              // No orderCode available - this is an old notification
              // Navigate to orders list instead
              destinationPath = '/customer/orders';
              toast('Opening your orders page...', { icon: '📦', duration: 2000 });
            }
          }
          
          // 4. Enhance order preview links with pharmacyId query parameter if available
          if (destinationPath.startsWith('/customer/order-preview/') && notification.pharmacyId) {
            const query = new URLSearchParams({ pharmacyId: String(notification.pharmacyId) });
            destinationPath = `${destinationPath}?${query.toString()}`;
          }
          
          // 4b. Pharmacist pharmacy prescriptions: ensure we preserve query and add state
          if (destinationPath.startsWith('/pharmacist/prescriptions/pharmacy/')) {
            // Keep any existing query string (e.g., ?prescriptionId=123)
            const [basePath, qs] = destinationPath.split('?');
            const params = new URLSearchParams(qs || '');
            // If notification carried IDs, ensure they're reflected in state
            const prescId = notification.prescriptionId || params.get('prescriptionId');
            // Recompose destinationPath to be safe
            destinationPath = basePath + (qs ? `?${qs}` : '');
            // We'll pass state later with prescriptionId/pharmacyId to help the page focus
            // Save to temp for state payload
            notification.___prescriptionIdForNav = prescId ? Number(prescId) : undefined;
          }

          // Validate that the link matches user's role
          const isCustomerLink = destinationPath.startsWith('/customer');
          const isPharmacistLink = destinationPath.startsWith('/pharmacist');
          const isPharmacyAdminLink = destinationPath.startsWith('/pharmacy-admin');
          
          // Determine if user has permission for this link
          const hasPermission = 
            (isCustomerLink && userType === 'customer') ||
            (isPharmacistLink && (userType === 'pharmacist' || userType === 'pharmacy-admin')) ||
            (isPharmacyAdminLink && userType === 'pharmacy-admin');

          if (!hasPermission) {
            // User doesn't have permission for this link
            toast.error("You don't have access to this page");
            
            // Navigate to user's home page instead
            const homePage = 
              userType === 'customer' ? '/customer/dashboard' :
              userType === 'pharmacy-admin' ? '/pharmacist/dashboard' :
              userType === 'pharmacist' ? '/pharmacist/dashboard' :
              '/';
            
            navigate(homePage);
            onClose();
            return;
          }

          // Permission validated - navigate using React Router
          // Pass notification data in state for components that need it
          const navigationState = {
            fromNotification: true,
            notificationId: notification.id,
          };
          
          // Add relevant IDs to state based on notification type
          const prescIdFromQuery = (() => {
            try {
              const url = new URL(destinationPath, window.location.origin);
              const v = url.searchParams.get('prescriptionId');
              return v ? Number(v) : undefined;
            } catch { return undefined; }
          })();
          const effectivePrescId = notification.___prescriptionIdForNav || notification.prescriptionId || prescIdFromQuery;
          if (effectivePrescId) {
            navigationState.prescriptionId = Number(effectivePrescId);
            navigationState.fallback = {
              id: Number(effectivePrescId),
              submissionId: Number(effectivePrescId),
            };
          }
          if (notification.orderId) {
            navigationState.orderId = notification.orderId;
          }
          if (notification.orderCode) {
            navigationState.orderCode = notification.orderCode;
          }
          if (notification.pharmacyId) {
            navigationState.pharmacyId = notification.pharmacyId;
          }
          
          navigate(destinationPath, { state: navigationState });
          onClose(); // Close dropdown after navigation
        } catch (error) {
          console.error('Navigation error:', error);
          toast.error('Unable to navigate. Opening relevant page...');
          
          // Navigate to fallback page based on user type and notification context
          let fallbackPage;
          
          if (userType === 'customer') {
            // For customers, go to activities if it's prescription/order related, otherwise dashboard
            fallbackPage = notification.prescriptionId || notification.orderId 
              ? '/customer/activities' 
              : '/customer/dashboard';
            
            // Show helpful message
            if (notification.prescriptionId) {
              toast('Opening your prescriptions...', { icon: '📋', duration: 2000 });
            } else if (notification.orderId) {
              toast('Opening your orders...', { icon: '📦', duration: 2000 });
            }
          } else if (userType === 'pharmacist' || userType === 'pharmacy-admin') {
            // For pharmacists, go to queue if prescription-related, orders if order-related
            if (notification.prescriptionId) {
              fallbackPage = '/pharmacist/queue';
              toast('Opening prescription queue...', { icon: '💊', duration: 2000 });
            } else if (notification.orderId) {
              fallbackPage = '/pharmacist/orders';
              toast('Opening order history...', { icon: '📦', duration: 2000 });
            } else {
              fallbackPage = '/pharmacist/dashboard';
            }
          } else {
            fallbackPage = '/';
          }
          
          navigate(fallbackPage);
          onClose();
        }
      } else {
        // No link - just close the dropdown
        onClose();
      }
    };

    if (!isOpen) return null;

    // Determine animation direction based on anchor position
    const getAnimationClass = () => {
      if (!anchorRef?.current) return 'animate-slideDown';
      
      const rect = anchorRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const isMobile = viewportWidth < 1024; // lg breakpoint
      const isBottomAnchor = rect.top > viewportHeight / 2;
      
      return isMobile && isBottomAnchor ? 'animate-slideUp' : 'animate-slideDown';
    };

    return createPortal(
      <div
        ref={ref}
        className={`w-96 max-w-[calc(100vw-2rem)]
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-lg shadow-2xl
          overflow-hidden
          z-[9999]
          ${getAnimationClass()}`}
        style={{
          ...getDropdownStyle(),
          zIndex: 9999,
          maxHeight: '60vh',
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

          {/* Actions */}
          <div className="flex items-center gap-3 mt-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-purple-600 dark:text-purple-400
                  hover:text-purple-700 dark:hover:text-purple-300
                  font-medium transition-colors
                  focus:outline-none focus:underline"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={refresh}
              className="text-sm text-gray-600 dark:text-gray-400
                hover:text-gray-700 dark:hover:text-gray-300
                font-medium transition-colors flex items-center gap-1
                focus:outline-none focus:underline"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div
          className="overflow-y-auto"
          style={{
            maxHeight: 'calc(60vh - 100px)',
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
                  onClick={() => handleNotificationClick(notification)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleNotificationClick(notification);
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
                        deleteNotification(notification.id);
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
      </div>,
      document.body
    );
  }
);

NotificationsDropdown.displayName = 'NotificationsDropdown';

export default NotificationsDropdown;
