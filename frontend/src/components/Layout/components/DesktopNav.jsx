import React from "react";
import { NavLink } from "react-router-dom";

const DesktopNav = () => {
  return (
    <div className="hidden md:flex border border-gray-400 rounded-full px-4 py-1 lg:px-6 lg:py-2">
      <ul className="flex items-center gap-4 lg:gap-6 xl:gap-8 font-medium text-gray-700 text-sm whitespace-nowrap">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-2 py-1 lg:px-3 rounded-full transition-all duration-300 ${
              isActive
                ? "text-white border bg-pButton"
                : "text-gray-700 hover:text-primary hover:bg-upload-bg-hover"
            }`
          }
        >
          <li className="py-1">Home</li>
        </NavLink>
        <NavLink
          to="/services"
          className={({ isActive }) =>
            `px-2 py-1 lg:px-3 rounded-full transition-all duration-300 ${
              isActive
                ? "text-white border bg-pButton"
                : "text-gray-700 hover:text-primary hover:bg-upload-bg-hover"
            }`
          }
        >
          <li className="py-1">Services</li>
        </NavLink>
        <NavLink
          to="/otc"
          className={({ isActive }) =>
            `px-2 py-1 lg:px-3 rounded-full transition-all duration-300 ${
              isActive
                ? "text-white border bg-pButton"
                : "text-gray-700 hover:text-primary hover:bg-upload-bg-hover"
            }`
          }
        >
          <li className="py-1">OTC Store</li>
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `px-2 py-1 lg:px-3 rounded-full transition-all duration-300 ${
              isActive
                ? "text-white border bg-pButton"
                : "text-gray-700 hover:text-primary hover:bg-upload-bg-hover"
            }`
          }
        >
          <li className="py-1">About Us</li>
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `px-2 py-1 lg:px-3 rounded-full transition-all duration-300 ${
              isActive
                ? "text-white border bg-pButton"
                : "text-gray-700 hover:text-primary hover:bg-upload-bg-hover"
            }`
          }
        >
          <li className="py-1">Contact</li>
        </NavLink>
      </ul>
    </div>
  );
};

export default DesktopNav;