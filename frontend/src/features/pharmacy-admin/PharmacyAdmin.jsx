import React from "react";
import { Routes, Route } from "react-router-dom";
import PharmacyAdminLayout from "./components/PharmacyAdminLayout";
import PharmacySettings from "./pages/manage-pharmacy/PharmacySettings";
import StaffManagement from "./pages/manage-staff/ManageStaff";
import InventoryManagementPage from "./pages/manage-pharmacy/InventoryManagementPage";
import DashboardPage from "./pages/PharmacyAdminDashboard/DashboardPage";

export const PharmacyAdmin = () => {
  return (
    <PharmacyAdminLayout>
      <Routes>
        <Route path="" element={<DashboardPage />} />
        <Route path="pharmacyprofile" element={<PharmacySettings />} />
        <Route path="pharmacystaff" element={<StaffManagement />} />
        <Route path="pharmacyinventory" element={<InventoryManagementPage />} />
      </Routes>
    </PharmacyAdminLayout>
  );
};

export default PharmacyAdmin;
