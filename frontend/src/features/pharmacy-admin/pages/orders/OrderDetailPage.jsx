import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import OrderDetails from "../../components/Orders/OrderDetails";
import useOrdersData from "../../hooks/useOrderData";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById, getOrderDetail, isLoading } = useOrdersData();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (isLoading) return;
      try {
        const foundOrder = getOrderById(orderId);
        if (foundOrder && foundOrder.items) {
          if (active) setOrder(foundOrder);
          return;
        }
        const detail = await getOrderDetail(orderId);
        if (active) setOrder(detail);
      } catch (e) {
        if (active) setError("Order not found");
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [orderId, getOrderById, getOrderDetail, isLoading]);

  // Simple page layout for consistency
  const PageLayout = ({
    children,
    title,
    subtitle,
    isLoading,
    loadingMessage,
  }) => (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/pharmacy/pharmacyorders")}
            className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-gray-500">{loadingMessage || "Loading..."}</p>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );

  if (isLoading) {
    return (
      <PageLayout
        title="Order Details"
        subtitle="Loading order information..."
        isLoading={true}
        loadingMessage="Loading order details..."
      />
    );
  }

  if (error) {
    return (
      <PageLayout title="Order Not Found">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium text-red-600 mb-2">{error}</h3>
          <p className="text-gray-500 mb-4">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/pharmacy/pharmacyorders")}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </button>
        </div>
      </PageLayout>
    );
  }

  if (!order) return null;

  return (
    <PageLayout
      title={`Order ${
        order.orderCode || order.orderNumber || order.id || order.orderId
      }`}
      subtitle={
        order.orderDate || order.createdAt || order.dateCreated
          ? `Placed on ${new Date(
              order.orderDate || order.createdAt || order.dateCreated
            ).toLocaleDateString()}`
          : undefined
      }
      isLoading={false}
    >
      <OrderDetails order={order} />
    </PageLayout>
  );
};

export default OrderDetailPage;
