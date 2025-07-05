import React, { useState } from "react";
import Navbar from "../../../components/Layout/Navbar";
import { assets } from "../../../assets/assets";
import Button from "../components/Button";
import { Pencil, Camera } from "lucide-react";
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
          <div className="max-w-5xl mx-auto w-full">
            <div className="relative w-full z-10 mx-auto bg-white/15 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 animate-fade-in text-center mt-8">
              <h1 className="text-3xl text-white font-bold mb-2">Customer Dashboard</h1>
              <p className="text-gray-600 text-white mb-6">Manage your profile and medical information</p>
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
                <div className="md:col-span-2">
                  <DetailCard className="p-10 min-h-[480px]">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-bold font-poppins">Customer Details</h2>
                      <Button size="sm" className="flex items-center gap-2 text-lg px-6 py-2">
                        <Pencil size={20} /> Edit Details
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
                      <div>
                        <p className="text-lg text-gray-500 font-poppins mb-1">Full Name</p>
                        <p className="font-semibold text-xl">Senuja Udugampola</p>
                      </div>
                      <div>
                        <p className="text-lg text-gray-500 mb-1">Age</p>
                        <p className="font-semibold text-xl">22 years</p>
                      </div>
                      <div>
                        <p className="text-lg text-gray-500 mb-1">Gender</p>
                        <p className="font-semibold text-xl">Male</p>
                      </div>
                      <div>
                        <p className="text-lg text-gray-500 mb-1">Date of Birth</p>
                        <p className="font-semibold text-xl">March 15, 1992</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-lg text-gray-500 mb-1">Address</p>
                        <p className="font-semibold text-xl">
                          1234 Maple Street, 
                          Apt 5B Springfield, 
                          IL 62701 United States
                        </p>
                      </div>
                      <div>
                        <p className="text-lg text-gray-500 mb-1">Phone Number</p>
                        <p className="c-semibold text-xl">+94 703034515</p>
                      </div>
                      <div>
                        <p className="text-lg text-gray-500 mb-1">Email Address</p>
                        <p className="font-semibold text-xl">senuudugampola@gmail.com</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-lg text-gray-500 mb-1">Emergency Contact</p>
                        <p className="font-semibold text-xl">
                          Sanuthma Munasinghe - +94 703034516
                        </p>
                      </div>
                    </div>
                  </DetailCard>
                </div>
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