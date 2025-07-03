import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  BarChart3, 
  Settings,
  ChevronRight
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  // Determine active item based on current route
  const getActiveItem = () => {
    const path = location.pathname;
    if (path === '/pharmacist' || path === '/pharmacist/dashboard') {
      return 'dashboard';
    }
    if (path.includes('/review')) {
      return 'prescriptions';
    }
    // Add more route mappings as needed
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
      path: '/pharmacist/dashboard' // For now, this goes to dashboard where queue is shown
    },
    { 
      id: 'inventory', 
      icon: Package, 
      label: 'Inventory',
      path: '#' // Placeholder for future implementation
    },
    { 
      id: 'orders', 
      icon: ShoppingCart, 
      label: 'Orders',
      path: '#' // Placeholder for future implementation
    },
    { 
      id: 'chat', 
      icon: MessageSquare, 
      label: 'Chat',
      path: '#' // Placeholder for future implementation
    },
    { 
      id: 'reports', 
      icon: BarChart3, 
      label: 'Reports',
      path: '#' // Placeholder for future implementation
    },
    { 
      id: 'settings', 
      icon: Settings, 
      label: 'Settings',
      path: '#' // Placeholder for future implementation
    }
  ];

  // Update active item when location changes
  React.useEffect(() => {
    setActiveItem(getActiveItem());
  }, [location.pathname]);

  return (
    <div className="bg-slate-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <Link to="/pharmacist" className="block">
          <h2 className="text-xl font-bold text-gradient-primary">PillPath</h2>
          <p className="text-xs text-gray-400 mt-1">Pharmacist Dashboard</p>
        </Link>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          if (item.path === '#') {
            // For non-implemented routes, show as disabled button
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
              onClick={() => setActiveItem(item.id)}
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
  );
};

export default Sidebar;