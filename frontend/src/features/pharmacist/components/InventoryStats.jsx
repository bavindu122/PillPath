import React from 'react';
import { Package, AlertTriangle, TrendingUp, Eye } from 'lucide-react';
import '../pages/index-pharmacist.css';

const InventoryStats = ({ totalProducts, lowStockCount, filteredCount }) => {
  const stats = [
    {
      title: "Total Products",
      value: totalProducts.toString(),
      subtitle: "In inventory",
      icon: Package,
      color: "blue"
    },
    {
      title: "Low Stock Items",
      value: lowStockCount.toString(),
      subtitle: "Need attention",
      icon: AlertTriangle,
      color: lowStockCount > 0 ? "orange" : "green"
    },
    {
      title: "Filtered Results",
      value: filteredCount.toString(),
      subtitle: "Currently showing",
      icon: Eye,
      color: "purple"
    },
    {
      title: "In Stock Value",
      value: "$12,450",
      subtitle: "Total inventory value",
      icon: TrendingUp,
      color: "green"
    }
  ];

  const getCardClass = (color) => {
    const classes = {
      blue: 'inventory-stats-blue',
      green: 'inventory-stats-green',
      orange: 'inventory-stats-orange',
      purple: 'inventory-stats-purple'
    };
    return classes[color] || classes.blue;
  };

  const getIconClass = (color) => {
    const classes = {
      blue: 'inventory-icon-blue',
      green: 'inventory-icon-green',
      orange: 'inventory-icon-orange',
      purple: 'inventory-icon-purple'
    };
    return classes[color] || classes.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${getCardClass(stat.color)} border rounded-xl p-6 hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer group`}
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
              
              <div className={`${getIconClass(stat.color)} opacity-80 group-hover:opacity-100 transition-opacity duration-200`}>
                <Icon className="h-8 w-8" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InventoryStats;
