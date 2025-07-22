import React from 'react';
// Assuming you might use icons from lucide-react if you had them for a "Reorder" button,
// but for now, we'll stick to the SVG provided in the original.
// import { ShoppingCart } from 'lucide-react';

const LowStockAlerts = ({ alerts }) => {
  // Define colors for low stock alerts (often red or orange)
  const getAlertColor = () => {
    return 'border-l-red-500 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200';
  };

  const getTextColor = () => {
    return 'text-red-800';
  };

  return (
    <div className="p-6"> {/* Main container with consistent padding */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          {/* Decorative element from InventoryAlerts, using a relevant color like red/orange */}
          <div className="w-1 h-5 bg-gradient-to-b from-red-500 to-red-600 rounded-full mr-3"></div>
          Low Stock Alerts
        </h2>
        {/* Optional: Add a 'View All' or similar button here if desired */}
      </div>

      <div className="space-y-3"> {/* For consistent spacing between alert items */}
        {alerts.map((alert, index) => (
          <div
            key={index} // Using index as key as in original, consider using a unique ID if available
            className={`border-l-4 p-4 rounded-lg transition-all duration-300 cursor-pointer transform hover:scale-102 ${getAlertColor()}`}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'slideInRight 0.5s ease-out forwards'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1"> {/* Increased space-x for icon and text */}
                <div className={`${getTextColor()} flex-shrink-0`}>
                  {/* Original warning SVG, now styled with consistent size/color for the icon container */}
                  <div className="w-5 h-5 text-red-600">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  </div>
                </div>
                <div className="flex-1">
                  {/* Changed to h4 and adjusted text size for consistency */}
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{alert.itemName}</h4>
                  {/* Changed to text-xs and applied consistent text color */}
                  <p className={`text-xs ${getTextColor()} font-medium`}>Only {alert.unitsLeft} units left</p>
                </div>
              </div>
              {/* Reorder button styled like the 'Reorder' button in InventoryAlerts */}
              <button className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-lg hover:bg-blue-200 hover:shadow-md transform hover:scale-105 transition-all duration-200">
                {/* If you have lucide-react installed, you could use <ShoppingCart className="h-3 w-3" /> */}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"></path></svg>
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


