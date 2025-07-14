import React from 'react';
import { 
  Truck, 
  MapPin, 
  Calendar,
  Clock,
  CheckCircle,
  Package,
  User
} from 'lucide-react';

const DeliveryTracking = ({ deliveryInfo }) => {
  if (!deliveryInfo) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-600 bg-green-100';
      case 'In Transit':
        return 'text-blue-600 bg-blue-100';
      case 'Processing':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <Truck className="h-5 w-5 text-blue-600" />
            <span>Delivery Information</span>
          </h3>
        </div>

        {/* Delivery Status */}
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(deliveryInfo.deliveryStatus)}`}>
              {deliveryInfo.deliveryStatus}
            </span>
          </div>
          <p className="text-sm text-gray-600">Order successfully delivered</p>
        </div>

        {/* Delivery Details */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-500">Delivery Address</p>
              <p className="text-sm font-medium text-gray-800">{deliveryInfo.address}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Delivery Date</p>
              <p className="text-sm font-medium text-gray-800">{deliveryInfo.deliveryDate}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Delivery Time</p>
              <p className="text-sm font-medium text-gray-800">{deliveryInfo.actualDeliveryTime}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Package className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Tracking Number</p>
              <p className="text-sm font-medium text-gray-800">{deliveryInfo.trackingNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Signed By</p>
              <p className="text-sm font-medium text-gray-800">{deliveryInfo.signedBy}</p>
            </div>
          </div>
        </div>

        {/* Courier Information */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-800 mb-2">Courier Service</h5>
          <p className="text-sm text-blue-700">{deliveryInfo.courierService}</p>
          <p className="text-xs text-blue-600 mt-1">
            Delivered in {deliveryInfo.actualDeliveryTime}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-200">
          <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
            <Truck className="h-4 w-4" />
            <span className="text-sm">Track Future Orders</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracking;