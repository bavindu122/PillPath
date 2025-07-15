import React from 'react';
import { Eye, Printer, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderTable = ({ orders, onPrintOrder }) => {
  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'prescription':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            📋 Prescription
          </span>
        );
      case 'otc':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            💊 OTC
          </span>
        );
      default:
        return type;
    }
  };

  const getPaymentMethodIcon = (paymentMethod) => {
    switch (paymentMethod.toLowerCase()) {
      case 'cash':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            💵 Cash
          </span>
        );
      case 'credit card':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            💳 Card
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {paymentMethod}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (orders.length === 0) {
    return (
      <div className="p-8">
        <div className="text-center py-12 text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-700">No orders found</p>
          <p className="text-sm">Try adjusting your search or filter criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Processed Prescriptions</h3>
        <div className="text-sm text-gray-500">
          Showing 1 to {Math.min(10, orders.length)} of {orders.length} results
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-xl p-6 hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1 group animate-fade-in-left bg-white/50 backdrop-blur-sm"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Patient Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center group-hover:shadow-md transition-shadow duration-200">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>

                  {/* Order Details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                            {order.id}
                          </h4>
                          <p className="text-sm text-gray-600">{order.patient.name}</p>
                          <p className="text-xs text-gray-400">{order.patient.email}</p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(order.type)}
                          {getPaymentMethodIcon(order.paymentMethod)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-xs text-gray-500 mt-3">
                      <span className="flex flex-col">
                        <span className="text-gray-400">Items</span>
                        <span className="text-gray-700 font-medium">{order.items} items</span>
                      </span>
                      <span className="flex flex-col">
                        <span className="text-gray-400">Total</span>
                        <span className="text-gray-700 font-medium">${order.total.toFixed(2)}</span>
                      </span>
                      <span className="flex flex-col">
                        <span className="text-gray-400">Date</span>
                        <span className="text-gray-700 font-medium">{formatDate(order.date)}</span>
                      </span>
                      <span className="flex flex-col">
                        <span className="text-gray-400">Time</span>
                        <span className="text-gray-700 font-medium">{order.time}</span>
                      </span>
                    </div>

                    {/* Notes section */}
                    {order.notes && (
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        <div className="text-xs">
                          <span className="text-gray-400">Notes:</span>
                          <span className="text-gray-600 italic ml-2">
                            {order.notes}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                  <Link
                    to={`/pharmacist/orders/${order.id}`}
                    className="flex items-center space-x-1 px-4 py-2 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-200 hover:shadow-md transform hover:scale-105 transition-all duration-200"
                  >
                    <Eye className="h-3 w-3" />
                    <span>View</span>
                  </Link>
                  
                  {order.actions.includes('print') && (
                    <button
                      onClick={() => onPrintOrder(order.id)}
                      className="flex items-center space-x-1 px-4 py-2 bg-green-100 text-green-700 text-xs font-medium rounded-lg hover:bg-green-200 hover:shadow-md transform hover:scale-105 transition-all duration-200"
                    >
                      <Printer className="h-3 w-3" />
                      <span>Print</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing 1 to {Math.min(10, orders.length)} of {orders.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-200">
              ←
            </button>
            <button className="px-3 py-1 text-sm bg-blue-100 border border-blue-200 rounded-lg text-blue-700">
              1
            </button>
            <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-200">
              2
            </button>
            <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-200">
              3
            </button>
            <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors duration-200">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;