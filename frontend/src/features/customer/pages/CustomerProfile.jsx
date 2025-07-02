import React from "react";
import Navbar from "../../../components/Layout/Navbar";
import { assets } from "../../../assets/assets";
import Button from "../components/Button";
import { Pencil, Camera } from "lucide-react";

import DetailCard from "../components/DetailCard";

const CustomerProfile = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Navbar />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Customer Dashboard</h1>
        <p className="text-gray-600 mb-6">Manage your profile and medical information</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-6">
  <DetailCard className="flex flex-col items-center p-6">
    <img
      src={assets.profile_pic} alt="Customer profile picture"
      
      className="w-28 h-28 rounded-full mb-4 object-cover"
    />
    <Button className="flex items-center gap-2 text-sm mt-2">
    <Camera size={16} /> Change Profile Picture
  </Button>
  </DetailCard>

  <DetailCard className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 text-center">
    <div className="text-3xl font-bold flex items-center justify-center gap-2">
      1,247
    </div>
    <p className="mt-2 text-sm">Loyalty Points</p>
    <p className="text-xs">Keep earning more rewards!</p>
  </DetailCard>

  <DetailCard className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
    <div>
      <p className="font-semibold">Past Prescriptions</p>
      <p className="text-sm text-gray-500">View your medical history</p>
    </div>
    <span>&gt;</span>
  </DetailCard>

  <DetailCard className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
    <div>
      <p className="font-semibold">Manage Reminders</p>
      <p className="text-sm text-gray-500">Set medication alerts</p>
    </div>
    <span>&gt;</span>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
                  <p className="font-semibold text-xl">+94 703034515</p>
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
  )
}
export default CustomerProfile;