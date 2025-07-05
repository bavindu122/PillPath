import React from 'react'
import PharmacistDashboard from "./PharmacistDashboard"
import ReviewPrescriptions from "./ReviewPrescriptions"
import PrescriptionQueueList from "./PrescriptionQueueList"
import { Route, Routes } from 'react-router-dom'

const Pharmacist = () => {
  return (
    <div>
        <Routes>
            <Route path="/" element={<PharmacistDashboard />} />
            <Route path="/dashboard" element={<PharmacistDashboard />} />
            <Route path="/queue" element={<PrescriptionQueueList />} />
            <Route path="/review/:prescriptionId" element={<ReviewPrescriptions />} />
        </Routes>
    </div>
  )
}

export default Pharmacist;