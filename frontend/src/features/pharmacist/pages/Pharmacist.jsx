import React from 'react'
import PharmacistDashboard from "./PharmacistDashboard"
import { Route, Routes } from 'react-router-dom'

const Pharmacist = () => {
  return (
    <div>
        <Routes>
            <Route path="/" element={<PharmacistDashboard />} />
            <Route path="/dashboard" element={<PharmacistDashboard />} />
        </Routes>
    </div>
  )
}

export default Pharmacist;
