import { useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationsContext';
import NotificationsDropdown from './NotificationsDropdown';
import useClickOutside from '../../hooks/useClickOutside';

/**
 * FloatingBell Component
 * Fixed-position notification bell that floats in the top-right corner
 * ONLY displayed for customers (not pharmacists or pharmacy admins)
 * 
 * Usage:
 * - Shows on customer routes when no navbar bell is present
 * - Fixed position: top-right corner (16px from edges)
 * - High z-index to appear above other content
 */
const FloatingBell = () => {
  const { unreadCount } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const bellRef = useRef(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useClickOutside([bellRef, dropdownRef], closeDropdown);

  // Close dropdown on ESC key
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && isDropdownOpen) {
      closeDropdown();
      bellRef.current?.focus();
    }
  };

  return (
    <>
      {/* Floating Bell Button */}
      <button
        ref={bellRef}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isDropdownOpen}
        aria-haspopup="dialog"
        className="fixed top-4 right-4
          p-3 rounded-full
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          shadow-lg hover:shadow-xl
          hover:scale-105 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
          transition-all duration-200
          z-[9998]
          group"
        style={{
          top: '16px',
          right: '16px',
          zIndex: 9998,
        }}
      >
        {/* Bell Icon */}
        <div className="relative">
          <Bell
            className={`w-6 h-6 text-gray-700 dark:text-gray-300
              group-hover:text-purple-600 dark:group-hover:text-purple-400
              transition-colors
              ${unreadCount > 0 ? 'animate-bellRing' : ''}`}
          />
          
          {/* Unread Badge */}
          {unreadCount > 0 && (
            <span
              className="absolute -top-2 -right-2
                flex items-center justify-center
                min-w-[20px] h-5 px-1.5
                text-xs font-bold text-white
                bg-red-500 rounded-full
                border-2 border-white dark:border-gray-800
                animate-badgePulse"
              aria-label={`${unreadCount} unread notifications`}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </button>

      {/* Notifications Dropdown */}
      <NotificationsDropdown
        ref={dropdownRef}
        anchorRef={bellRef}
        isOpen={isDropdownOpen}
        onClose={closeDropdown}
        position="right"
      />
    </>
  );
};

export default FloatingBell;
