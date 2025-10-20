import React from 'react';

const RecentOrders = ({ orders = [] }) => {
  // Helper function to get alert colors based on order status
  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'border-l-green-500 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200';
      case 'Pending':
        return 'border-l-yellow-500 bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200';
      case 'Cancelled': // Assuming a 'Cancelled' status might exist
        return 'border-l-red-500 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200';
      default:
        return 'border-l-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200';
    }
  };

  // Helper function to get text colors based on order status
  const getOrderStatusTextColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-green-800';
      case 'Pending':
        return 'text-yellow-800';
      case 'Cancelled':
        return 'text-red-800';
      default:
        return 'text-gray-800';
    }
  };

  // Helper function to get the icon based on order status
  const getOrderIcon = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        );
      case 'Pending':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        );
      case 'Cancelled': // Icon for cancelled status
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        );
      default:
        return null; // Or a default icon if needed
    }
  };

  return (
    <div className="p-6"> {/* The main container, similar to InventoryAlerts */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          {/* Decorative element from InventoryAlerts */}
          <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-3"></div>
          Recent Orders
        </h2>
        {/* Optional: Add a 'View All' button here if desired, similar to InventoryAlerts */}
      </div>

      <div className="space-y-3"> {/* For consistent spacing between order items */}
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div
              key={order.id}
              // Apply similar styling as InventoryAlerts
              className={`border-l-4 p-4 rounded-lg transition-all duration-300 cursor-pointer transform hover:scale-102 ${getOrderStatusColor(order.status)}`}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'slideInRight 0.5s ease-out forwards' // Keep the animation
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1"> {/* Increased space-x for icon and text */}
                  <div className={`${getOrderStatusTextColor(order.status)} flex-shrink-0`}>
                    {getOrderIcon(order.status)} {/* Use the new helper for icons */}
                  </div>
                  <div className="flex-1">
                    {/* Changed to h4 and adjusted text size for consistency */}
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{order.id}</h4>
                    {/* Combined customerName and amount, using a slightly different text color for consistency */}
                    <p className={`text-xs ${getOrderStatusTextColor(order.status)} font-medium`}>
                      {order.customerName} - {order.amount}
                    </p>
                  </div>
                </div>
                {/* Status badge, using similar styling to the 'Reorder' button */}
                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p className="text-gray-500 text-sm">No recent orders available</p>
            <p className="text-gray-400 text-xs mt-1">Recent orders will appear here once available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;


