import { useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationsContext';
import NotificationsDropdown from './NotificationsDropdown';
import useClickOutside from '../../hooks/useClickOutside';

/**
 * NavbarBell Component
 * Notification bell icon for navbar integration
 * Can be used by ANY role (customers, pharmacists, pharmacy admins)
 * 
 * Usage:
 * - Place in navbar/header component
 * - Opens dropdown panel on click
 * - Shows unread count badge
 * 
 * @param {Object} props
 * @param {string} props.position - Dropdown position: 'left' | 'right' (default: 'left')
 * @param {string} props.className - Additional CSS classes for the button
 */
const NavbarBell = ({ position = 'left', className = '' }) => {
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
      {/* Navbar Bell Button */}
      <button
        ref={bellRef}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isDropdownOpen}
        aria-haspopup="dialog"
        className={`
          relative p-2 rounded-lg
          text-gray-700 dark:text-gray-300
          hover:bg-gray-100 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-purple-500
          transition-colors
          ${className}
        `}
      >
        {/* Bell Icon */}
        <div className="relative">
          <Bell
            className={`w-6 h-6
              ${unreadCount > 0 ? 'animate-bellRing' : ''}`}
          />
          
          {/* Unread Badge */}
          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1
                flex items-center justify-center
                min-w-[18px] h-[18px] px-1
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
        position={position}
      />
    </>
  );
};

export default NavbarBell;
