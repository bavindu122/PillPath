import React from 'react';
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
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-y-auto border-r border-gray-200 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 rounded-r-lg
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex h-16 shrink-0 items-center px-4 border-b border-gray-200 rounded-tr-lg">
        <span className="flex text-xl font-bold text-blue-700 ">Pillpath 
          <img src='{assets.logo1}' className="ml-2 h-6 w-auto" />
        </span>

      </div>

      <nav className="flex flex-1 flex-col py-4 px-2">
        <ul className="space-y-1">
          {[
            { name: 'Dashboard', icon: LayoutDashboard },
            { name: 'Pharmacy Profile', icon: Settings },
            { name: 'Staff Management', icon: Users },
            { name: 'Inventory', icon: Package },
            { name: 'OTC Storefront', icon: Store },
            { name: 'Orders', icon: ClipboardList },
            { name: 'Sales Analytics', icon: LineChart },
          ].map(({ name, icon: Icon }) => (
            <li key={name}>
              <a
                href="#"
                onClick={() => {
                  setActiveMenuItem(name);
                  setIsSidebarOpen(false);
                }}
                className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200
                  ${activeMenuItem === name ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    activeMenuItem === name ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-600'
                  }`}
                />
                {name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}











// import React, { useState } from 'react';
// import {
//   LayoutDashboard,
//   Settings,
//   Users,
//   Package,
//   Store,
//   ClipboardList,
//   LineChart,
//   Bell,
//   ChevronDown,
//   CircleUser,
//   Search,
//   Filter,
//   ArrowUpDown
// } from 'lucide-react'; // Importing icons from lucide-react

// // Main App Component - Orchestrates the layout
// export default function App() {
//   const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility on mobile

//   return (
//     <div className="flex min-h-screen bg-gray-100 font-inter">
//       {/* Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-y-auto border-r border-gray-200 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 rounded-r-lg
//           ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
//       >
//         {/* Sidebar Header/Logo */}
//         <div className="flex h-16 shrink-0 items-center px-4 border-b border-gray-200 rounded-tr-lg">
//           <span className="text-xl font-bold text-blue-700">PharmaCare</span>
//         </div>

//         {/* Sidebar Navigation */}
//         <nav className="flex flex-1 flex-col py-4 px-2">
//           <ul className="space-y-1">
//             {/* Dashboard Link - Active State */}
//             <li>
//               <a
//                 href="#"
//                 onClick={() => { setActiveMenuItem('Dashboard'); setIsSidebarOpen(false); }}
//                 className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200
//                   ${activeMenuItem === 'Dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
//               >
//                 <LayoutDashboard className={`mr-3 h-5 w-5 ${activeMenuItem === 'Dashboard' ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-600'}`} />
//                 Dashboard
//               </a>
//             </li>

//             {/* Other Navigation Links */}
//             <li>
//               <a
//                 href="#"
//                 onClick={() => { setActiveMenuItem('Pharmacy Settings'); setIsSidebarOpen(false); }}
//                 className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200
//                   ${activeMenuItem === 'Pharmacy Settings' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
//               >
//                 <Settings className={`mr-3 h-5 w-5 ${activeMenuItem === 'Pharmacy Settings' ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-600'}`} />
//                 Pharmacy Settings
//               </a>
//             </li>
//             <li>
//               <a
//                 href="#"
//                 onClick={() => { setActiveMenuItem('Staff Management'); setIsSidebarOpen(false); }}
//                 className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200
//                   ${activeMenuItem === 'Staff Management' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
//               >
//                 <Users className={`mr-3 h-5 w-5 ${activeMenuItem === 'Staff Management' ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-600'}`} />
//                 Staff Management
//               </a>
//             </li>
//             <li>
//               <a
//                 href="#"
//                 onClick={() => { setActiveMenuItem('Inventory'); setIsSidebarOpen(false); }}
//                 className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200
//                   ${activeMenuItem === 'Inventory' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
//               >
//                 <Package className={`mr-3 h-5 w-5 ${activeMenuItem === 'Inventory' ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-600'}`} />
//                 Inventory
//               </a>
//             </li>
//             <li>
//               <a
//                 href="#"
//                 onClick={() => { setActiveMenuItem('OTC Storefront'); setIsSidebarOpen(false); }}
//                 className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200
//                   ${activeMenuItem === 'OTC Storefront' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
//               >
//                 <Store className={`mr-3 h-5 w-5 ${activeMenuItem === 'OTC Storefront' ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-600'}`} />
//                 OTC Storefront
//               </a>
//             </li>
//             <li>
//               <a
//                 href="#"
//                 onClick={() => { setActiveMenuItem('Orders'); setIsSidebarOpen(false); }}
//                 className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200
//                   ${activeMenuItem === 'Orders' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
//               >
//                 <ClipboardList className={`mr-3 h-5 w-5 ${activeMenuItem === 'Orders' ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-600'}`} />
//                 Orders
//               </a>
//             </li>
//             <li>
//               <a
//                 href="#"
//                 onClick={() => { setActiveMenuItem('Sales Analytics'); setIsSidebarOpen(false); }}
//                 className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200
//                   ${activeMenuItem === 'Sales Analytics' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
//               >
//                 <LineChart className={`mr-3 h-5 w-5 ${activeMenuItem === 'Sales Analytics' ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-600'}`} />
//                 Sales Analytics
//               </a>
//             </li>
//           </ul>
//         </nav>
//       </aside>

//       {/* Main Content Area */}
//       <div className="flex flex-1 flex-col">
//         {/* Navigation Bar (Header) */}
//         <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8 rounded-b-lg">
//           {/* Mobile menu button (Hamburger icon) */}
//           <button
//             type="button"
//             className="rounded-md p-2 text-gray-700 lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
//             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           >
//             <span className="sr-only">Open sidebar</span>
//             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
//             </svg>
//           </button>

//           {/* Left Section: PharmaCare Title & Admin Panel */}
//           <div className="flex items-center">
//             <h1 className="text-lg font-semibold text-gray-800 hidden md:block">PharmaCare <span className="ml-2 text-sm font-normal text-gray-500">Administrator Panel</span></h1>
//           </div>

//           {/* Right Section: Notifications, User Profile, and Time Range */}
//           <div className="ml-auto flex items-center space-x-4">
//             {/* Notification Icon */}
//             <div className="relative">
//               <Bell className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
//               <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">
//                 3
//               </span>
//             </div>

//             {/* User Profile Dropdown */}
//             <div className="relative flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors">
//               <CircleUser className="h-8 w-8 text-blue-600" />
//               <div className="flex flex-col text-sm">
//                 <span className="font-medium text-gray-800">John Admin</span>
//                 <span className="text-gray-500">Administrator</span>
//               </div>
//               <ChevronDown className="h-4 w-4 text-gray-500" />
//             </div>

//             {/* Last 7 Days Dropdown */}
//             <div className="relative hidden md:block">
//               <button
//                 type="button"
//                 className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                 id="menu-button"
//                 aria-expanded="true"
//                 aria-haspopup="true"
//               >
//                 Last 7 days
//                 <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
//               </button>
//             </div>
//           </div>
//         </header>

//         {/* Main Content Area (Dashboard Overview, Sales Trend etc.) */}
//         <main className="flex-1 p-4 sm:p-6 lg:p-8">
//           {/* This is where the main content from the image would go */}
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">
//             Dashboard Overview
//           </h2>

//           {/* Placeholder for the rest of the dashboard content from the image */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {/* Example Card 1: Total Orders */}
//             <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Total Orders</p>
//                 <p className="text-3xl font-bold text-gray-800">1,247</p>
//                 <p className="text-green-500 text-xs mt-1">+12% from last month</p>
//               </div>
//               <div className="bg-blue-100 p-3 rounded-full">
//                 <ClipboardList className="h-6 w-6 text-blue-600" />
//               </div>
//             </div>

//             {/* Example Card 2: Revenue */}
//             <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Revenue</p>
//                 <p className="text-3xl font-bold text-gray-800">$24,580</p>
//                 <p className="text-green-500 text-xs mt-1">+8% from last month</p>
//               </div>
//               <div className="bg-green-100 p-3 rounded-full">
//                 <LineChart className="h-6 w-6 text-green-600" />
//               </div>
//             </div>

//             {/* Example Card 3: Active Staff */}
//             <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Active Staff</p>
//                 <p className="text-3xl font-bold text-gray-800">12</p>
//                 <p className="text-blue-500 text-xs mt-1">2 new this month</p>
//               </div>
//               <div className="bg-purple-100 p-3 rounded-full">
//                 <Users className="h-6 w-6 text-purple-600" />
//               </div>
//             </div>

//             {/* Example Card 4: Inventory Items */}
//             <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm">Inventory Items</p>
//                 <p className="text-3xl font-bold text-gray-800">856</p>
//                 <p className="text-red-500 text-xs mt-1">23 low stock</p>
//               </div>
//               <div className="bg-yellow-100 p-3 rounded-full">
//                 <Package className="h-6 w-6 text-yellow-600" />
//               </div>
//             </div>
//           </div>

//           {/* Placeholder for Sales Trend and Order Status */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//             <div className="bg-white p-6 rounded-lg shadow-md h-96">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Trend</h3>
//               {/* Chart Placeholder */}
//               <div className="flex items-center justify-center h-full text-gray-400">
//                 (Sales Trend Chart Placeholder)
//               </div>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-md h-96">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h3>
//               {/* Donut Chart Placeholder */}
//               <div className="flex items-center justify-center h-full text-gray-400">
//                 (Order Status Donut Chart Placeholder)
//               </div>
//             </div>
//           </div>

//           {/* Quick Actions */}
//           <div className="mt-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-3 cursor-pointer hover:shadow-lg transition-shadow">
//                 <div className="bg-blue-100 p-2 rounded-full">
//                   <Users className="h-5 w-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-800">Add Staff</p>
//                   <p className="text-sm text-gray-500">Add new team member</p>
//                 </div>
//               </div>
//               <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-3 cursor-pointer hover:shadow-lg transition-shadow">
//                 <div className="bg-green-100 p-2 rounded-full">
//                   <Package className="h-5 w-5 text-green-600" />
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-800">Add Inventory</p>
//                   <p className="text-sm text-gray-500">New product entry</p>
//                 </div>
//               </div>
//               <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-3 cursor-pointer hover:shadow-lg transition-shadow">
//                 <div className="bg-purple-100 p-2 rounded-full">
//                   <Settings className="h-5 w-5 text-purple-600" />
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-800">Update Pharmacy</p>
//                   <p className="text-sm text-gray-500">Edit pharmacy details</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//            {/* Recent Orders and Low Stock Alerts */}
//            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
//               <ul className="space-y-4">
//                 {/* Order Item 1 */}
//                 <li className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
//                   <div className="flex items-center space-x-3">
//                     <div className="bg-green-100 p-2 rounded-full">
//                       <ClipboardList className="h-4 w-4 text-green-600" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-800">Order #1234</p>
//                       <p className="text-sm text-gray-500">John Smith - $45.50</p>
//                     </div>
//                   </div>
//                   <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">Completed</span>
//                 </li>
//                 {/* Order Item 2 */}
//                 <li className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
//                   <div className="flex items-center space-x-3">
//                     <div className="bg-yellow-100 p-2 rounded-full">
//                       <ClipboardList className="h-4 w-4 text-yellow-600" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-800">Order #1235</p>
//                       <p className="text-sm text-gray-500">Sarah Johnson - $32.00</p>
//                     </div>
//                   </div>
//                   <span className="text-sm text-yellow-600 font-medium bg-yellow-50 px-2 py-1 rounded-full">Pending</span>
//                 </li>
//               </ul>
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Alerts</h3>
//               <ul className="space-y-4">
//                 {/* Alert Item 1 */}
//                 <li className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
//                   <div className="flex items-center space-x-3">
//                     <div className="bg-red-100 p-2 rounded-full">
//                       <Bell className="h-4 w-4 text-red-600" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-800">Aspirin 500mg</p>
//                       <p className="text-sm text-red-500">Only 5 units left</p>
//                     </div>
//                   </div>
//                   <button className="text-blue-600 hover:underline text-sm font-medium">Reorder</button>
//                 </li>
//                 {/* Alert Item 2 */}
//                 <li className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
//                   <div className="flex items-center space-x-3">
//                     <div className="bg-red-100 p-2 rounded-full">
//                       <Bell className="h-4 w-4 text-red-600" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-800">Vitamin C Tablets</p>
//                       <p className="text-sm text-red-500">Only 12 units left</p>
//                     </div>
//                   </div>
//                   <button className="text-blue-600 hover:underline text-sm font-medium">Reorder</button>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
