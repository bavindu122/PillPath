import React from "react";
import { Eye, Printer, User } from "lucide-react";
import { Link } from "react-router-dom";
import "../pages/index-pharmacist.css";

const OrderTable = ({ orders, onPrintOrder }) => {
  const getTypeIcon = (type) => {
    const t = (type || "").toLowerCase();
    switch (t) {
      case "prescription":
        return (
          <span
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: "var(--pharma-blue-100)", // #bfdbfe
              color: "var(--pharma-blue-800)", // dark blue text
            }}
          >
            📋 Prescription
          </span>
        );
      case "otc":
        return (
          <span
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: "var(--pharma-red-100)", // light red
              color: "var(--pharma-red-800)", // dark red text
            }}
          >
            💊 OTC
          </span>
        );
      default:
        return type;
    }
  };

  const getPaymentMethodIcon = (paymentMethod) => {
    const pm = (paymentMethod || "").toLowerCase();
    switch (pm) {
      case "cash":
        return (
          <span
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: "var(--pharma-green-100)", // light green
              color: "var(--pharma-green-600)", // dark green text
            }}
          >
            💵 Cash
          </span>
        );
      case "credit card":
      case "card":
        return (
          <span
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: "var(--pharma-purple-100)", // light purple
              color: "var(--pharma-purple-600)", // dark purple text
            }}
          >
            💳 Card
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium pharma-bg-gray-100 pharma-text-gray-800">
            {paymentMethod}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
          <p className="text-sm">
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold pharma-text-dark">
          Processed Orders
        </h3>
        <div className="text-sm pharma-text-muted">
          Showing 1 to {Math.min(10, orders.length)} of {orders.length} results
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className="border pharma-border rounded-xl p-6 pharma-bg-card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group animate-fade-in-left backdrop-blur-sm"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Order Details */}
                  <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-semibold pharma-text-dark group-hover:pharma-text-primary transition-colors duration-200">
                            {order.orderCode || `Order #${order.id}`}
                          </h4>
                          <p className="text-sm pharma-text-gray-600">
                            {order.patient.name}
                          </p>
                          <p className="text-xs pharma-text-muted">
                            {order.patient.email}
                          </p>
                        </div>                        <div className="flex items-center space-x-3">
                          {getTypeIcon(order.type)}
                          {getPaymentMethodIcon(order.paymentMethod)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-xs pharma-text-muted mt-3">
                      <span className="flex flex-col">
                        <span className="text-gray-400">Items</span>
                        <span className="text-gray-700 font-medium">
                          {order.items != null && order.items > 0 ? `${order.items} items` : "0 items"}
                        </span>
                      </span>
                      <span className="flex flex-col">
                        <span className="text-gray-400">Total</span>
                        <span className="text-gray-700 font-medium">
                          Rs.{Number(order.total ?? 0).toFixed(2)}
                        </span>
                      </span>
                      <span className="flex flex-col">
                        <span className="text-gray-400">Date</span>
                        <span className="text-gray-700 font-medium">
                          {formatDate(order.date)}
                        </span>
                      </span>
                      <span className="flex flex-col">
                        <span className="text-gray-400">Time</span>
                        <span className="text-gray-700 font-medium">
                          {order.time || "-"}
                        </span>
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
                    state={{ activeOverride: "orders" }}
                    className="flex items-center space-x-1 px-4 py-2 bg-blue-200 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-200 hover:shadow-md transform hover:scale-105 transition-all duration-200"
                  >
                    <Eye className="h-3 w-3" />
                    <span>View</span>
                  </Link>

                  {(order.actions || []).includes("print") && (
                    <button
                      onClick={() => onPrintOrder(order.id)}
                      className="flex items-center space-x-1 px-4 py-2 bg-green-200 text-green-700 text-xs font-medium rounded-lg hover:bg-green-200 hover:shadow-md transform hover:scale-105 transition-all duration-200"
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
            Showing 1 to {Math.min(10, orders.length)} of {orders.length}{" "}
            results
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
