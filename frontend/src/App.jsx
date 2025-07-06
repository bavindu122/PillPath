import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Otc from "./pages/Otc";


import CustomerProfile from "./features/customer/pages/CustomerProfile";
import MedicalRecords from "./features/customer/pages/MedicalRecords";
import MedicalRecordsDetailed from "./features/customer/pages/MedicalRecordsDetailed";

import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Login from "./features/auth/pages/Login";
import Footer from "./components/Layout/Footer";
import Register from "./features/auth/pages/Register";
import Navbar from "./components/Layout/Navbar";

import PharmacyAdmin from "./features/pharmacy-admin/PharmacyAdmin";
import Pharmacist from "./features/pharmacist/pages/Pharmacist";

const App = () => {
  const location = useLocation();
  const isPharmacistPath = location.pathname.startsWith("/pharmacist");
  const isAdminPath = location.pathname.startsWith("/pharmacy");
  return (
    <div className="mx-4 sm:mx-[0%]">
      {!isAdminPath && !isPharmacistPath && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/otc" element={<Otc />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pharmacy/*" element={<PharmacyAdmin />} />
        <Route path="/pharmacist/*" element={<Pharmacist />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
        <Route path="/medical-records" element={<MedicalRecords />} />
        <Route path="/medical-records/:recordId" element={<MedicalRecordsDetailed />} />
        <Route path="/medical-records" element={<MedicalRecords />} />
        <Route path="/medical-records/:recordId" element={<MedicalRecordsDetailed />} />
      </Routes>
      {!isAdminPath && !isPharmacistPath && <Footer />}
    </div>
  );
};

export default App;
