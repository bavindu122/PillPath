import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../../../assets/assets';
import {
  LayoutDashboard,
  Settings,
  Users,
  Package,
  Store,
  ClipboardList,
  LineChart,
} from 'lucide-react';

export default function Sidebar({ activeMenuItem, setActiveMenuItem, isSidebarOpen, setIsSidebarOpen }) {
  const location = useLocation();
  
  // Menu items with their paths
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/pharmacy' },
    { name: 'Pharmacy Profile', icon: Settings, path: '/pharmacy/pharmacyprofile' },
    { name: 'Staff Management', icon: Users, path: '/pharmacy/pharmacystaff' },
    { name: 'Inventory', icon: Package, path: '/pharmacy/pharmacyinventory' },
    { name: 'OTC Storefront', icon: Store, path: '/pharmacy/otc' },
    { name: 'Orders', icon: ClipboardList, path: '/pharmacy/orders' },
    { name: 'Sales Analytics', icon: LineChart, path: '/pharmacy/analytics' },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-y-auto border-r border-gray-200 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 rounded-r-lg
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex h-16 shrink-0 items-center px-4 border-b border-gray-200 rounded-tr-lg">
        <span className="flex text-xl font-bold text-primary">
          PillPath
          <img src={assets.logo1} alt="PillPath Logo" className="ml-2 h-6 w-auto" />
        </span>
      </div>

      <nav className="flex flex-1 flex-col py-4 px-2 bg-slate-800">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => {
                    setActiveMenuItem(item.name);
                    setIsSidebarOpen(false);
                  }}
                  className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200
                    ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-600'
                    }`}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}