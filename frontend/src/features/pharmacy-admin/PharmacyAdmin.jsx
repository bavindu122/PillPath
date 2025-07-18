import React from "react";
import { Routes, Route } from "react-router-dom";
import PharmacyAdminLayout from "./components/PharmacyAdminLayout";
import PharmacySettings from "./pages/manage-pharmacy/PharmacySettings";
import StaffManagement from "./pages/manage-staff/ManageStaff";
import InventoryManagementPage from "./pages/manage-pharmacy/InventoryManagementPage";
import DashboardPage from "./pages/PharmacyAdminDashboard/DashboardPage";
import SalesAnalyticsPage from "./pages/sales-analytics/SalesAnalyticsPage";
import OrdersPage from "./pages/orders/OrdersPage";
import OrderDetailPage from "./pages/orders/OrderDetailPage";
import PaymentGatewayPage from "./pages/PaymentGateway/PaymentGatewayPage";

export const PharmacyAdmin = () => {
  return (
    <PharmacyAdminLayout>
      <Routes>
        <Route path="" element={<DashboardPage />} />
        <Route path="pharmacyprofile" element={<PharmacySettings />} />
        <Route path="pharmacystaff" element={<StaffManagement />} />
        <Route path="pharmacyinventory" element={<InventoryManagementPage />} />
        <Route path="pharmacyanalytics" element={<SalesAnalyticsPage />} />
        <Route path="pharmacyorders" element={<OrdersPage />} />
        <Route path="pharmacyorders/:orderId" element={<OrderDetailPage />} />
        <Route path="paymentgateway" element={<PaymentGatewayPage />} />
      </Routes>
    </PharmacyAdminLayout>
  );
};

export default PharmacyAdmin;
