import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";

import DesktopNav from "./components/DesktopNav";
import ProfileDropdown from "./components/ProfileDropdown";
import MobileFloatingNav from "./components/MobileFloatingNav";
import NavbarBell from "../Notifications/NavbarBell";
import { useAuth } from "../../hooks/useAuth";
import ProfileImage from "../common/ProfileImage";

const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { logout, isAuthenticated, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const handleMouseEnter = () => setShowDropdown(true);
  const handleMouseLeave = () => setShowDropdown(false);

  return (
    <>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      />
      <div className="h-[72px] md:h-[60px]"></div>

      {/* Top Navigation Bar */}
      <div
        className={`fixed top-0 left-0 right-0 flex items-center justify-between text-sm py-2 z-40 transition-all duration-300 ${
          scrolled ? "navbar-bg-scrolled" : "navbar-bg-default"
        }`}
      >
        {/* Logo */}
        <img
          className="w-32 sm:w-36 md:w-44 cursor-pointer ml-4 md:ml-6"
          src={assets.logo1}
          alt="logo"
          onClick={() => navigate("/")}
        />

        {/* Desktop Navigation */}
        <DesktopNav />
        
        <div className="hidden md:flex items-center gap-4 mr-6">
          {isAuthenticated ? (
            <div className="flex items-center gap-5">
              {/* User greeting */}
              <div className="hidden lg:block text-right">
                <p className="text-sm navbar-text-welcome font-medium">
                  Welcome back,
                </p>
                <p className="text-sm navbar-text-username font-semibold truncate max-w-[140px]">
                  {user?.fullName || user?.firstName || "User"}
                </p>
              </div>

              {/* Notification bell */}
              <NavbarBell position="left" />

              {/* Profile section */}
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex items-center gap-2 cursor-pointer group p-1 rounded-full navbar-hover-bg transition-all duration-200">
                  <ProfileImage
                    src={user?.profilePictureUrl}
                    alt="profile"
                    className="navbar-avatar rounded-full shadow-sm"
                    onClick={toggleDropdown}
                  />
                  <svg
                    className="w-4 h-4 navbar-text-muted group-hover:navbar-blue-text transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <ProfileDropdown show={showDropdown} setToken={setToken} />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Sign in button */}
              <button
                onClick={() => navigate("/login")}
                className="group relative px-6 py-2.5 lg:px-8 lg:py-3 navbar-btn-outline rounded-full font-medium whitespace-nowrap overflow-hidden"
              >
                <span className="relative z-10 font-semibold">Sign in</span>
                <div className="absolute inset-0 navbar-gradient-blue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>

              {/* Create account button */}
              <button
                onClick={() => navigate("/register")}
                className="group relative px-6 py-2.5 lg:px-8 lg:py-3 navbar-btn-filled rounded-full font-semibold whitespace-nowrap overflow-hidden"
              >
                <span className="relative z-10">Create account</span>
                <div className="absolute inset-0 navbar-gradient-blue-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 navbar-gradient-shine -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Header Actions */}
        <div className="md:hidden flex items-center gap-4 mr-4">
          {isAuthenticated ? (
            <ProfileImage
              src={user?.profilePictureUrl}
              alt="profile"
              className="navbar-avatar-mobile rounded-full cursor-pointer"
              onClick={toggleDropdown}
            />
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="navbar-btn-outline px-4 py-2 rounded-full font-light whitespace-nowrap text-sm"
            >
              Sign in
            </button>
          )}
          <Menu
            className="w-6 h-6 cursor-pointer navbar-text-primary"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          />
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="md:hidden absolute top-full left-0 right-0 navbar-bg-mobile-menu rounded-b-2xl z-50 p-4 border-t border-gray-100">
            <div className="flex flex-col gap-3 font-medium navbar-text-primary">
              <button
                onClick={handleLogout}
                className="px-4 py-3 rounded-xl bg-gray-100 hover:bg-primary hover:text-white transition-all duration-300 text-left flex items-center gap-3"
              >
                <LogOut size={18} />
                Logout
              </button>
              <button
                onClick={() => {
                  setShowProfileModal(true);
                  setShowMobileMenu(false);
                }}
                className="px-4 py-3 rounded-xl bg-gray-100 hover:bg-primary hover:text-white transition-all duration-300 text-left"
              >
                Settings
              </button>
            </div>
          </div>
        )}
      </div>

      <MobileFloatingNav />
    </>
  );
};

export default Navbar;