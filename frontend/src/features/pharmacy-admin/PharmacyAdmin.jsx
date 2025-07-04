import React from "react";
import { Routes, Route } from "react-router-dom";
import PharmacyAdminLayout from "./components/PharmacyAdminLayout";
import PharmacySettings from "./pages/manage-pharmacy/PharmacySettings";
import StaffManagement from "./pages/manage-staff/ManageStaff";
import InventoryManagementPage from "./pages/manage-pharmacy/InventoryManagementPage";

export const PharmacyAdmin = () => {
  return (
    <PharmacyAdminLayout>
      <Routes>
        <Route path="" element={<PharmacySettings />} />
        <Route path="pharmacyprofile" element={<PharmacySettings />} />
        <Route path="pharmacystaff" element={<StaffManagement />} />
        <Route path="pharmacyinventory" element={<InventoryManagementPage />} />
      </Routes>
    </PharmacyAdminLayout>
  );
};

export default PharmacyAdmin;
