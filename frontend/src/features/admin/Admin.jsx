import React from 'react'
import { Routes, Route } from "react-router-dom";
import AdminLayout from './components/AdminLayout';
import { Navigate } from 'react-router-dom';
import Overview from './pages/Overview';
import Customers from './pages/Customers';
import Pharmacies from './pages/Pharmacies';
import Prescription from './pages/Prescription';
import WalletAndIncome from './pages/WalletAndIncome';
import AdminLogin from './pages/AdminLogin';
import AdminRoute from '../../components/ProtectedRoute/AdminRoute';
import { ADMIN_ROUTES } from '../../constants/routes'; // ✅ Add this

import Sales from './pages/Sales';
import Analytics from './pages/Analytics';
import Setting from './pages/Setting';
import Announcements from './pages/Announcements';
const Admin = () => {
  return (
    <Routes>
      {/* ✅ Admin login route */}
      <Route path="/login" element={<AdminLogin />} />
      
      {/* ✅ Protected admin routes - redirect / to overview */}
      <Route path="/*" element={
        <AdminRoute>
          <AdminLayout>
            <Routes>
              <Route path="/" element={<Navigate to="overview" replace />} /> 
              <Route path="overview" element={<Overview />} />
              <Route path="customers" element={<Customers />} />
              <Route path="pharmacies" element={<Pharmacies />} />
              <Route path="prescriptions" element={<Prescription />} />
              <Route path="wallet" element={<WalletAndIncome />} />
               <Route path="sales" element={<Sales />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Setting />} />
        <Route path="announcements" element={<Announcements />} />
            </Routes>
          </AdminLayout>
        </AdminRoute>
      } />
    </Routes>
  )
}

export default Admin