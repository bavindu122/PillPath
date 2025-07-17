import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../../../assets/assets';
import {
  LayoutDashboard,
  Settings,
  Users,
  Package,
  ClipboardList,
  LineChart,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine active item based on current route
  const getActiveItem = () => {
    const path = location.pathname;
    if (path === '/pharmacy' || path === '/pharmacy/dashboard') {
      return 'Dashboard';
    }
    if (path === '/pharmacy/pharmacyprofile') {
      return 'Pharmacy Profile';
    }
    if (path === '/pharmacy/pharmacystaff') {
      return 'Staff Management';
    }
    if (path === '/pharmacy/pharmacyinventory') {
      return 'Inventory';
    }
    if (path === '/pharmacy/orders') {
      return 'Orders';
    }
    if (path === '/pharmacy/pharmacyanalytics') {
      return 'Sales Analytics';
    }
    return 'Dashboard';
  };

  const [activeItem, setActiveItem] = useState(getActiveItem());

  useEffect(() => {
    setActiveItem(getActiveItem());
  }, [location.pathname]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Menu items with their paths
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/pharmacy' },
    { name: 'Pharmacy Profile', icon: Settings, path: '/pharmacy/pharmacyprofile' },
    { name: 'Staff Management', icon: Users, path: '/pharmacy/pharmacystaff' },
    { name: 'Inventory', icon: Package, path: '/pharmacy/pharmacyinventory' },
    { name: 'Orders', icon: ClipboardList, path: '/pharmacy/orders' },
    { name: 'Sales Analytics', icon: LineChart, path: '/pharmacy/pharmacyanalytics' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="xl:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 text-white rounded-lg shadow-lg hover:bg-slate-700 transition-colors duration-200"
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar - Fixed Position */}
      <div className={`
        bg-slate-800 text-white fixed top-0 bottom-0 left-0 z-40
        w-64 transform transition-transform duration-300 ease-in-out
        flex flex-col overflow-y-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
      `}>
        <div className="p-4 flex-shrink-0">
          <div className="mb-8 mt-12 xl:mt-0">
            <Link to="/pharmacy" className="block" onClick={closeMobileMenu}>
              <h2 className="text-xl font-bold text-gradient-primary flex items-center">
                <img src={assets.logo2} alt="PillPath Logo" className="ml-2 h-8 w-auto" />
                PillPath
              </h2>
              <p className="text-xs text-gray-400 mt-1">Pharmacy Admin Dashboard</p>
            </Link>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => {
                    setActiveItem(item.name);
                    closeMobileMenu();
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 nav-item group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`} />
                  <span className="text-sm font-medium">{item.name}</span>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 ml-auto animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Wrapper - Add this to your layout */}
      <div className="xl:ml-64 transition-all duration-300">
        {/* Your page content goes here */}
      </div>
    </>
  );
}




