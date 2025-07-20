import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PharmaPageLayout from '../components/PharmaPageLayout';
import CompletedOrderViewer from '../components/CompletedOrderViewer';
import OrderSummary from '../components/OrderSummary';
import PatientInfo from '../components/PatientInfo';
import DeliveryTracking from '../components/DeliveryTracking';
import useOrderData from '../hooks/useOrderData';
import './index-pharmacist.css';

const PastOrder = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { orderData, deliveryInfo, isLoading } = useOrderData(orderId);

  const handlePrintOrder = () => {
    console.log('Printing order:', orderData);
    window.print();
  };

  const handleExportPDF = () => {
    // TODO: Implement export to PDF functionality
    alert('Export to PDF is not yet implemented.');
    console.log('Exporting order to PDF:', orderData);
  };

  const handleReorder = () => {
    console.log('Creating reorder from:', orderData);
    // Navigate to create new order with same items
  };

  const headerActions = orderData && (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-full shadow-sm">
        <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
        <p className="text-sm font-semibold text-green-700">
          Order Completed
        </p>
      </div>
    </div>
  );

  return (
    <PharmaPageLayout
      title="Order Details"
      subtitle={orderData ? `Order ${orderData.orderNumber} - ${orderData.patientName}` : "Loading order details..."}
      isLoading={isLoading}
      loadingMessage="Loading order details..."
      showBackButton={true}
      onBack={() => navigate('/pharmacist/orders')}
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
                  completedDate: orderData?.dateCompleted
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