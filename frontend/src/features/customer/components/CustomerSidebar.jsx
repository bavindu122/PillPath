import React, { useState } from "react";
import { assets } from "../../../assets/assets";
import ProfileModal from "../components/ProfileModal";
import { NavLink } from "react-router-dom";

const CustomerSidebar = () => {
          const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <>
      <aside className="w-64 min-h-screen bg-white/80 shadow-xl border-r border-white/30 flex flex-col py-8 px-4 z-20">
        <nav className="flex flex-col gap-2">
          
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-semibold focus:outline-none">
            <NavLink
                            to="/customer-profile"
                            className="cursor-pointer hover:text-pButton">
                        Dashboard
                      </NavLink>
          </button>
          
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-gray-700">
            Past orders
          </button>
          <button className="cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-gray-700">
            <p onClick={() => {
              setShowProfileModal(true);
            }}>
              Family Info
            </p>
          </button>
        </nav>
      </aside>
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </>
  );
  
};

export default CustomerSidebar;
