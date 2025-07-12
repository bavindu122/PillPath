import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Otc from "./pages/Otc";

import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Login from "./features/auth/pages/Login";
import Footer from "./components/Layout/Footer";
import Register from "./features/auth/pages/Register";
import Navbar from "./components/Layout/Navbar";

import PharmacyAdmin from "./features/pharmacy-admin/PharmacyAdmin";
import Pharmacist from "./features/pharmacist/pages/Pharmacist";
import Customer from "./features/customer/pages/Customer";

const App = () => {
  const location = useLocation();
  const isPharmacistPath = location.pathname.startsWith("/pharmacist");
  const isAdminPath = location.pathname.startsWith("/pharmacy");
  const isCustomerPath = location.pathname.startsWith("/customer");
  return (
    <div >
      {!isAdminPath && !isPharmacistPath && !isCustomerPath && <Navbar />}
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
        <Route path="/customer/*" element={<Customer />} />
      </Routes>
      {!isAdminPath && !isPharmacistPath && !isCustomerPath && <Footer />}
    </div>
  );
};

export default App;
