import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Otc from "./pages/Otc";

import CustomerProfile from "./features/customer/pages/CustomerProfile";
import MedicalRecordCard from "./features/customer/components/MedicalRecordCard";
import MedicalRecords from "./features/customer/pages/MedicalRecords";

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
  const isAdminPath = location.pathname.startsWith("/pharmacy");
  return (
    <div className="mx-4 sm:mx-[0%]">
      {!isAdminPath && <Navbar />}
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
      </Routes>
      {!isAdminPath && <Footer />}
      {/* <Footer /> */}
    </div>
  );
};

export default App;
