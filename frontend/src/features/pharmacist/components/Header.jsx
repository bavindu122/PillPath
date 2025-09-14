import React, { useState, useRef, useEffect } from "react";
import { BellDot, ChevronDown, Shield, Building2 } from "lucide-react";
import ProfileDropdown from "../../pharmacy-admin/components/ProfileDropdown";
import { usePharmacyAuth } from "../../../hooks/usePharmacyAuth";

export default function Header({
  isSidebarOpen = false,
  setIsSidebarOpen = () => {},
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const dropdownRef = useRef(null);

  const { user, isPharmacyAdmin, pharmacyName, position, loading } =
    usePharmacyAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      // If click target is inside the anchor button container, keep dropdown
      if (dropdownRef.current && dropdownRef.current.contains(e.target)) {
        return;
      }
      // If click target is inside the portal dropdown, keep it open
      const inPortal = e.target.closest?.('[data-profile-dropdown="true"]');
      if (inPortal) return;
      setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setShowDropdown((s) => !s);

  return (
    <header className="sticky top-0 z-[200] flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8 rounded-b-lg">
      {/* Mobile menu button */}
      <button
        type="button"
        className="rounded-md p-2 text-gray-700 lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Left Section - Title and Pharmacy Info */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-800 hidden md:block">
            <span className="ml-2 text-sm font-normal text-gray-500">
              Pharmacist Panel
            </span>
          </h1>
          {pharmacyName && (
            <div className="hidden lg:flex items-center space-x-1 ml-2 mt-1">
              <Building2 className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">{pharmacyName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="ml-auto flex items-center space-x-4">
        {/* Welcome message - hidden on small screens */}
        <div className="hidden xl:block text-right">
          <p className="text-sm text-gray-600">Welcome back,</p>
          <p className="text-sm font-semibold text-gray-800 truncate max-w-[140px]">
            {user?.fullName || "User"}
          </p>
        </div>

        {/* Notification Bell */}
        <div className="relative group">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative">
            <BellDot className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </button>
        </div>

        {/* Profile Section */}
        <div className="relative z-[300]" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 group"
          >
            {/* Profile Image */}
            <div className="relative">
              {user?.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.fullName?.charAt(0) || "U"}
                </div>
              )}
              {isPharmacyAdmin && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <Shield className="w-2 h-2 text-white" />
                </div>
              )}
            </div>

            {/* User Info - hidden on mobile */}
            <div className="hidden sm:flex flex-col text-sm text-left">
              <span className="font-medium text-gray-800 truncate max-w-[120px]">
                {loading ? "Loading..." : user?.fullName || "User"}
              </span>
              <div className="flex items-center space-x-1">
                {isPharmacyAdmin && (
                  <Shield className="w-3 h-3 text-green-600" />
                )}
                <span className="text-gray-500 text-xs truncate max-w-[100px]">
                  {position || "Pharmacist"}
                </span>
              </div>
            </div>

            {/* Dropdown Arrow */}
            <ChevronDown
              className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-all duration-200 ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          <ProfileDropdown
            show={showDropdown}
            onClose={() => setShowDropdown(false)}
            anchorRef={dropdownRef}
          />
        </div>
      </div>
    </header>
  );
}
