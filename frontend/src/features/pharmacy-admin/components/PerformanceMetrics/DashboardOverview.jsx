import React from 'react';
import { Package, DollarSign, Users, Box, Wallet } from 'lucide-react'; // Added Wallet icon
import { useNavigate } from 'react-router-dom';

const DashboardOverview = ({ data }) => {
  const navigate = useNavigate(); // Initialize the navigation hook

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
            onClick={stat.type === 'Digital Wallet' ? () => navigate('/pharmacy/paymentgateway') : undefined}
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
// import { Package, DollarSign, Users, Box, Wallet } from 'lucide-react'; // Added Wallet icon
// import { useNavigate } from 'react-router-dom'



// const DashboardOverview = ({ data }) => {
//   const navigate = useNavigate(); // Initialize the navigation hook
  
//   // Handle card click - navigate based on card type
//   // const handleCardClick = (type) => {
//   //   if (type === 'Digital Wallet') {
//   //     navigate('/pharmacy/paymentgateway');
//   //   }
//   //   // You can add navigation for other cards here if needed
//   // };

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
//       case 'Digital Wallet': // New case for Digital Wallet
//         return 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100';
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
//       case 'Digital Wallet': // New case for Digital Wallet
//         return { icon: Wallet, iconColor: 'text-indigo-600', dotColor: '#6366F1' };
//       default:
//         return { icon: null, iconColor: 'text-gray-600', dotColor: '#9CA3AF' };
//     }
//   };

//   // Prepare data in a format similar to inventoryStats, including Digital Wallet
//   const dashboardStats = [
//     { type: 'Total Orders', count: data.totalOrders.value, change: data.totalOrders.change },
//     { type: 'Revenue', count: data.revenue.value, change: data.revenue.change },
//     { type: 'Active Staff', count: data.activeStaff.value, new: data.activeStaff.new },
//     { type: 'Inventory Items', count: data.inventoryItems.value, lowStock: data.inventoryItems.lowStock },
//     { type: 'Digital Wallet', count: data.digitalWallet.value, description: 'Current Balance' }, // New Digital Wallet entry
//   ];

//   return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-6">
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
//             onClick={stat.type === 'Digital Wallet' ? () => navigate('/pharmacy/paymentgateway') : undefined}
//           >
//             <div className="flex flex-col items-center w-full mb-4">
//               <div className={`mb-4 ${iconColor} opacity-90 group-hover:opacity-100 transition-opacity duration-200`}>
//                 {Icon && <Icon size={40} />}
//               </div>
//               <p className="text-base font-medium text-gray-600 mb-1 group-hover:text-gray-700 transition-colors duration-200 text-center">
//                 {stat.type}
//               </p>
//               <p className="text-4xl font-extrabold text-gray-900 mb-1 group-hover:scale-105 transition-transform duration-200 text-center">
//                 {stat.type === 'Digital Wallet' ? `$${stat.count}` : stat.count}
//               </p>
//               {/* Conditional display for change/new/low stock/description information */}
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
//               ) : stat.type === 'Digital Wallet' ? ( // Display description for Digital Wallet
//                 <p className="text-sm text-gray-500 text-center">
//                   {stat.description}
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
