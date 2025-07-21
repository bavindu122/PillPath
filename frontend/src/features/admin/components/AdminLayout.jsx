import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import { assets } from '../../../assets/assets';
import { useAdminAuth } from '../../../hooks/useAdminAuth'; // ✅ Import admin auth

import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Settings,
  Activity,
  BarChart3,
  Bug,
  Shield,
  Wrench,
  Menu,
  X,
  Bell,
  User,
  Wallet,
  LogOut, // ✅ Import LogOut icon
  ChevronDown, // ✅ Import ChevronDown for dropdown
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/admin/overview', icon: LayoutDashboard },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Pharmacies', href: '/admin/pharmacies', icon: Building2 },
  { name: 'Prescriptions', href: '/admin/prescriptions', icon: FileText },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Wallet', href: '/admin/wallet', icon: Wallet },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // ✅ State for dropdown
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, admin, loading } = useAdminAuth(); // ✅ Get logout function and admin data

  // ✅ Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout API fails, clear local storage and redirect
      navigate('/admin/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}>
        <div className="flex h-16 items-center justify-between px-6 border-b bg-white">
          <span className="flex text-xl font-bold text-primary ">
            PillPath
            <img src={assets.logo1} alt="PillPath Logo" className="ml-2 h-6 w-auto" />
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
            >
            <X className="h-5 w-5" />
        </button>
        </div>

        <nav className="mt-8 px-4 ">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors " +
                    (isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-white hover:bg-gray-50 hover:text-gray-900")
                    }
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="lg:pl-64">
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <span className='text-lg'>PillPath Admin</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 cursor-pointer text-blue-600 hover:text-blue-800 transition-colors" />
              </div>

              {/* ✅ Admin Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <User className="h-8 w-8 text-blue-600" />
                  <div className="flex flex-col text-sm text-left">
                    <span className="text-gray-900 font-medium">
                      {admin?.username || 'Administrator'}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {admin?.adminLevel || 'Admin'}
                    </span>
                  </div>
                  <ChevronDown 
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* ✅ Dropdown Menu */}
                {dropdownOpen && (
                  <>
                    {/* Overlay to close dropdown when clicking outside */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setDropdownOpen(false)}
                    />
                    
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      {/* Profile Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {admin?.username || 'Administrator'}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {admin?.id || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Level: {admin?.adminLevel || 'Admin'}
                        </p>
                      </div>

                      {/* Profile Actions */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            // Add profile settings navigation if needed
                            console.log('Navigate to profile settings');
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Settings className="mr-3 h-4 w-4" />
                          Profile Settings
                        </button>
                        
                        {/* ✅ Logout Button */}
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            handleLogout();
                          }}
                          disabled={loading}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          {loading ? 'Signing out...' : 'Sign Out'}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}