import React from "react";
import { assets } from "../../../assets/assets";
import Button from "../components/Button";
import {
  Pencil,
  Upload,
  Search,
  ShoppingBag,
  Bell,
  MapPin,
  Calendar,
  ChevronRight,
  Star,
  Award,
  Camera,
  Pill,
} from "lucide-react";
import CurrentPrescriptionsCard from "../components/DashboardCards/CurrentPrescriptionsCard";
import RecentOrdersCard from "../components/DashboardCards/RecentOrdersCard";
import FamilyProfilesCard from "../components/DashboardCards/FamilyProfilesCard";
import NearbyPharmaciesCard from "../components/DashboardCards/NearbyPharmaciesCard";
import ProfileModal from "../components/ProfileModal";
import EditProfileModal from "../components/EditProfileModal";
import DetailCard from "../components/DetailCard";
import GlassCard from "../../../components/UIs/GlassCard";
import CustomerSidebar from "../components/CustomerSidebar";
import PrescriptionUploadModal from "../../../components/Prescription/PrescriptionUploadModal";
import { Link } from "react-router-dom";
import { useCustomerModals } from "../hooks";

const CustomerProfile = ({ removeBg = false }) => {
  const {
    showProfileModal,
    showEditProfileModal,
    isUploadModalOpen,
    setShowProfileModal,
    setShowEditProfileModal,
    openUploadModal,
    closeUploadModal
  } = useCustomerModals();
  
  const userName = "John Doe"; // Replace with actual user name logic

  return (
    <section
      className={`min-h-screen flex ${
        removeBg ? "" : "bg-gradient-to-br from-primary via-primary-hover to-accent"

      } relative overflow-hidden`}
    >
      {!removeBg && (
        <>
          <div className="absolute top-10 left-10 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow"></div>
          <div className="absolute top-32 right-20 w-80 h-80 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
          <div className="absolute -bottom-20 left-32 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-6000"></div>
          <div className="medical-pattern absolute inset-0 opacity-5"></div>
          <div className="absolute top-20 left-[20%] w-20 h-20 border-4 border-white/10 rounded-lg rotate-12 animate-spin-slow"></div>
          <div className="absolute bottom-40 right-[15%] w-16 h-16 border-4 border-secondary/20 rounded-full animate-pulse-slow"></div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 w-full">
          {/* Welcome Section - Glassmorphic card */}
          <div className="relative w-full animate-fade-in-up delay-100 mb-8">
            <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8">
              <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <img
                    src={assets.profile_pic}
                    alt="User profile picture"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/30 shadow-lg animate-fade-in-scale"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-secondary rounded-full p-2 shadow-md cursor-pointer hover:bg-secondary-hover transition-colors duration-200">
                    <Camera size={18} className="text-white" />
                  </div>
                </div>

                <div className="flex-1 text-left">
                  <h1 className="text-2xl md:text-3xl text-white font-bold mb-2 animate-fade-in-up delay-200">
                    Welcome back,{" "}
                    <span className="text-gradient-secondary">{userName}!</span>
                  </h1>
                  <p className="text-white/80 mb-6 animate-fade-in-up delay-300">
                    Manage your prescriptions and health with ease from your
                    personalized dashboard
                  </p>

                  {/* Quick action buttons */}
                  <div className="flex flex-wrap gap-3 animate-fade-in-up delay-400">
                    <Button 
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg"
                      onClick={openUploadModal}
                    >
                      <Upload size={16} /> Upload Prescription
                    </Button>
                      <Button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-300 shadow-lg">
                        <MapPin size={16} /> Find Pharmacy
                      </Button>
                    <Link to="/otc-store">
                      <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-300 shadow-lg">
                        <ShoppingBag size={16} /> Browse OTC
                      </Button>
                    </Link>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="absolute top-4 right-4 flex items-center gap-2 text-lg bg-white/20 hover:bg-white/30 transition-all duration-300"
                  onClick={() => setShowEditProfileModal(true)}
                >
                  <Pencil size={16} /> Edit Profile
                </Button>
              </div>

              {/* Subtle divider */}
              <div className="w-full h-px bg-white/10 my-6"></div>

              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up delay-500">
                {/* Active Prescriptions */}
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-accent/30 transition-all duration-300 hover:scale-105 group cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-blue-600/20 p-2 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                      <Pill size={18} className="text-blue-200" />
                    </div>
                    <div className="text-white text-2xl font-bold">2</div>
                  </div>
                  <p className="text-white/100 text-sm">Active Prescriptions</p>
                  <div className="mt-2 flex items-center">
                    <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-1 rounded-full w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Pending Orders */}
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-accent/30 transition-all duration-300 hover:scale-105 group cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-orange-800/20 p-2 rounded-lg group-hover:bg-orange-500/30 transition-colors">
                      <ShoppingBag size={18} className="text-orange-200" />
                    </div>
                    <div className="text-white text-2xl font-bold">1</div>
                  </div>
                  <p className="text-white/100 text-sm">Pending Orders</p>
                  <div className="mt-2 flex items-center text-orange-300 text-xs">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></div>
                    In Progress
                  </div>
                </div>

                {/* Loyalty Points */}
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-accent/30 transition-all duration-300 hover:scale-105 group cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-yellow-600/20 p-2 rounded-lg group-hover:bg-yellow-500/30 transition-colors">
                      <Star
                        size={18}
                        className="text-yellow-400 fill-yellow-200"
                      />
                    </div>
                    <div className="text-white text-2xl font-bold">1,247</div>
                  </div>
                  <p className="text-white/100 text-sm">Loyalty Points</p>
                  <div className="mt-2 flex items-center text-yellow-300 text-xs">
                    <Award size={12} className="mr-1" />
                    Gold Member
                  </div>
                </div>

                {/* Family Members */}
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-accent/30 transition-all duration-300 hover:scale-105 group cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="bg-purple-500/20 p-2 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-purple-200"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <div className="text-white text-2xl font-bold">2</div>
                  </div>
                  <p className="text-white/100 text-sm">Family Members</p>
                  <div className="mt-2 flex -space-x-1">
                    <div className="w-5 h-5 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full border border-white/30"></div>
                    <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full border border-white/30"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Sections in a 2-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Health Management Section */}
              <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 animate-fade-in-up delay-200">
                <h2 className="text-xl text-white font-bold mb-4 flex items-center">
                  <span className="bg-blue-600/20 p-2 rounded-lg mr-2">
                    <Calendar size={20} className="text-blue-200" />
                  </span>
                  Health Management
                  <Button className="ml-auto flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white">
                    <ChevronRight size={16} />
                  </Button>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CurrentPrescriptionsCard />
                  <RecentOrdersCard />
                </div>
              </div>

              {/* Loyalty & Rewards Section */}
              <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 animate-fade-in-up delay-300">
                <h2 className="text-xl text-white font-bold mb-4 flex items-center">
                  <span className="bg-yellow-500/20 p-2 rounded-lg mr-2">
                    <Star size={20} className="text-yellow-400" />
                  </span>
                  Loyalty & Rewards
                </h2>

                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10">
                    <Award size={120} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-white/80 text-sm uppercase tracking-wider">
                      Your Balance
                    </p>
                    <div className="text-4xl font-bold my-3">1,247 points</div>
                    <div className="flex items-center text-sm mt-4">
                      <div className="bg-white/20 rounded-full px-3 py-1">
                        Gold Member
                      </div>
                      <div className="ml-auto">
                        <Button className="bg-white/20 hover:bg-white/30 text-white text-sm">
                          Redeem Rewards
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <p className="text-white/60 text-sm">Next Reward At</p>
                    <p className="text-white text-lg font-bold">1,500 points</p>
                    <div className="w-full bg-white/20 h-2 rounded-full mt-2">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full w-4/5"></div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <p className="text-white/60 text-sm">
                      Points Earned This Month
                    </p>
                    <p className="text-white text-lg font-bold">247 points</p>
                    <p className="text-green-400 text-xs mt-1">
                      ↑ 12% from last month
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column (1/3 width) */}
            <div className="space-y-6">
              {/* Family Profiles Section */}
              <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 animate-fade-in-up delay-400">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl text-white font-bold flex items-center">
                    <span className="bg-purple-500/20 p-2 rounded-lg mr-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-purple-400"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </span>
                    Family Profiles
                  </h2>
                  <Button
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white text-xs"
                    onClick={() => setShowProfileModal(true)}
                  >
                    Manage
                  </Button>
                </div>
                <FamilyProfilesCard />
              </div>

              {/* Nearby Pharmacies Section */}
              <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 animate-fade-in-up delay-500">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl text-white font-bold flex items-center">
                    <span className="bg-green-500/20 p-2 rounded-lg mr-2">
                      <MapPin size={20} className="text-green-400" />
                    </span>
                    Nearby Pharmacies
                  </h2>
                  <Link to="/find-pharmacies">
                    <Button
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white text-xs"
                    >
                      See All
                    </Button>
                  </Link>
                </div>
                <NearbyPharmaciesCard />
              </div>

              {/* Medication Reminders */}
              <div className="bg-white/15 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 animate-fade-in-up delay-600">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl text-white font-bold flex items-center">
                    <span className="bg-red-500/20 p-2 rounded-lg mr-2">
                      <Bell size={20} className="text-red-400" />
                    </span>
                    Medication Reminders
                  </h2>
                  <Button
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white text-xs"
                  >
                    Add New
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-white font-medium">
                          Metformin 500mg
                        </p>
                        <p className="text-white/60 text-sm">
                          8:00 AM & 8:00 PM
                        </p>
                      </div>
                      <div className="bg-blue-500/20 rounded-lg p-2 h-fit">
                        <Bell size={18} className="text-blue-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-white font-medium">
                          Lisinopril 10mg
                        </p>
                        <p className="text-white/60 text-sm">9:00 AM</p>
                      </div>
                      <div className="bg-blue-500/20 rounded-lg p-2 h-fit">
                        <Bell size={18} className="text-blue-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
      
      <EditProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        userProfile={{
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@email.com",
          phone: "+1 (555) 123-4567",
          // Add more user data here when available
        }}
      />
      
      <PrescriptionUploadModal
        isOpen={isUploadModalOpen}
        onClose={closeUploadModal}
      />
    </section>
  );
};

export default CustomerProfile;
