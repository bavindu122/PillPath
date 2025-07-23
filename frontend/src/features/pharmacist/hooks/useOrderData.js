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
        orderNumber: `ORD-250713-15`,
        patientName: "Mrs. Perera",
        patientEmail: "saranap@email.com",
        patientPhone: "+94 77 123 4567",
        pharmacistName: "Dr. Sarah Johnson",
        dateCreated: "2025-07-10",
        dateCompleted: "2025-07-11",
        totalAmount: 6748.00,
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
            unitPrice: 1599.00,
            totalPrice: 4797.00,
            available: true,
            historicalNote: "Equivalent to gr 120 Ac. Salicyl from prescription"
          },
          {
            id: 2,
            name: "Topical Pain Relief Cream",
            genericName: "Modern equivalent of Collod Flexile",
            quantity: 1,
            unitPrice: 2450.00,
            totalPrice: 2450.00,
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
        signedBy: "Sarangi Perera"
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