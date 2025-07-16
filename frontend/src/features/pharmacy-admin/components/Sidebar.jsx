import React, { useState, useEffect } from 'react';
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
    if (path === '/pharmacy/analytics') {
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
    { name: 'Sales Analytics', icon: LineChart, path: '/pharmacy/analytics' },
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

      {/* Sidebar */}
      <div className={`
        bg-slate-800 text-white min-h-screen p-4 fixed xl:static top-0 left-0 z-40
        w-64 xl:w-64 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
      `}>
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
    </>
  );
}

















// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { assets } from '../../../assets/assets';
// import {
//   LayoutDashboard,
//   Settings,
//   Users,
//   Package,
//   Store,
//   ClipboardList,
//   LineChart,
// } from 'lucide-react';

// export default function Sidebar({ activeMenuItem, setActiveMenuItem, isSidebarOpen, setIsSidebarOpen }) {
//   const location = useLocation();
  
//   // Menu items with their paths
//   const menuItems = [
//     { name: 'Dashboard', icon: LayoutDashboard, path: '/pharmacy' },
//     { name: 'Pharmacy Profile', icon: Settings, path: '/pharmacy/pharmacyprofile' },
//     { name: 'Staff Management', icon: Users, path: '/pharmacy/pharmacystaff' },
//     { name: 'Inventory', icon: Package, path: '/pharmacy/pharmacyinventory' },
//     { name: 'OTC Storefront', icon: Store, path: '/pharmacy/otc' },
//     { name: 'Orders', icon: ClipboardList, path: '/pharmacy/orders' },
//     { name: 'Sales Analytics', icon: LineChart, path: '/pharmacy/analytics' },
//   ];

//   return (
//     <aside
//       className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-y-auto border-r border-gray-200 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 rounded-r-lg
//         ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
//     >
//       <div className="flex h-16 shrink-0 items-center px-4 border-b border-gray-200 rounded-tr-lg">
//         <span className="flex text-xl font-bold text-primary">
//           PillPath
//           <img src={assets.logo1} alt="PillPath Logo" className="ml-2 h-6 w-auto" />
//         </span>
//       </div>

//       <nav className="flex flex-1 flex-col py-4 px-2 bg-slate-800">
//         <ul className="space-y-1">
//           {menuItems.map((item) => {
//             const isActive = location.pathname === item.path;
            
//             return (
//               <li key={item.name}>
//                 <Link
//                   to={item.path}
//                   onClick={() => {
//                     setActiveMenuItem(item.name);
//                     setIsSidebarOpen(false);
//                   }}
//                   className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200
//                     ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'}`}
//                 >
//                   <item.icon
//                     className={`mr-3 h-5 w-5 ${
//                       isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-600'
//                     }`}
//                   />
//                   {item.name}
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>
//     </aside>
//   );
// }