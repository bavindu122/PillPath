import React from 'react';
import { Package, DollarSign, Users, Box, Wallet } from 'lucide-react'; // Added Wallet icon

const DashboardOverview = ({ data }) => {
  const getCardColor = (type) => {
    switch (type) {
      case 'Total Orders':
        return 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'Revenue':
        return 'border-green-200 bg-gradient-to-br from-green-50 to-green-100';
      case 'Active Staff':
        return 'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'Inventory Items':
        return 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'Digital Wallet': // New case for Digital Wallet
        return 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100';
      default:
        return 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100';
    }
  };

  const getIconAndColor = (type) => {
    switch (type) {
      case 'Total Orders':
        return { icon: Package, iconColor: 'text-blue-600', dotColor: '#3B82F6' };
      case 'Revenue':
        return { icon: DollarSign, iconColor: 'text-green-600', dotColor: '#10B981' };
      case 'Active Staff':
        return { icon: Users, iconColor: 'text-purple-600', dotColor: '#9333EA' };
      case 'Inventory Items':
        return { icon: Box, iconColor: 'text-yellow-600', dotColor: '#F59E0B' };
      case 'Digital Wallet': // New case for Digital Wallet
        return { icon: Wallet, iconColor: 'text-indigo-600', dotColor: '#6366F1' };
      default:
        return { icon: null, iconColor: 'text-gray-600', dotColor: '#9CA3AF' };
    }
  };

  // Prepare data in a format similar to inventoryStats, including Digital Wallet
  const dashboardStats = [
    { type: 'Total Orders', count: data.totalOrders.value, change: data.totalOrders.change },
    { type: 'Revenue', count: data.revenue.value, change: data.revenue.change },
    { type: 'Active Staff', count: data.activeStaff.value, new: data.activeStaff.new },
    { type: 'Inventory Items', count: data.inventoryItems.value, lowStock: data.inventoryItems.lowStock },
    { type: 'Digital Wallet', count: data.digitalWallet.value, description: 'Current Balance' }, // New Digital Wallet entry
  ];

  return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-6">
      {dashboardStats.map((stat, index) => {
        const { icon: Icon, iconColor, dotColor } = getIconAndColor(stat.type);
        return (
          <div
            key={index}
            className={`${getCardColor(stat.type)} border rounded-2xl px-8 py-8 min-w-[220px] min-h-[180px] flex flex-col items-center justify-between shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer group`}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'slideInUp 0.6s ease-out forwards'
            }}
          >
            <div className="flex flex-col items-center w-full mb-4">
              <div className={`mb-4 ${iconColor} opacity-90 group-hover:opacity-100 transition-opacity duration-200`}>
                {Icon && <Icon size={40} />}
              </div>
              <p className="text-base font-medium text-gray-600 mb-1 group-hover:text-gray-700 transition-colors duration-200 text-center">
                {stat.type}
              </p>
              <p className="text-4xl font-extrabold text-gray-900 mb-1 group-hover:scale-105 transition-transform duration-200 text-center">
                {stat.type === 'Digital Wallet' ? `$${stat.count}` : stat.count}
              </p>
              {/* Conditional display for change/new/low stock/description information */}
              {stat.type === 'Total Orders' || stat.type === 'Revenue' ? (
                <p className={`text-sm ${stat.change.includes('+') ? 'text-green-500' : 'text-red-500'} text-center`}>
                  {stat.change} from last month
                </p>
              ) : stat.type === 'Active Staff' ? (
                <p className="text-sm text-gray-500 text-center">
                  {stat.new} new this month
                </p>
              ) : stat.type === 'Inventory Items' ? (
                <p className="text-sm text-red-500 text-center">
                  {stat.lowStock} low stock
                </p>
              ) : stat.type === 'Digital Wallet' ? ( // Display description for Digital Wallet
                <p className="text-sm text-gray-500 text-center">
                  {stat.description}
                </p>
              ) : null}
            </div>
            {/* Animated progress bar - simplified for this context as percentage is not directly available */}
            <div className="w-full bg-gray-200 rounded-full h-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div
                className="h-2 rounded-full transition-all duration-1000 ease-out group-hover:w-full"
                style={{
                  backgroundColor: dotColor,
                  width: '100%' // Assuming 100% fill for simplicity as specific percentages aren't provided
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardOverview;






































// import React from 'react';
// import { Package, DollarSign, Users, Box } from 'lucide-react'; // Importing icons from lucide-react

// const DashboardOverview = ({ data }) => {
//   const getCardColor = (type) => {
//     switch (type) {
//       case 'Total Orders':
//         return 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100';
//       case 'Revenue':
//         return 'border-green-200 bg-gradient-to-br from-green-50 to-green-100';
//       case 'Active Staff':
//         return 'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100';
//       case 'Inventory Items':
//         return 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100';
//       default:
//         return 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100';
//     }
//   };

//   const getIconAndColor = (type) => {
//     switch (type) {
//       case 'Total Orders':
//         return { icon: Package, iconColor: 'text-blue-600', dotColor: '#3B82F6' };
//       case 'Revenue':
//         return { icon: DollarSign, iconColor: 'text-green-600', dotColor: '#10B981' };
//       case 'Active Staff':
//         return { icon: Users, iconColor: 'text-purple-600', dotColor: '#9333EA' };
//       case 'Inventory Items':
//         return { icon: Box, iconColor: 'text-yellow-600', dotColor: '#F59E0B' };
//       default:
//         return { icon: null, iconColor: 'text-gray-600', dotColor: '#9CA3AF' };
//     }
//   };

//   // Prepare data in a format similar to inventoryStats
//   const dashboardStats = [
//     { type: 'Total Orders', count: data.totalOrders.value, change: data.totalOrders.change },
//     { type: 'Revenue', count: data.revenue.value, change: data.revenue.change },
//     { type: 'Active Staff', count: data.activeStaff.value, new: data.activeStaff.new },
//     { type: 'Inventory Items', count: data.inventoryItems.value, lowStock: data.inventoryItems.lowStock },
//   ];

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mb-6">
//       {dashboardStats.map((stat, index) => {
//         const { icon: Icon, iconColor, dotColor } = getIconAndColor(stat.type);
//         return (
//           <div
//             key={index}
//             className={`${getCardColor(stat.type)} border rounded-2xl px-8 py-8 min-w-[220px] min-h-[180px] flex flex-col items-center justify-between shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer group`}
//             style={{
//               animationDelay: `${index * 100}ms`,
//               animation: 'slideInUp 0.6s ease-out forwards'
//             }}
//           >
//             <div className="flex flex-col items-center w-full mb-4">
//               <div className={`mb-4 ${iconColor} opacity-90 group-hover:opacity-100 transition-opacity duration-200`}>
//                 {Icon && <Icon size={40} />}
//               </div>
//               <p className="text-base font-medium text-gray-600 mb-1 group-hover:text-gray-700 transition-colors duration-200 text-center">
//                 {stat.type}
//               </p>
//               <p className="text-4xl font-extrabold text-gray-900 mb-1 group-hover:scale-105 transition-transform duration-200 text-center">
//                 {stat.count}
//               </p>
//               {/* Conditional display for change/new/low stock information */}
//               {stat.type === 'Total Orders' || stat.type === 'Revenue' ? (
//                 <p className={`text-sm ${stat.change.includes('+') ? 'text-green-500' : 'text-red-500'} text-center`}>
//                   {stat.change} from last month
//                 </p>
//               ) : stat.type === 'Active Staff' ? (
//                 <p className="text-sm text-gray-500 text-center">
//                   {stat.new} new this month
//                 </p>
//               ) : stat.type === 'Inventory Items' ? (
//                 <p className="text-sm text-red-500 text-center">
//                   {stat.lowStock} low stock
//                 </p>
//               ) : null}
//             </div>
//             {/* Animated progress bar - simplified for this context as percentage is not directly available */}
//             <div className="w-full bg-gray-200 rounded-full h-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//               <div
//                 className="h-2 rounded-full transition-all duration-1000 ease-out group-hover:w-full"
//                 style={{
//                   backgroundColor: dotColor,
//                   width: '100%' // Assuming 100% fill for simplicity as specific percentages aren't provided
//                 }}
//               ></div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default DashboardOverview;











// import React from 'react';

// const DashboardOverview = ({ data }) => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//       {/* Total Orders */}
//       <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
//         <div>
//           <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
//           <p className="text-3xl font-bold text-gray-900 mt-1">{data.totalOrders.value}</p>
//           <p className={`text-sm ${data.totalOrders.change.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
//             {data.totalOrders.change} from last month
//           </p>
//         </div>
//         <div className="p-3 bg-blue-100 rounded-full">
//           <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"></path></svg>
//         </div>
//       </div>

//       {/* Revenue */}
//       <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
//         <div>
//           <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
//           <p className="text-3xl font-bold text-gray-900 mt-1">{data.revenue.value}</p>
//           <p className={`text-sm ${data.revenue.change.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
//             {data.revenue.change} from last month
//           </p>
//         </div>
//         <div className="p-3 bg-green-100 rounded-full">
//           <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3-.895-3-2 1.343-2 3-2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"></path></svg>
//         </div>
//       </div>

//       {/* Active Staff */}
//       <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
//         <div>
//           <h3 className="text-gray-500 text-sm font-medium">Active Staff</h3>
//           <p className="text-3xl font-bold text-gray-900 mt-1">{data.activeStaff.value}</p>
//           <p className="text-sm text-gray-500">{data.activeStaff.new} new this month</p>
//         </div>
//         <div className="p-3 bg-purple-100 rounded-full">
//           <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7A4 4 0 1117 7 4 4 0 019 7z"></path></svg>
//         </div>
//       </div>

//       {/* Inventory Items */}
//       <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
//         <div>
//           <h3 className="text-gray-500 text-sm font-medium">Inventory Items</h3>
//           <p className="text-3xl font-bold text-gray-900 mt-1">{data.inventoryItems.value}</p>
//           <p className="text-sm text-red-500">{data.inventoryItems.lowStock} low stock</p>
//         </div>
//         <div className="p-3 bg-yellow-100 rounded-full">
//           <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 12h4m-4 4h4m-4 4h4"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5h6"></path></svg>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardOverview;