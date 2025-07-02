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

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'prescriptions', icon: FileText, label: 'Prescription Queue' },
    { id: 'inventory', icon: Package, label: 'Inventory' },
    { id: 'orders', icon: ShoppingCart, label: 'Orders' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="bg-slate-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">PillPath</h2>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;