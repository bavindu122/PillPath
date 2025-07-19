import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { BellDot, Menu, LogOutIcon } from "lucide-react";
import ProfileModal from "../../features/customer/components/ProfileModal";
import DesktopNav from "./components/DesktopNav";
import ProfileDropdown from "./components/ProfileDropdown";
import MobileFloatingNav from "./components/MobileFloatingNav";

const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Track scroll position for styling changes
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

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
          scrolled
            ? "bg-white/70 backdrop-blur-md shadow-md"
            : "bg-white/90 backdrop-blur-sm"
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

        {/* Desktop Account Section */}
        <div className="hidden md:flex items-center gap-4 mr-6">
          {token ? (
            <div
              className="flex items-center gap-4"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <BellDot className="w-6 h-6 cursor-pointer" />
              <img
                src={assets.profile_pic}
                alt="profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={toggleDropdown}
              />
              <ProfileDropdown show={showDropdown} setToken={setToken} />
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-pButton text-white px-6 py-2 lg:px-8 lg:py-3 rounded-full font-light hover:bg-pButtonH whitespace-nowrap"
            >
              Create account
            </button>
          )}
        </div>

        {/* Mobile Header Actions - Simplified for floating nav */}
        <div className="md:hidden flex items-center gap-4 mr-4">
          {token ? (
            <img
              src={assets.profile_pic}
              alt="profile"
              className="w-8 h-8 rounded-full"
              onClick={() => navigate("/customer")}
            />
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-pButton text-white px-4 py-2 rounded-full font-light hover:bg-pButtonH whitespace-nowrap text-sm"
            >
              Create account
            </button>
          )}
          <Menu
            className="w-6 h-6 cursor-pointer"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          />
        </div>

        {/* Mobile Menu Dropdown - Simplified as we'll use floating nav */}
        {showMobileMenu && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg rounded-b-2xl z-50 p-4 border-t border-gray-100">
            <div className="flex flex-col gap-3 font-medium text-gray-700">
              <button
                onClick={() => {
                  setToken(!token);
                  setShowMobileMenu(false);
                }}
                className="px-4 py-3 rounded-xl bg-gray-100 hover:bg-primary hover:text-white transition-all duration-300 text-left flex items-center gap-3"
              >
                <LogOut size={18} />
                {token ? "Logout" : "Login"}
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

      {/* Floating Mobile Navigation */}
      <MobileFloatingNav />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
};

export default Navbar;
