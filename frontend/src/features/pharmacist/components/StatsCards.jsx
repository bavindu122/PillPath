import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const getCardColor = (color) => {
    const colors = {
      blue: 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100',
      green: 'border-green-200 bg-gradient-to-br from-green-50 to-green-100',
      orange: 'border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100',
      purple: 'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100'
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = (color) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      orange: 'text-orange-600',
      purple: 'text-purple-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${getCardColor(stat.color)} border rounded-xl p-6 hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer group`}
          style={{
            animationDelay: `${index * 100}ms`,
            animation: 'slideInUp 0.6s ease-out forwards'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2 group-hover:text-gray-700 transition-colors duration-200">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-1 group-hover:scale-105 transition-transform duration-200">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                {stat.subtitle}
              </p>
            </div>
            
            <div className={`${getIconColor(stat.color)} opacity-80 group-hover:opacity-100 transition-opacity duration-200`}>
              <div className={`w-4 h-4 rounded-full group-hover:animate-pulse`} style={{
                backgroundColor: index === 0 ? '#3B82F6' : 
                               index === 1 ? '#10B981' : 
                               index === 2 ? '#F59E0B' : '#8B5CF6'
              }}></div>
            </div>
          </div>
          
          {/* Animated progress bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div 
              className={`h-1 rounded-full transition-all duration-1000 ease-out group-hover:w-full`}
              style={{
                backgroundColor: index === 0 ? '#3B82F6' : 
                               index === 1 ? '#10B981' : 
                               index === 2 ? '#F59E0B' : '#8B5CF6',
                width: '0%'
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;