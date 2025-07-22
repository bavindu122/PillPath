import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, ShoppingBag, MapPin, Phone, User, Info } from "lucide-react";

const MobileFloatingNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/otc", label: "OTC Store", icon: ShoppingBag },
    { path: "/services", label: "Services", icon: Info },
    { path: "/find-pharmacy", label: "Find Pharmacies", icon: MapPin },
    { path: "/contact", label: "Contact", icon: Phone },
    { path: "/customer", label: "Profile", icon: User },
  ];

  return (
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
                  
                  {item.hasNotification && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
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
        </nav>
      </div>
    </div>
  );
};

export default MobileFloatingNav;