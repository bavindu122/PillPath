import React from 'react'
import CustomerProfile from "./CustomerProfile";
import MedicalRecords from "./MedicalRecords";
import MedicalRecordsDetailed from "./MedicalRecordsDetailed";
import { Route, Routes } from 'react-router-dom'

const Customer = () => {
  return (
    <div>
        <Routes>
            <Route index element={<CustomerProfile />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/medical-records/:recordId" element={<MedicalRecordsDetailed />} />
        </Routes>
    </div>
  )
}

export default Customer;

