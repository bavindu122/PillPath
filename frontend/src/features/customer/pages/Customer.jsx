import React, { useEffect } from "react";
import CustomerDashboard from "./CustomerDashboard";
import MedicalRecords from "./MedicalRecords";
import MedicalRecordsDetailed from "./MedicalRecordsDetailed";
import Activities from "./Activities";
import OrderPreview from "./OrderPreview";
import PastOrders from "./PastOrders";
import FamilyProfiles from "./FamilyProfiles";
import MedicineInfo from "./MedicineInfo";
import ChatCustomer from "./ChatCustomer";
import CustomerSidebar from "../components/CustomerSidebar";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { useSidebarWidth } from "../hooks";
import { useAuth } from "../../../hooks/useAuth";

const Customer = () => {
  const sidebarWidth = useSidebarWidth();
  const location = useLocation();
  const { isAuthenticated, loading, user } = useAuth();

  // Log authentication status for debugging
  useEffect(() => {
    console.log('Customer page - Auth status:', { isAuthenticated, loading, user });
  }, [isAuthenticated, loading, user]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // // Redirect to login if not authenticated
  // if (!isAuthenticated) {
  //   console.log('User not authenticated, redirecting to login');
  //   return <Navigate to="/login" replace />;
  // }

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
          <Route index element={<CustomerDashboard removeBg={true} />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/orders" element={<PastOrders />} />
          <Route path="/family-profiles" element={<FamilyProfiles />} />
          <Route path="/medicine-info" element={<MedicineInfo />} />
          <Route path="/chats" element={<ChatCustomer />} />
          <Route path="/order-preview/:prescriptionId" element={<OrderPreview />} />
          <Route
            path="/order-preview/:prescriptionId"
            element={<OrderPreview />}
          />
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