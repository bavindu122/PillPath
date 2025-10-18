import React from "react";
import {
  Calendar,
  CreditCard,
  DollarSign,
  Package,
  Eye,
  Printer,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

const OrderCard = ({ order }) => {
  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get order type badge (only prescription and otc)
  const getOrderTypeBadge = (type) => {
    switch (type) {
      case "prescription":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <span className="mr-1">📋</span> Prescription
          </span>
        );
      case "otc":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="mr-1">🏷️</span> OTC Items
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <span className="mr-1">❓</span> Unknown
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden">
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {order.orderCode ||
                  order.orderNumber ||
                  order.id ||
                  order.orderId}
              </h3>
              <p className="text-base text-gray-900 font-medium">
                {order.customer?.name ||
                  order.patient?.name ||
                  order.patientName ||
                  order.customerName}
              </p>
              <p className="text-sm text-gray-500">
                {order.customer?.email ||
                  order.patient?.email ||
                  order.patientEmail ||
                  order.customerEmail}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            {getOrderTypeBadge(
              (order.orderType || order.type || "").toString().toLowerCase()
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-5 gap-10 mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Items</p>
            <p className="text-sm font-medium text-gray-900">
              {Array.isArray(order.items)
                ? order.items.length
                : order.itemDetails?.length || 0}{" "}
              items
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Total</p>
            <p className="text-sm font-medium text-gray-900">
              Rs.
              {Number(
                order.total || order.totalAmount || order.totals?.total
              ).toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Date</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(order.orderDate || order.createdAt || order.date)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Time</p>
            <p className="text-sm font-medium text-gray-900">
              {formatTime(order.orderDate || order.createdAt || order.date)}
            </p>
          </div>

          <div>
            <Link
              to={`/pharmacy/pharmacyorders/${
                order.id || order.orderId || order.pharmacyOrderId
              }`}
              className="inline-flex items-center px-3 py-1.5 mb-1 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
            >
              <Eye className="h-4 w-4 mr-1.5" />
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
