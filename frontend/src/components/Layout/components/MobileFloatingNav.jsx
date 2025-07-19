import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, ShoppingBag, MapPin, Phone, User, Info } from "lucide-react";

const MobileFloatingNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/otc", label: "OTC Store", icon: ShoppingBag },
    { path: "/services", label: "Services", icon: MapPin },
    { path: "/about", label: "About", icon: Info },
    { path: "/contact", label: "Contact", icon: Phone },
    { path: "/customer", label: "Profile", icon: User },
  ];

  return (
    <div className="block lg:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-xl border border-gray-100 p-2">
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
                      ? "bg-primary text-white shadow-md"
                      : "text-gray-500 hover:text-primary"
                  }`}
                >
                  <Icon size={20} />
                  
                  {/* Notification dot example */}
                  {item.hasNotification && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </div>
                
                <span
                  className={`text-[10px] mt-1 transition-all duration-300 ${
                    isActive ? "text-primary font-medium" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
                
                {isActive && (
                  <span className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full"></span>
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