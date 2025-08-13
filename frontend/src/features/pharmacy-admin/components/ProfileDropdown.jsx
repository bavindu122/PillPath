import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, 
  Settings, 
  User, 
  Shield, 
  Building2,
  Phone,
  Mail,
  Calendar
} from "lucide-react";
import { usePharmacyAuth } from "../../../hooks/usePharmacyAuth";

const ProfileDropdown = ({ show, onClose }) => {
  const navigate = useNavigate();
  const { user, logout, isPharmacyAdmin, pharmacyName, position } = usePharmacyAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Force redirect even if logout fails
      navigate("/login");
    }
  };

  const handleSettings = () => {
    navigate("/pharmacy/settings");
    onClose?.();
  };

  const handleProfile = () => {
    navigate("/pharmacy/profile");
    onClose?.();
  };

  if (!show) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            {user?.profilePictureUrl ? (
              <img 
                src={user.profilePictureUrl} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">
              {user?.fullName || "Pharmacy User"}
            </h3>
            <div className="flex items-center space-x-2 text-blue-100">
              {isPharmacyAdmin && (
                <Shield className="w-3 h-3" />
              )}
              <p className="text-sm truncate">
                {position || "Staff Member"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="space-y-2 text-sm">
          {pharmacyName && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Building2 className="w-4 h-4" />
              <span className="truncate">{pharmacyName}</span>
            </div>
          )}
          {user?.email && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span className="truncate">{user.email}</span>
            </div>
          )}
          {user?.phoneNumber && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{user.phoneNumber}</span>
            </div>
          )}
          {user?.hireDate && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Since {new Date(user.hireDate).getFullYear()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <button
          onClick={handleProfile}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3"
        >
          <User className="w-4 h-4" />
          <span>View Profile</span>
        </button>
        
        <button
          onClick={handleSettings}
          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-3"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>

        <hr className="my-2 border-gray-100" />
        
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-3"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;