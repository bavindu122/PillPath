import React from 'react';
import '../pages/index-pharmacist.css';

const OrderStatsCards = ({ stats }) => {
  const getIconColor = (color) => {
    switch (color) {
      case 'blue':
        return 'from-blue-500 to-blue-600';
      case 'green':
        return 'from-green-500 to-green-600';
      case 'orange':
        return 'from-orange-500 to-orange-600';
      case 'purple':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getBgColor = (color) => {
    switch (color) {
      case 'blue':
        return 'from-blue-50 to-blue-100';
      case 'green':
        return 'from-green-50 to-green-100';
      case 'orange':
        return 'from-orange-50 to-orange-100';
      case 'purple':
        return 'from-purple-50 to-purple-100';
      default:
        return 'from-gray-50 to-gray-100';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`group bg-gradient-to-br ${getBgColor(stat.color)} rounded-xl border border-white/20 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden`}
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </h3>
              <h4 className="text-lg font-semibold text-gray-700 group-hover:text-gray-800 transition-colors duration-200 mb-1">
                {stat.title}
              </h4>
              <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                {stat.subtitle}
              </p>
            </div>
            
            <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getIconColor(stat.color)} opacity-80 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center`}>
              <div className="w-6 h-6 bg-white rounded-full opacity-80"></div>
            </div>
          </div>
          
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
        </div>
      ))}
    </div>
  );
};

export default OrderStatsCards;