import React, { useState } from "react";
import Navbar from "../../../components/Layout/Navbar";
import { assets } from "../../../assets/assets";
import Button from "../components/Button";
import { Pencil, Camera, Upload, Search, ShoppingBag } from "lucide-react";
import CurrentPrescriptionsCard from "../components/DashboardCards/CurrentPrescriptionsCard";
import RecentOrdersCard from "../components/DashboardCards/RecentOrdersCard";
import FamilyProfilesCard from "../components/DashboardCards/FamilyProfilesCard";
import NearbyPharmaciesCard from "../components/DashboardCards/NearbyPharmaciesCard";
import ProfileModal from "../components/ProfileModal";
import DetailCard from "../components/DetailCard";

import GlassCard from "../../../components/UIs/GlassCard";
import CustomerSidebar from "../components/CustomerSidebar";

const CustomerProfile = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  return (
    <>
      <section className="min-h-screen flex bg-gradient-to-br from-primary via-primary-hover to-accent relative overflow-hidden">
        {/* Sidebar */}
        <CustomerSidebar />
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="max-w-7xl mx-auto pt-10 pb-10">
            <div className="relative w-full z-10 mx-auto bg-white/15 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 animate-fade-in text-center">
              {/* Welcome Section */}
              <div className="mb-8">
                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
                  <img src={assets.profile_pic} alt="logo"
                    className="w-32 h-32 rounded-full object-cover"/>
                  <div className="flex-1 text-left">
                    <h1 className="text-3xl text-white font-bold mb-2">Welcome back, John!</h1>
                    <p className="text-white/80 mb-6">Manage your prescriptions and health with ease...</p>
                    <div className="flex flex-wrap gap-4 mb-2">
                      <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                        <Upload size={18} /> Upload Prescription
                      </Button>
                      <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                        <Search size={18} /> Find Pharmacy
                      </Button>
                      <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                        <ShoppingBag size={18} /> Browse OTC
                      </Button>
                    </div>
                  </div>
                  <Button size="sm" className="absolute top-0 right-0 flex items-center gap-2 text-lg">
                    <Pencil size={20} /> Edit Profile
                  </Button>
                </div>
                
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                
                <CurrentPrescriptionsCard />
                <RecentOrdersCard />
                <FamilyProfilesCard />
                <NearbyPharmaciesCard />
              </div>

              {/* Original Profile Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-6">
                  {/* ...existing code for DetailCards... */}
                  <DetailCard className="flex flex-col items-center min-h-[260px]">
                    <img
                      src={assets.profile_pic} alt="logo"
                      className="w-32 h-32 rounded-full mb-6 object-cover"
                    />
                    <Button className="flex items-center gap-2 text-base mt-2">
                      <Camera size={18} /> Change Profile Picture
                    </Button>
                  </DetailCard>
                  <DetailCard className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center min-h-[180px] flex flex-col justify-center">
                    <div className="text-4xl font-bold flex items-center justify-center gap-2">
                      1,247
                    </div>
                    <p className="mt-4 text-lg">Loyalty Points</p>
                    <p className="text-base">Keep earning more rewards!</p>
                  </DetailCard>
                  
                  <DetailCard className="flex items-center justify-center cursor-pointer min-h-[120px] transition-all duration-200 hover:shadow-2xl hover:bg-white/80 hover:border-primary">
                    <div>
                      <p className="font-semibold text-lg">Manage Reminders</p>
                      <p className="text-base text-gray-500">Set medication alerts</p>
                    </div>
                  </DetailCard>
                </div>
                {/* Customer Details */}
                
              </div>
            </div>
          </div>
        </div>
        <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      </section>
    </>
  );
};

export default CustomerProfile;