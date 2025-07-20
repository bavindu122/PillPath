import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  BarChart3, 
  Settings,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import '../pages/index-pharmacist.css';
import { assets } from '../../../assets/assets';

const Sidebar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Determine active item based on current route
  const getActiveItem = () => {
    const path = location.pathname;
    if (path === '/pharmacist' || path === '/pharmacist/dashboard') {
      return 'dashboard';
    }
    if (path === '/pharmacist/queue') {
      return 'prescriptions';
    }
    if (path === '/pharmacist/orders') {
      return 'orders';
    }
    if (path === '/pharmacist/inventory') {
      return 'inventory';
    }
    if (path === '/pharmacist/chat') {
      return 'chat';
    }
    if (path.includes('/review')) {
      return 'prescriptions';
    }
    if (path.includes('/orders')) {
      return 'orders';
    }
    return 'dashboard';
  };

  const [activeItem, setActiveItem] = useState(getActiveItem());

  const menuItems = [
    { 
      id: 'dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard',
      path: '/pharmacist/dashboard'
    },
    { 
      id: 'prescriptions', 
      icon: FileText, 
      label: 'Prescription Queue',
      path: '/pharmacist/queue'
    },
    { 
      id: 'orders', 
      icon: ShoppingCart, 
      label: 'Order History',
      path: '/pharmacist/orders'
    },
    { 
      id: 'inventory', 
      icon: Package, 
      label: 'Inventory',
      path: '/pharmacist/inventory'
    },
    { 
      id: 'chat', 
      icon: MessageSquare, 
      label: 'Chat',
      path: '/pharmacist/chat'
    },
    { 
      id: 'reports', 
      icon: BarChart3, 
      label: 'Reports',
      path: '#'
    },
    { 
      id: 'settings', 
      icon: Settings, 
      label: 'Settings',
      path: '#'
    }
  ];

  React.useEffect(() => {
    setActiveItem(getActiveItem());
  }, [location.pathname]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
          className="xl:hidden fixed inset-0 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`
        bg-slate-800 text-white min-h-screen p-4 fixed xl:static top-0 left-0 z-40
        w-64 xl:w-64 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
      `}>
        <div className="mb-8 mt-12 xl:mt-0">
          <Link to="/pharmacist" className="block" onClick={closeMobileMenu}>
            <h2 className="text-xl font-bold text-gradient-primary flex items-center gap-2">
              <img src={assets.logo3} alt="PillPath Logo" className="ml-2 h-8 w-auto" />
              PillPath
            </h2>
            <p className="text-xs text-gray-400 mt-1">Pharmacist Dashboard</p>
          </Link>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            if (item.path === '#') {
              return (
                <button
                  key={item.id}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 text-gray-500 cursor-not-allowed opacity-50"
                  disabled
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="ml-auto text-xs bg-gray-600 px-2 py-0.5 rounded">Soon</span>
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => {
                  setActiveItem(item.id);
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
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <ChevronRight className="h-4 w-4 ml-auto animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;