import React from 'react'
import PharmacistDashboard from "./PharmacistDashboard"
import ReviewPrescriptions from "./ReviewPrescriptions"
import PrescriptionQueueList from "./PrescriptionQueueList"
import OrderHistoryList from "./OrderHistoryList"
import PastOrder from "./PastOrder"
import Inventory from "./Inventory"
import Chat from "./Chat"
import { Route, Routes } from 'react-router-dom'
import './index-pharmacist.css'

const Pharmacist = () => {
  return (
    <div>
        <Routes>
            <Route path="/" element={<PharmacistDashboard />} />
            <Route path="/dashboard" element={<PharmacistDashboard />} />
            <Route path="/queue" element={<PrescriptionQueueList />} />
            <Route path="/orders" element={<OrderHistoryList />} />
            <Route path="/orders/:orderId" element={<PastOrder />} />
            <Route path="/review/:prescriptionId" element={<ReviewPrescriptions />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/chat" element={<Chat />} />
        </Routes>
    </div>
  )
}

export default Pharmacist;