import React from "react";
import { NavLink } from "react-router-dom";

const DesktopNav = () => {
  return (
    <div className="hidden md:flex border navbar-blue-border rounded-full px-4 py-1 lg:px-6 lg:py-2">
      <ul className="flex items-center gap-4 lg:gap-6 xl:gap-8 font-medium navbar-text-primary text-sm whitespace-nowrap">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-2 py-1 lg:px-3 rounded-full transition-all duration-300 ${
              isActive
                ? "navbar-text-white navbar-blue-bg"
                : "navbar-text-primary hover:navbar-blue-text navbar-hover-bg-blue"
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
                ? "navbar-text-white navbar-blue-bg"
                : "navbar-text-primary hover:navbar-blue-text navbar-hover-bg-blue"
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
                ? "navbar-text-white navbar-blue-bg"
                : "navbar-text-primary hover:navbar-blue-text navbar-hover-bg-blue"
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
                ? "navbar-text-white navbar-blue-bg"
                : "navbar-text-primary hover:navbar-blue-text navbar-hover-bg-blue"
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
                ? "navbar-text-white navbar-blue-bg"
                : "navbar-text-primary hover:navbar-blue-text navbar-hover-bg-blue"
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