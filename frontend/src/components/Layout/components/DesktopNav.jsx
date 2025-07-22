import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const DesktopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleContactClick = (e) => {
    e.preventDefault();
    
    if (location.pathname === '/') {
      // If already on home page, just scroll to footer
      const footer = document.querySelector('#contact');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home page first, then scroll to footer
      navigate('/');
      setTimeout(() => {
        const footer = document.querySelector('#contact');
        if (footer) {
          footer.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

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
          to="/find-pharmacy"
          className={({ isActive }) =>
            `px-2 py-1 lg:px-3 rounded-full transition-all duration-300 ${
              isActive
                ? "navbar-text-white navbar-blue-bg"
                : "navbar-text-primary hover:navbar-blue-text navbar-hover-bg-blue"
            }`
          }
        >
          <li className="py-1">Find Pharmacies</li>
        </NavLink>
        <button
          onClick={handleContactClick}
          className="px-2 py-1 lg:px-3 rounded-full transition-all duration-300 navbar-text-primary hover:navbar-blue-text navbar-hover-bg-blue"
        >
          <li className="py-1">Contact</li>
        </button>
      </ul>
    </div>
  );
};

export default DesktopNav;

