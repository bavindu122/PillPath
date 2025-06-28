import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Otc from "./pages/Otc";

import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Footer from "./components/Layout/Footer";

const App = () => {
  return (
    <div className="mx-4 sm:mx-[0%]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/otc" element={<Otc />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
