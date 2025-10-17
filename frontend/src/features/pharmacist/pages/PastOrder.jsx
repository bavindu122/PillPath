import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PharmaPageLayout from "../components/PharmaPageLayout";
import CompletedOrderViewer from "../components/CompletedOrderViewer";
import OrderSummary from "../components/OrderSummary";
import PatientInfo from "../components/PatientInfo";
import DeliveryTracking from "../components/DeliveryTracking";
import useOrderData from "../hooks/useOrderData";
import { orderService } from "../services/orderService";
import "./index-pharmacist.css";

const PastOrder = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { orderData, deliveryInfo, isLoading, refetch } = useOrderData(orderId);

  // Compute valid next statuses based on current status
  const nextStatusOptions = useMemo(() => {
    const s = orderData?.status;
    if (!s) return [];
    switch (s) {
      case "RECEIVED":
        return ["PREPARING", "CANCELLED"];
      case "PREPARING":
        return ["READY_FOR_PICKUP", "CANCELLED"];
      case "READY_FOR_PICKUP":
        return ["HANDED_OVER", "CANCELLED"];
      default:
        return [];
    }
  }, [orderData?.status]);

  const [isUpdating, setIsUpdating] = useState(false);
  const handleStatusChange = async (newStatus) => {
    if (!orderId || !newStatus) return;
    setIsUpdating(true);
    try {
      await orderService.updateStatus(orderId, newStatus);
      await refetch();
    } catch (e) {
      const msg = e?.message || "Failed to update status";
      alert(msg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrintOrder = () => {
    console.log("Printing order:", orderData);
    window.print();
  };

  const handleExportPDF = () => {
    // TODO: Implement export to PDF functionality
    alert("Export to PDF is not yet implemented.");
    console.log("Exporting order to PDF:", orderData);
  };

  const handleReorder = () => {
    console.log("Creating reorder from:", orderData);
    // Navigate to create new order with same items
  };

  const statusStyles = {
    RECEIVED:
      "from-blue-500 to-blue-600 text-blue-700 bg-blue-50 border-blue-100",
    PREPARING:
      "from-amber-500 to-amber-600 text-amber-700 bg-amber-50 border-amber-100",
    READY_FOR_PICKUP:
      "from-indigo-500 to-indigo-600 text-indigo-700 bg-indigo-50 border-indigo-100",
    HANDED_OVER:
      "from-green-500 to-green-600 text-green-700 bg-green-50 border-green-100",
    CANCELLED:
      "from-gray-400 to-gray-500 text-gray-700 bg-gray-50 border-gray-200",
  };
  const s = orderData?.status || "RECEIVED";

  const headerActions = orderData && (
    <div className="flex items-center space-x-2">
      <div
        className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${
          statusStyles[s] || statusStyles.RECEIVED
        } border rounded-full shadow-sm`}
      >
        <div
          className={`w-3 h-3 bg-gradient-to-r ${
            statusStyles[s]?.split(" ").slice(0, 2).join(" ") ||
            "from-blue-500 to-blue-600"
          } rounded-full flex items-center justify-center`}
        >
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
        <p className="text-sm font-semibold">
          {s
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/(^|\s)\S/g, (c) => c.toUpperCase())}
        </p>
      </div>
      {nextStatusOptions.length > 0 && (
        <div className="flex items-center space-x-2">
          <select
            disabled={isUpdating}
            className="text-sm border rounded-lg px-2 py-1 bg-white"
            defaultValue="__next__"
            onChange={(e) => {
              const val = e.target.value;
              if (val !== "__next__") handleStatusChange(val);
            }}
          >
            <option value="__next__" disabled>
              Update Status
            </option>
            {nextStatusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt
                  .replaceAll("_", " ")
                  .toLowerCase()
                  .replace(/(^|\s)\S/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
          <button
            disabled
            title="Allowed transitions only"
            className="text-xs text-gray-500"
          >
            i
          </button>
        </div>
      )}
    </div>
  );

  return (
    <PharmaPageLayout
      title="Order Details"
      subtitle={
        orderData
          ? `Order ${orderData.orderNumber} - ${orderData.patientName}`
          : "Loading order details..."
      }
      isLoading={isLoading}
      loadingMessage="Loading order details..."
      showBackButton={true}
      onBack={() => navigate(-1)}
      headerActions={headerActions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Order Overview - Full width on mobile, 2 cols on large screens */}
        <div className="lg:col-span-2 xl:col-span-2 space-y-4 sm:space-y-6">
          <div className="dashboard-fade-in-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 glass-hover">
              <CompletedOrderViewer
                orderData={orderData}
                onPrint={handlePrintOrder}
                onExportPDF={handleExportPDF}
                onRefresh={refetch}
              />
            </div>
          </div>
        </div>

        {/* Patient Info - Full width on mobile, 1 col on large screens */}
        <div className="lg:col-span-2 xl:col-span-1 space-y-4 sm:space-y-6">
          <div className="dashboard-fade-in-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 glass-hover">
              <PatientInfo
                patientData={{
                  name: orderData?.patientName,
                  email: orderData?.patientEmail,
                  phone: orderData?.patientPhone,
                  orderDate: orderData?.dateCreated,
                  completedDate: orderData?.dateCompleted,
                }}
              />
            </div>
          </div>
        </div>

        {/* Delivery Tracking - Full width on mobile */}
        <div className="lg:col-span-1 xl:col-span-1 space-y-4 sm:space-y-6">
          <div className="dashboard-fade-in-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 glass-hover">
              <DeliveryTracking deliveryInfo={deliveryInfo} />
            </div>
          </div>
        </div>

        {/* Order Summary - Full width on mobile, 2 cols on large screens */}
        <div className="lg:col-span-1 xl:col-span-2 space-y-4 sm:space-y-6">
          <div className="dashboard-fade-in-5">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 glass-hover">
              <OrderSummary
                orderData={orderData}
                onReorder={handleReorder}
                onPrint={handlePrintOrder}
                onExportPDF={handleExportPDF}
              />
            </div>
          </div>
        </div>
      </div>
    </PharmaPageLayout>
  );
};

export default PastOrder;
