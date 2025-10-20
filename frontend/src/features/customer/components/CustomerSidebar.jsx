import React, { useState } from "react";
import { assets } from "../../../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProfileImage from "../../../components/common/ProfileImage";

import {
  Home,
  ShoppingBag,
  Users,
  MapPin,
  Pill,
  Settings,
  ChevronLeft,
  ChevronRight,
  Clock,
  LogOut,
  FileText,
  Activity,
  MessageCircle,
} from "lucide-react";
import { useCustomerSidebar } from "../hooks";
import { useAuth } from "../../../hooks/useAuth"; // Add this import

const CustomerSidebar = () => {
  const { isExpanded, isMobile, toggleSidebar } = useCustomerSidebar();
  const { user, logout } = useAuth(); // Get user data and logout function
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Add logo reference
  const logo = assets.logo || "https://via.placeholder.com/40";

  // Define active and inactive styles for NavLink
  const linkStyles = {
    active: "bg-white/20 text-white font-semibold",
    inactive: "text-white/70 hover:text-white hover:bg-white/10",
  };

  // Navigation items with icons
  const navItems = [
    { path: "/customer", label: "Dashboard", icon: <Home size={18} /> },
    {
      path: "/customer/activities",
      label: "Ongoing Activities",
      icon: <Activity size={18} />,
    },
    {
      path: "/customer/orders",
      label: "Past Orders",
      icon: <Clock size={18} />,
    },
    {
      path: "/customer/family-profiles",
      label: "Family Profiles",
      icon: <Users size={18} />,
    },
    
    {
      path: "/customer/chats",
      label: "Chats",
      icon: <MessageCircle size={18} />,
    },
    
  ];

  // Handle logout functionality
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/login");
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <motion.aside
        className={`${
          isExpanded ? "w-64" : "w-20"
        } min-h-screen bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 backdrop-blur-lg border-r border-white/10 shadow-lg flex flex-col py-6 fixed z-30 transition-all duration-300 ease-in-out`}
        initial={false}
      >
        {/* Logo and Toggle Button */}
        <div className="flex items-center justify-between px-4 mb-8">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-2">
              <img src={assets.logo2} alt="PillPath Logo" className="h-8 w-8" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.h1
                    className="ml-3 text-white font-bold text-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    PillPath
                  </motion.h1>
                )}
              </AnimatePresence>
            </NavLink>
          </div>
          <motion.button
            className="bg-white/20 hover:bg-white/30 text-white rounded-full p-1.5 focus:outline-none"
            onClick={toggleSidebar}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? (
              <ChevronLeft size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 px-3 flex-1">
          {navItems.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="overflow-hidden"
            >
              <NavLink
                to={item.path}
                end={item.path === "/customer"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl ${
                    isActive ? linkStyles.active : linkStyles.inactive
                  } transition-all duration-200`
                }
              >
                <div className="text-white/80">{item.icon}</div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* User profile section at bottom */}
        <div
          className={`mt-auto px-4 py-3 border-t border-white/10 ${
            isExpanded
              ? "flex items-center justify-between"
              : "flex flex-col items-center"
          }`}
        >
          <div className="flex items-center">
            <ProfileImage
              src={user?.profilePictureUrl}
              alt="User avatar"
              className="h-10 w-10 rounded-full border-2 border-white/30"
            />
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  className="ml-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-white font-medium text-sm">
                    {user?.fullName ||
                      (user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user?.firstName) ||
                      "Customer"}
                  </p>
                  <p className="text-white/60 text-xs">
                    {user?.email || "customer@example.com"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.button
                className="text-white/60 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors duration-200"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLogout} // Add the click handler
                title="Logout" // Add tooltip
              >
                <LogOut size={16} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Logout button for collapsed state */}
          {!isExpanded && (
            <motion.button
              className="text-white/60 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors duration-200 mt-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={16} />
            </motion.button>
          )}
        </div>
      </motion.aside>
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center">
                <div className="mb-4">
                  <LogOut size={48} className="mx-auto text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Confirm Logout
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to log out?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={cancelLogout}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Overlay for mobile */}
      {isExpanded && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default CustomerSidebar;
