import React from 'react';

const SalesSummaryCard = ({ title, value, suffix, prefix, change, icon: Icon }) => {
  const isPositiveChange = parseFloat(change) >= 0;
  
  const getCardColor = (cardTitle) => {
    switch (cardTitle) {
      case 'Total Sales':
        return 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'Total Orders':
        return 'border-green-200 bg-gradient-to-br from-green-50 to-green-100';
      case 'Average Order Value':
        return 'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'Customer Purchase Rate':
        return 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100';
      default:
        return 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100';
    }
  };

  const getIconAndColor = (cardTitle) => {
    switch (cardTitle) {
      case 'Total Sales':
        return { iconColor: 'text-blue-600', dotColor: '#3B82F6' };
      case 'Total Orders':
        return { iconColor: 'text-green-600', dotColor: '#10B981' };
      case 'Average Order Value':
        return { iconColor: 'text-purple-600', dotColor: '#9333EA' };
      case 'Customer Purchase Rate':
        return { iconColor: 'text-yellow-600', dotColor: '#F59E0B' };
      default:
        return { iconColor: 'text-gray-600', dotColor: '#9CA3AF' };
    }
  };

  const { iconColor, dotColor } = getIconAndColor(title);
  
  return (
    <div
      className={`${getCardColor(title)} border rounded-2xl px-8 py-8 min-w-[220px] min-h-[180px] flex flex-col items-center justify-between shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer group`}
    >
      <div className="flex flex-col items-center w-full mb-4">
        <div className={`mb-4 ${iconColor} opacity-90 group-hover:opacity-100 transition-opacity duration-200`}>
          {Icon && <Icon size={40} />}
        </div>
        <p className="text-base font-medium text-gray-600 mb-1 group-hover:text-gray-700 transition-colors duration-200 text-center">
          {title}
        </p>
        <p className="text-4xl font-extrabold text-gray-900 mb-1 group-hover:scale-105 transition-transform duration-200 text-center">
          {prefix && <span className="text-gray-700 mr-1 text-2xl">{prefix}</span>}
          {value}
          {suffix && <span className="text-gray-700 ml-1 text-2xl">{suffix}</span>}
        </p>
        <p className={`text-sm ${isPositiveChange ? 'text-green-500' : 'text-red-500'} text-center`}>
          {isPositiveChange ? '↑' : '↓'} {Math.abs(change)}% vs previous period
        </p>
      </div>
      
      {/* Animated progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div
          className="h-2 rounded-full transition-all duration-1000 ease-out group-hover:w-full"
          style={{
            backgroundColor: dotColor,
            width: '0%'
          }}
        ></div>
      </div>
    </div>
  );
};

export default SalesSummaryCard;



// import React from 'react';

// const SalesSummaryCard = ({ title, value, suffix, prefix, change, icon: Icon }) => {
//   const isPositiveChange = parseFloat(change) >= 0;
  
//   return (
//     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
//         {Icon && <Icon className="text-blue-600 w-5 h-5" />}
//       </div>
      
//       <div className="flex items-baseline">
//         {prefix && <span className="text-gray-700 mr-1">{prefix}</span>}
//         <span className="text-2xl font-bold text-gray-900">{value}</span>
//         {suffix && <span className="text-gray-700 ml-1">{suffix}</span>}
//       </div>
      
//       <div className="mt-2 flex items-center">
//         <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
//           isPositiveChange 
//             ? 'text-green-800 bg-green-100' 
//             : 'text-red-800 bg-red-100'
//         }`}>
//           {isPositiveChange ? '↑' : '↓'} {Math.abs(change)}%
//         </span>
//         <span className="text-xs text-gray-500 ml-2">vs previous period</span>
//       </div>
//     </div>
//   );
// };

// export default SalesSummaryCard;