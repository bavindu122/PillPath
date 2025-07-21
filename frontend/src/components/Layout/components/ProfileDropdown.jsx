import React from "react";
import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";

const ProfileDropdown = ({ show, setToken }) => {
  return (
    <div
      className={`absolute top-0 right-0 mt-16 mr-6 text-base font-medium text-gray-600 z-50 transition-all duration-200 ${
        show ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="min-w-48 bg-white rounded-lg shadow-lg flex flex-col gap-4 p-4">
        <NavLink to="/customer" className="cursor-pointer hover:text-pButton">
          Profile
        </NavLink>
        <p className="cursor-pointer hover:text-pButton">Settings</p>
        <div className="border-t border-gray-200 pt-2">
          <p
            onClick={() => setToken(false)}
            className="cursor-pointer hover:text-pButton flex items-center gap-2"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;