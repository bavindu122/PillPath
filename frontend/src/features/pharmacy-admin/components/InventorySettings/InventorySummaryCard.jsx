import React from 'react';
import { Package, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
      {inventoryStats.map((stat, index) => {
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
                {stat.count}
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
      })}
    </div>
  );
};

export default InventorySummaryCard;