import React from 'react';
import { Package, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'; // Importing icons from lucide-react
import { TrendingUp, TrendingDown } from 'lucide-react';


const InventorySummaryCard = ({ inventoryStats }) => {
  const getCardColor = (type) => {
    switch (type) {
      case 'Total Products':
        return 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'In Stock':
        return 'border-green-200 bg-gradient-to-br from-green-50 to-green-100';
      case 'Low Stock':
        return 'border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100';
      case 'Out of Stock':
        return 'border-red-200 bg-gradient-to-br from-red-50 to-red-100';
      default:
        return 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100';
    }
  };

  const getIconAndColor = (type) => {
    switch (type) {
      case 'Total Products':
        return { icon: Package, iconColor: 'text-blue-600', dotColor: '#3B82F6' };
      case 'In Stock':
        return { icon: CheckCircle, iconColor: 'text-green-600', dotColor: '#10B981' };
      case 'Low Stock':
        return { icon: AlertTriangle, iconColor: 'text-orange-600', dotColor: '#F59E0B' };
      case 'Out of Stock':
        return { icon: XCircle, iconColor: 'text-red-600', dotColor: '#EF4444' };
      default:
        return { icon: null, iconColor: 'text-gray-600', dotColor: '#9CA3AF' };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
      {inventoryStats.map((stat, index) => {
        const { icon: Icon, iconColor, dotColor } = getIconAndColor(stat.type);
        return (
          <div
            key={index}
            className={`${getCardColor(stat.type)} border rounded-xl p-6 min-w-64 min-h-40  hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer group flex flex-col justify-between`}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'slideInUp 0.6s ease-out forwards'
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-base font-medium text-gray-600 mb-2 group-hover:text-gray-700 transition-colors duration-200">
                  {stat.type}
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-1 group-hover:scale-105 transition-transform duration-200">
                  {stat.count}
                </p>
                {/* You can add a subtitle here if your inventory stats have one */}
                {/* <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                  {stat.subtitle}
                </p> */}
              </div>

              <div className={`${iconColor} opacity-80 group-hover:opacity-100 transition-opacity duration-200`}>
                {Icon && <Icon size={28} />} {/* Render the Lucide icon */}
                {/* <div className={`w-4 h-4 rounded-full group-hover:animate-pulse`} style={{ backgroundColor: dotColor }}></div> */}
              </div>
            </div>

            {/* Animated progress bar */}
            <div className="mt-auto w-full bg-gray-200 rounded-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div
                className={`h-1 rounded-full transition-all duration-1000 ease-out group-hover:w-full`}
                style={{
                  backgroundColor: dotColor,
                  width: '0%'
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InventorySummaryCard;




















// import React from 'react';

// const getCardDetails = (type) => {
//   let color = 'blue';
//   let subtitle = 'Current inventory summary';
//   let icon = '';

//   switch (type) {
//     case 'Total Products':
//       color = 'blue';
//       subtitle = 'All products in the system';
//       icon = '📦'
//       break;
//     case 'In Stock':
//       color = 'green';
//       subtitle = 'Available for immediate sale';
//       icon = '✅';
//       break;
//     case 'Low Stock':
//       color = 'orange';
//       subtitle = 'Needs urgent reordering';
//       icon = '⚠️';
//       break;
//     case 'Out of Stock':
//       color = 'purple'; 
//       subtitle = 'Currently unavailable';
//       icon = '⛔';
//       break;
//     default:
//       color = 'blue';
//       subtitle = 'Inventory status';
//       icon = ' '
//   }
//   return { color, subtitle,icon };
// };

// const InventorySummaryCard = ({ type, count }) => {
//   const { color, subtitle ,icon} = getCardDetails(type);

  
//   const statsArray = [
//     {
//       title: type,
//       value: count,
//       subtitle: subtitle,
//       color: color,
//       icon: icon, 
      
//     },
//   ];

//   return (
//     <StatCards stats={statsArray} />
//   );
// };











// const getIconAndColor = (type) => {
//   switch (type) {
//     case 'Total Products':
//       return { icon: '📦', bgColor: 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100', textColor: 'text-blue-600' };
//     case 'In Stock':
//       return { icon: '✅', bgColor: 'bg-green-100', textColor: 'text-green-600' };
//     case 'Low Stock':
//       return { icon: '⚠️', bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' };
//     case 'Out of Stock':
//       return { icon: '⛔', bgColor: 'bg-red-100', textColor: 'text-red-600' };
//     default:
//       return { icon: '', bgColor: 'bg-gray-100', textColor: 'text-gray-600' };
//   }
// };

// const InventorySummaryCard = ({ type, count }) => {
//   const { icon, bgColor, textColor } = getIconAndColor(type);

//   return (

    
    
//     <div className="flex items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow">
//       <div className={`p-3 rounded-full ${bgColor} mr-4`}>
//         <span className={`text-xl ${textColor}`}>{icon}</span>
//       </div>
//       <div>
//         <div className="text-sm font-medium text-gray-500">{type}</div>
//         <div className="text-2xl font-bold text-gray-900">{count}</div>
//       </div>
//     </div>
   
//   );
// };

// export default InventorySummaryCard;