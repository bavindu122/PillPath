import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { AdminAuthProvider } from "./hooks/useAdminAuth"; // ✅ Import AdminAuthProvider
import { NotificationsProvider } from "./contexts/NotificationsContext";

import Home from "./pages/Home";
import About from "./pages/About";
import Otc from "./pages/Otc";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Login from "./features/auth/pages/Login";
import Footer from "./components/Layout/Footer";
import Register from "./features/auth/pages/Register";
import Navbar from "./components/Layout/Navbar";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import ResetPassword from "./features/auth/pages/ResetPassword";
import FloatingBell from "./components/Notifications/FloatingBell";

import PharmacyAdmin from "./features/pharmacy-admin/PharmacyAdmin";
import Pharmacist from "./features/pharmacist/pages/Pharmacist";
import RequirePharmacist from "./features/auth/components/RequirePharmacist";
import Loading from "./components/Loading";
import Customer from "./features/customer/pages/Customer";
import FindPharmacy from "./pages/FindPharmacies/FindPharmacy";
import Admin from "./features/admin/Admin";
import PharmacyProfile from "./pages/FindPharmacies/PharmacyProfile";
import ProductStores from "./pages/ProductStores";

/**
 * App Content Component
 * Separated to access auth context
 */
const AppContent = () => {
  const location = useLocation();
  const { isAuthenticated, userType } = useAuth();
  
  const isPharmacistPath = location.pathname.startsWith("/pharmacist");
  const isPharmacyAdminPath = location.pathname.startsWith("/pharmacy");
  const isCustomerPath = location.pathname.startsWith("/customer");
  const isAdminPath = location.pathname.startsWith("/admin");

  // Show floating notification bell ONLY for customers on customer routes
  const showFloatingBell = isAuthenticated && userType === "customer" && isCustomerPath;

  return (
    <div>
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {!isAdminPath &&
        !isPharmacistPath &&
        !isCustomerPath &&
        !isPharmacyAdminPath && <Navbar />}
      
      {/* Floating Notification Bell - ONLY for customers on customer routes */}
      {showFloatingBell && <FloatingBell />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/otc" element={<Otc />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/pharmacy/*" element={<PharmacyAdmin />} />
        <Route
          path="/pharmacist/*"
          element={
            <RequirePharmacist
              fallback={<Loading message="Checking access..." />}
            >
              <Pharmacist />
            </RequirePharmacist>
          }
        />
        <Route path="/customer/*" element={<Customer />} />
        <Route path="/find-pharmacy" element={<FindPharmacy />} />
        <Route
          path="/product-stores/:productId"
          element={<ProductStores />}
        />
        <Route
          path="/admin/*"
          element={
            <AdminAuthProvider>
              <Admin />
            </AdminAuthProvider>
          }
        />

        <Route
          path="/pharma-profile/:pharmacyId"
          element={<PharmacyProfile />}
        />
        <Route path="/pharma-profile" element={<PharmacyProfile />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
      {!isAdminPath &&
        !isPharmacistPath &&
        !isCustomerPath &&
        !isPharmacyAdminPath && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <AppContent />
      </NotificationsProvider>
    </AuthProvider>
  );
};

export default App;
