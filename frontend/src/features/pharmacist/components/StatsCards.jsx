import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import '../pages/index-pharmacist.css';

const StatsCards = ({ stats }) => {
  const getCardColor = (color) => {
    const colors = {
      blue: 'stats-card-blue',
      green: 'stats-card-green',
      orange: 'stats-card-orange',
      purple: 'stats-card-purple'
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = (color) => {
    const colors = {
      blue: 'stats-icon-blue',
      green: 'stats-icon-green',
      orange: 'stats-icon-orange',
      purple: 'stats-icon-purple'
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
              <p className="text-sm font-medium mb-2 group-hover:transition-colors duration-200" style={{ color: 'var(--pharma-gray-600)' }}>
                {stat.title}
              </p>
              <p className="text-3xl font-bold mb-1 group-hover:scale-105 transition-transform duration-200" style={{ color: 'var(--pharma-gray-900)' }}>
                {stat.value}
              </p>
              <p className="text-xs group-hover:transition-colors duration-200" style={{ color: 'var(--pharma-gray-500)' }}>
                {stat.subtitle}
              </p>
            </div>
            
            <div className={`${getIconColor(stat.color)} opacity-80 group-hover:opacity-100 transition-opacity duration-200`}>
              <div className={`w-4 h-4 rounded-full group-hover:animate-pulse`} style={{
                backgroundColor: stat.color === 'blue' ? 'var(--pharma-blue-600)' : 
                               stat.color === 'green' ? 'var(--pharma-green-600)' : 
                               stat.color === 'orange' ? 'var(--pharma-orange-600)' : 'var(--pharma-purple-600)'
              }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;