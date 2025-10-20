import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useOrdersData from '../../hooks/useOrderData';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  // ✅ Remove token parameter
  const { getOrderById, isLoading } = useOrdersData();
  
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    console.log('🔍 Loading order:', orderId);
    
    if (!isLoading) {
      const orderData = getOrderById(orderId);
      
      if (orderData) {
        console.log('✅ Order loaded:', orderData);
        setOrder(orderData);
      } else {
        console.warn('⚠️ Order not found');
        setError('Order not found');
      }
    }
  }, [orderId, getOrderById, isLoading]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Order Not Found</h2>
            <p className="text-red-600 mb-4">{error || 'The order you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/pharmacy-admin/orders')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/pharmacy-admin/orders')}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-700 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Back to Orders
      </button>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Order Details</h1>
        
        {/* Order Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Order Code</p>
            <p className="font-semibold">{order.orderCode}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-semibold">{order.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Customer</p>
            <p className="font-semibold">{order.customerName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date</p>
            <p className="font-semibold">{new Date(order.orderDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Items */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Items</h2>
          <div className="space-y-2">
            {order.items?.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{item.medicineName}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">LKR {item.totalPrice?.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>LKR {order.totals?.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
































// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';
// import OrderDetails from '../../components/Orders/OrderDetails';
// import useOrdersData from '../../hooks/useOrderData';

// const OrderDetailPage = () => {
//   const { orderId } = useParams();
//   const navigate = useNavigate();
//   const { getOrderById, isLoading } = useOrdersData();
//   const [order, setOrder] = useState(null);
//   const [error, setError] = useState(null);
  
//   useEffect(() => {
//     if (!isLoading) {
//       const foundOrder = getOrderById(orderId);
//       if (foundOrder) {
//         setOrder(foundOrder);
//       } else {
//         setError('Order not found');
//       }
//     }
//   }, [orderId, getOrderById, isLoading]);
  
//   // Simple page layout for consistency
//   const PageLayout = ({ children, title, subtitle, isLoading, loadingMessage }) => (
//     <div className="p-6">
//       <div className="mb-6">
//         <div className="flex items-center">
//           <button
//             onClick={() => navigate('/pharmacy/pharmacyorders')}
//             className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </button>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
//             {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
//           </div>
//         </div>
//       </div>
      
//       {isLoading ? (
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
//             <p className="text-gray-500">{loadingMessage || 'Loading...'}</p>
//           </div>
//         </div>
//       ) : (
//         children
//       )}
//     </div>
//   );
  
//   if (isLoading) {
//     return (
//       <PageLayout 
//         title="Order Details" 
//         subtitle="Loading order information..." 
//         isLoading={true}
//         loadingMessage="Loading order details..."
//       />
//     );
//   }
  
//   if (error) {
//     return (
//       <PageLayout title="Order Not Found">
//         <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
//           <h3 className="text-lg font-medium text-red-600 mb-2">{error}</h3>
//           <p className="text-gray-500 mb-4">The order you're looking for doesn't exist or has been removed.</p>
//           <button
//             onClick={() => navigate('/pharmacy/pharmacyorders')}
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Orders
//           </button>
//         </div>
//       </PageLayout>
//     );
//   }
  
//   if (!order) return null;
  
//   return (
//     <PageLayout 
//       title={`Order ${order.id}`} 
//       subtitle={`Placed on ${new Date(order.orderDate).toLocaleDateString()}`}
//       isLoading={false}
//     >
//       <OrderDetails order={order} />
//     </PageLayout>
//   );
// };

// export default OrderDetailPage;