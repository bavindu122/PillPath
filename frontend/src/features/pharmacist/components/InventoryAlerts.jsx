import React from "react";
import { AlertTriangle, Package, ShoppingCart } from "lucide-react";
import "../pages/index-pharmacist.css";

const InventoryAlerts = ({ alerts }) => {
  const getAlertColor = (type) => {
    switch (type) {
      case "critical":
        return "alert-critical";
      case "low":
        return "alert-low";
      case "medium":
        return "alert-medium";
      default:
        return "alert-default";
    }
  };

  const getTextColor = (type) => {
    switch (type) {
      case "critical":
        return "text-critical";
      case "low":
        return "text-low";
      case "medium":
        return "text-medium";
      default:
        return "text-default";
    }
  };

  const getIcon = (type) => {
    if (type === "critical") {
      return <AlertTriangle className="h-4 w-4 animate-pulse" />;
    }
    return <Package className="h-4 w-4" />;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-lg font-semibold flex items-center"
          style={{ color: "var(--pharma-gray-900)" }}
        >
          <div
            className="w-1 h-5 rounded-full mr-3"
            style={{
              background:
                "linear-gradient(to bottom, var(--pharma-orange-500), var(--pharma-orange-600))",
            }}
          ></div>
          Inventory Alerts
        </h2>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={alert.id}
            className={`border-l-4 p-4 rounded-lg transition-all duration-300 cursor-pointer transform hover:scale-102 ${getAlertColor(
              alert.type
            )}`}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: "slideInRight 0.5s ease-out forwards",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className={`${getTextColor(alert.type)} flex-shrink-0`}>
                  {getIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <h4
                    className="font-medium text-sm mb-1"
                    style={{ color: "var(--pharma-gray-900)" }}
                  >
                    {alert.medication}
                  </h4>
                  <p
                    className={`text-xs font-medium ${getTextColor(
                      alert.type
                    )}`}
                  >
                    {alert.status}
                  </p>
                </div>
              </div>
              {/* Reorder button removed as requested */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryAlerts;
