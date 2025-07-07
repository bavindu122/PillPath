import React from 'react';
import { AlertTriangle, Package, ShoppingCart } from 'lucide-react';

const InventoryAlerts = ({ alerts }) => {
  const getAlertColor = (type) => {
    switch (type) {
      case 'critical':
        return 'border-l-red-500 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200';
      case 'low':
        return 'border-l-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200';
      case 'medium':
        return 'border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200';
      default:
        return 'border-l-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200';
    }
  };

  const getTextColor = (type) => {
    switch (type) {
      case 'critical':
        return 'text-red-800';
      case 'low':
        return 'text-orange-800';
      case 'medium':
        return 'text-yellow-800';
      default:
        return 'text-gray-800';
    }
  };

  const getIcon = (type) => {
    if (type === 'critical') {
      return <AlertTriangle className="h-4 w-4 animate-pulse" />;
    }
    return <Package className="h-4 w-4" />;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <div className="w-1 h-5 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full mr-3"></div>
          Inventory Alerts
        </h2>
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={alert.id}
            className={`border-l-4 p-4 rounded-lg transition-all duration-300 cursor-pointer transform hover:scale-102 ${getAlertColor(alert.type)}`}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'slideInRight 0.5s ease-out forwards'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className={`${getTextColor(alert.type)} flex-shrink-0`}>
                  {getIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{alert.medication}</h4>
                  <p className={`text-xs ${getTextColor(alert.type)} font-medium`}>{alert.status}</p>
                </div>
              </div>
              <button className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-lg hover:bg-blue-200 hover:shadow-md transform hover:scale-105 transition-all duration-200">
                <ShoppingCart className="h-3 w-3" />
                <span>Reorder</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryAlerts;