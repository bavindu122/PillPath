import React from 'react'
import PharmacistDashboard from "./PharmacistDashboard"
import ReviewPrescriptions from "./ReviewPrescriptions"
import PrescriptionQueueList from "./PrescriptionQueueList"
import OrderHistoryList from "./OrderHistoryList"
import { Route, Routes } from 'react-router-dom'

const Pharmacist = () => {
  return (
    <div>
        <Routes>
            <Route path="/" element={<PharmacistDashboard />} />
            <Route path="/dashboard" element={<PharmacistDashboard />} />
            <Route path="/queue" element={<PrescriptionQueueList />} />
            <Route path="/orders" element={<OrderHistoryList />} />
            <Route path="/review/:prescriptionId" element={<ReviewPrescriptions />} />
        </Routes>
    </div>
  )
}

export default Pharmacist;