import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import PharmacyAdminLayout from "./components/PharmacyAdminLayout";
import PharmacySettings from "./pages/manage-pharmacy/PharmacySettings";
import StaffManagement from "./pages/manage-staff/ManageStaff";
import InventoryManagementPage from "./pages/manage-pharmacy/InventoryManagementPage";
import DashboardPage from "./pages/PharmacyAdminDashboard/DashboardPage";
import SalesAnalyticsPage from "./pages/sales-analytics/SalesAnalyticsPage";
import OrdersPage from "./pages/orders/OrdersPage";
import OrderDetailPage from "./pages/orders/OrderDetailPage";
import PaymentGatewayPage from "./pages/PaymentGateway/PaymentGatewayPage";
import PharmacyAdminProfile from "./pages/PharmacyAdminProfile";
import Chat from "./pages/chats/Chat";

export const PharmacyAdmin = () => {
  const { isAuthenticated, loading, isPharmacyAdmin, initialized } = useAuth();

  // Wait for init or loading before rendering to avoid flicker
  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but not a pharmacy admin, block access
  if (!isPharmacyAdmin) {
    return <Navigate to="/login" replace />;
  }
  return (
    <PharmacyAdminLayout>
      <Routes>
        <Route path="" element={<DashboardPage />} />
        <Route path="profile" element={<PharmacyAdminProfile />} />
        <Route path="pharmacyprofile" element={<PharmacySettings />} />
        <Route path="pharmacystaff" element={<StaffManagement />} />
        <Route path="pharmacyinventory" element={<InventoryManagementPage />} />
        <Route path="pharmacyanalytics" element={<SalesAnalyticsPage />} />
        <Route path="pharmacyorders" element={<OrdersPage />} />
        <Route path="pharmacyorders/:orderId" element={<OrderDetailPage />} />
        <Route path="paymentgateway" element={<PaymentGatewayPage />} />
        <Route path="chats" element={<Chat />} />
        <Route path="chats/:customerId" element={<Chat />} />
      </Routes>
    </PharmacyAdminLayout>
  );
};

export default PharmacyAdmin;
