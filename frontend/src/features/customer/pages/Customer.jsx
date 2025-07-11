import React, { useState, useEffect } from "react";
import CustomerProfile from "./CustomerProfile";
import MedicalRecords from "./MedicalRecords";
import MedicalRecordsDetailed from "./MedicalRecordsDetailed";
import CustomerSidebar from "../components/CustomerSidebar";
import { Route, Routes, useLocation } from "react-router-dom";

const Customer = () => {
  const [sidebarWidth, setSidebarWidth] = useState("w-64");
  const location = useLocation();

  // Check for sidebar width changes using a MutationObserver
  useEffect(() => {
    const sidebarElement = document.querySelector(
      '[class*="w-64"], [class*="w-20"]'
    );
    if (!sidebarElement) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const currentClasses = mutation.target.className;
          if (currentClasses.includes("w-20")) {
            setSidebarWidth("w-20");
          } else if (currentClasses.includes("w-64")) {
            setSidebarWidth("w-64");
          }
        }
      });
    });

    observer.observe(sidebarElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-primary via-primary-hover to-accent relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow"></div>
      <div className="absolute top-32 right-20 w-80 h-80 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
      <div className="absolute -bottom-20 left-32 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-6000"></div>

      {/* Medical pattern background */}
      <div className="medical-pattern absolute inset-0 opacity-5"></div>

      {/* Sidebar */}
      <CustomerSidebar />

      {/* Main Content - Adjusted for sidebar width */}
      <div
        className={`flex-1 ${
          sidebarWidth === "w-64" ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        <Routes>
          <Route index element={<CustomerProfile removeBg={true} />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route
            path="/medical-records/:recordId"
            element={<MedicalRecordsDetailed />}
          />
          <Route
            path="/*"
            element={<div className="p-8 text-white">Page not found</div>}
          />
        </Routes>
      </div>
    </div>
  );
};

export default Customer;
