import React, { useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, ShoppingBag, MapPin, Phone, User, Info, Bell } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useNotifications } from "../../../contexts/NotificationsContext";
import NotificationsDropdown from "../../Notifications/NotificationsDropdown";
import useClickOutside from "../../../hooks/useClickOutside";

const MobileFloatingNav = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const bellRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/otc", label: "OTC Store", icon: ShoppingBag },
    { path: "/services", label: "Services", icon: MapPin },
    { path: "/find-pharmacy", label: "Find Pharmacies", icon: Info },
    { path: "/contact", label: "Contact", icon: Phone },
    { path: "/customer", label: "Profile", icon: User },
  ];

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
      {/* Mobile Navigation Bar */}
      <div className="block lg:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="navbar-bg-mobile-menu rounded-xl border navbar-border-light p-2">
          <nav className="flex justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="relative flex flex-col items-center justify-center py-1 px-2"
                >
                  <div
                    className={`p-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? "navbar-blue-bg navbar-text-white shadow-md"
                        : "navbar-text-secondary hover:navbar-blue-text"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  
                  <span
                    className={`text-[10px] mt-1 transition-all duration-300 ${
                      isActive ? "navbar-blue-text font-medium" : "navbar-text-secondary"
                    }`}
                  >
                    {item.label}
                  </span>
                  
                  {isActive && (
                    <span className="absolute -bottom-2 w-1 h-1 navbar-blue-bg rounded-full"></span>
                  )}
                </NavLink>
              );
            })}
            
            {/* Notification Bell for Mobile */}
            {isAuthenticated && (
              <button
                ref={bellRef}
                onClick={toggleDropdown}
                onKeyDown={handleKeyDown}
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
                aria-expanded={isDropdownOpen}
                aria-haspopup="dialog"
                className="relative flex flex-col items-center justify-center py-1 px-2"
              >
                <div className="p-2 rounded-full transition-all duration-300 navbar-text-secondary hover:navbar-blue-text">
                  <Bell 
                    size={20} 
                    className={unreadCount > 0 ? 'animate-bellRing' : ''}
                  />
                  
                  {/* Unread Badge */}
                  {unreadCount > 0 && (
                    <span
                      className="absolute top-1 right-1
                        flex items-center justify-center
                        min-w-[18px] h-[18px] px-1
                        text-xs font-bold text-white
                        bg-red-500 rounded-full
                        border-2 border-white
                        animate-badgePulse"
                      aria-label={`${unreadCount} unread notifications`}
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
                
                <span className="text-[10px] mt-1 transition-all duration-300 navbar-text-secondary">
                  Alerts
                </span>
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Notifications Dropdown for Mobile */}
      {isAuthenticated && (
        <NotificationsDropdown
          ref={dropdownRef}
          anchorRef={bellRef}
          isOpen={isDropdownOpen}
          onClose={closeDropdown}
          position="right"
        />
      )}
    </>
  );
};

export default MobileFloatingNav;