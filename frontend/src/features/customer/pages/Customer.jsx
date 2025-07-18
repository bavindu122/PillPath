import React from "react";
import CustomerProfile from "./CustomerProfile";
import MedicalRecords from "./MedicalRecords";
import MedicalRecordsDetailed from "./MedicalRecordsDetailed";
import Activities from "./Activities";
import OrderPreview from "./OrderPreview";
import PastOrders from "./PastOrders";
import CustomerSidebar from "../components/CustomerSidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import { useSidebarWidth } from "../hooks";

const Customer = () => {
  const sidebarWidth = useSidebarWidth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900"></div>
      {/* Enhanced floating elements for dark theme */}
      <div className="absolute top-20 left-[10%] w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float-slow"></div>
      <div className="absolute top-32 right-20 w-80 h-80 bg-indigo-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delay"></div>
      <div className="absolute -bottom-20 left-32 w-96 h-96 bg-slate-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-6000"></div>

      {/* Medical pattern background */}
      <div className="medical-pattern absolute inset-0 opacity-5"></div>

      {/* Sidebar */}
      <CustomerSidebar />

      {/* Main Content - Adjusted for sidebar width */}
      <div
        className={`flex-1 ${
          sidebarWidth === "w-64" ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        <Routes>
          <Route index element={<CustomerProfile removeBg={true} />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/orders" element={<PastOrders />} />
          <Route path="/order-preview/:prescriptionId" element={<OrderPreview />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route
            path="/medical-records/:recordId"
            element={<MedicalRecordsDetailed />}
          />
          <Route
            path="/*"
            element={<div className="p-8 text-white">Page not found</div>}
          />
        </Routes>
      </div>
    </div>
  );
};

export default Customer;
