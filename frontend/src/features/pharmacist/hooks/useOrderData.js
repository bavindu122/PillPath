import { useState, useEffect } from 'react';

export const useOrderData = (orderId) => {
  const [orderData, setOrderData] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrderData();
    }
  }, [orderId]);

  const loadOrderData = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock order data
      const orderResult = {
        id: orderId || "PX-2025-001",
        orderNumber: `PX-${orderId || "2025-001"}`,
        patientName: "Mr. McCrae",
        patientEmail: "mccrae@email.com",
        patientPhone: "+1 (555) 123-4567",
        pharmacistName: "Dr. Sarah Johnson",
        dateCreated: "2025-07-10",
        dateCompleted: "2025-07-11",
        totalAmount: 67.48,
        paymentMethod: "Credit Card",
        status: "Completed",
        prescriptionImageUrl: "/src/assets/img/prescription.jpeg",
        notes: "Historical prescription successfully processed with modern equivalents",
        items: [
          {
            id: 1,
            name: "Salicylic Acid",
            dosage: "150mg",
            genericName: "Modern equivalent of Ac. Salicyl",
            quantity: 30,
            unitPrice: 15.99,
            totalPrice: 47.97,
            available: true,
            historicalNote: "Equivalent to gr 120 Ac. Salicyl from prescription"
          },
          {
            id: 2,
            name: "Topical Pain Relief Cream",
            genericName: "Modern equivalent of Collod Flexile",
            quantity: 1,
            unitPrice: 24.50,
            totalPrice: 24.50,
            available: true,
            historicalNote: "Modern substitute for historical Collod Flexile"
          }
        ]
      };

      const deliveryResult = {
        method: "Home Delivery",
        address: "123 Main Street, Springfield, IL 62701",
        deliveryDate: "2025-07-12",
        trackingNumber: "PX789012345",
        courierService: "PillPath Express",
        estimatedTime: "2-3 business days",
        actualDeliveryTime: "2 business days",
        deliveryStatus: "Delivered",
        signedBy: "John McCrae"
      };

      setOrderData(orderResult);
      setDeliveryInfo(deliveryResult);
    } catch (error) {
      console.error('Error loading order data:', error);
      setOrderData(null);
      setDeliveryInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    orderData,
    deliveryInfo,
    isLoading,
    refetch: loadOrderData
  };
};

export default useOrderData;