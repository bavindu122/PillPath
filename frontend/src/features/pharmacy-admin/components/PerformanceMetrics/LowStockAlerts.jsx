import React from 'react';
import useStockAlerts from '../../../../../src/hooks/useStockAlerts';

const LowStockAlerts = ({ pharmacyId = 1 }) => {
  const { alerts, isLoading, error, refreshAlerts } = useStockAlerts(pharmacyId);

  const getAlertColor = () => {
    return 'border-l-red-500 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200';
  };

  const getTextColor = () => {
    return 'text-red-800';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mb-2 mx-auto"></div>
            <p className="text-sm text-gray-500">Loading alerts...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 rounded-lg border border-red-200 p-4 text-center">
          <p className="text-red-800 text-sm mb-3">{error}</p>
          <button
            onClick={refreshAlerts}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (alerts.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full mr-3"></div>
            Low Stock Alerts
          </h2>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-6 text-center">
          <p className="text-green-800 text-sm">All stock levels are good! 🎉</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <div className="w-1 h-5 bg-gradient-to-b from-red-500 to-red-600 rounded-full mr-3"></div>
          Low Stock Alerts
          <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            {alerts.length}
          </span>
        </h2>
        <button
          onClick={refreshAlerts}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          title="Refresh alerts"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className={`border-l-4 p-4 rounded-lg transition-all duration-300 cursor-pointer transform hover:scale-102 ${getAlertColor()}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                {/* Warning Icon */}
                <div className="flex-shrink-0 text-red-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  {/* Product Name */}
                  <h4 className="font-semibold text-gray-900 text-base mb-1">
                    {alert.itemName}
                  </h4>
                  
                  {/* Stock & Category Info */}
                  <div className="flex items-center gap-3">
                    {/* Current Stock */}
                    <p className={`text-sm ${getTextColor()} font-medium`}>
                      Stock: <span className="font-bold">{alert.unitsLeft}</span> units
                    </p>
                    
                    {/* Category Badge */}
                    {alert.category && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-md font-medium">
                          {alert.category}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Reorder Button */}
              <button 
                onClick={() => console.log('Reorder:', alert.itemName)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-lg hover:bg-blue-200 hover:shadow-md transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"></path>
                </svg>
                <span>Reorder</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LowStockAlerts;












