import { useEffect, useState } from "react";
import { orderService } from "../services/orderService";

export default function useOrderData(orderId) {
  const [orderData, setOrderData] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Loader exposed for manual refresh
  const loadOrderData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const order = await orderService.getOrder(orderId);
      setOrderData(order);

      // Adapt DeliveryTracking to show pickup details
      const pickup = order.pickup || {};
      setDeliveryInfo({
        mode: "pickup",
        code: pickup.code,
        location: pickup.location,
        coords:
          pickup.lat != null && pickup.lng != null
            ? { lat: pickup.lat, lng: pickup.lng }
            : null,
        status: order.status,
        eta: null,
        timeline: [
          { label: "Created", at: order.dateCreated },
          { label: "Updated", at: order.dateCompleted || null },
        ].filter((t) => t.at),
      });
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      loadOrderData();
    }
  }, [orderId]);

  return { orderData, deliveryInfo, isLoading, error, refetch: loadOrderData };
}
