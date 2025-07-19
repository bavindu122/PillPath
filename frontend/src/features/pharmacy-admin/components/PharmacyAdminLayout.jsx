import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const PharmacyAdminLayout = ({ children }) => {
  const [activeMenuItem, setActiveMenuItem] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 font-inter">
      {/* Sidebar - now fixed with overlay style */}
      <Sidebar
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content Area - full width without shift */}
      <div className="flex flex-col flex-1 min-w-0 transition-all duration-300">
        {/* Header */}
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Page Content - scrollable content area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PharmacyAdminLayout;






