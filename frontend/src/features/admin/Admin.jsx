import React from 'react'
import { Routes, Route } from "react-router-dom";
import AdminLayout from './components/AdminLayout';
import { Navigate } from 'react-router-dom';
import Overview from './pages/Overview';

const Admin = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<Overview />} />
      </Routes>
      
    </AdminLayout>
  )
}

export default Admin
