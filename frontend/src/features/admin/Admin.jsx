import React from 'react'
import { Routes, Route } from "react-router-dom";
import AdminLayout from './components/AdminLayout';
import { Navigate } from 'react-router-dom';
import Overview from './pages/Overview';
import Customers from './pages/Customers';
import Pharmacies from './pages/Pharmacies';
import Prescription from './pages/Prescription';
import WalletAndIncome from './pages/WalletAndIncome';
import Sales from './pages/Sales';
import Analytics from './pages/Analytics';
const Admin = () => {
  return (
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

      </Routes>
      
    </AdminLayout>
  )
}

export default Admin
