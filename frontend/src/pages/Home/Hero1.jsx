import React, { useState } from "react";
import { assets } from "../../assets/assets";
import GlassCard from "../../components/UIs/GlassCard";
import GradientButton from "../../components/UIs/GradientButton";
import { Camera, Upload, PlusCircle } from "lucide-react";

const Hero1 = ({ openPrescriptionModal }) => {
  return (
    <div className="relative flex flex-col min-h-[75vh] sm:max-h-[90vh] md:flex-row flex-wrap z-0 rounded-2xl px-4 md:px-8 lg:px-18 shadow-lg overflow-hidden top-5">
      {/* Dark Background Theme - matching your other sections */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900"></div>

      {/* Enhanced floating elements for dark theme */}
      <div className="absolute top-20 left-[10%] w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float-slow"></div>
      <div className="absolute top-32 right-20 w-80 h-80 bg-indigo-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delay"></div>
      <div className="absolute -bottom-20 left-32 w-96 h-96 bg-slate-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-6000"></div>

      {/* Medical pattern overlay */}
      <div className="medical-pattern absolute inset-0 opacity-10"></div>

      {/* Enhanced floating elements for dark theme */}
      <div className="absolute top-20 left-[20%] w-20 h-20 border-4 border-blue-400/20 rounded-lg rotate-12 animate-spin-slow"></div>
      <div className="absolute bottom-40 right-[15%] w-16 h-16 border-4 border-indigo-400/30 rounded-full animate-pulse-slow"></div>

      {/* Title Section */}
      <div className="w-full text-center mb-8 md:mb-12 fade-in relative z-10">
        <h1 className="flex flex-row sm:flex-row items-center justify-center gap-1 sm:gap-3 relative">
          {/* 3D PILL text with enhanced styling for dark theme */}
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white transform transition-all duration-700 animate-title-entrance opacity-0 translate-y-10 drop-shadow-lg">
            PILL
          </span>

          <div className="bottom-[-35px] relative mx-0 sm:mx-2 my-2 sm:my-0 transform-gpu">
            {/* Enhanced background for 3D depth */}
            <div className="absolute -inset-1 bg-white/10 rounded-full blur-md"></div>

            {/* Logo with enhanced 3D shadow effect */}
            <div className="relative transform-gpu animate-logo-entrance opacity-0 scale-70">
              <img
                src={assets.logo2}
                alt="PillPath logo"
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 object-contain filter drop-shadow-[4px_6px_12px_rgba(0,0,0,0.6)] transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* 3D PATH text with enhanced styling for dark theme */}
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white transition-all duration-700 delay-300 animate-title-entrance opacity-0 translate-y-10 drop-shadow-lg">
            PATH
          </span>
        </h1>
      </div>

      {/* Main Content Area - Improved responsive layout */}
      <div className="p-5 flex flex-col lg:flex-row items-center justify-between mx-auto relative z-10 w-full gap-6 md:gap-8 lg:gap-12 xl:gap-20">
        {/* Left Text Content - Enhanced colors for dark theme */}
        <div className="flex flex-col justify-center my-2 md:my-6 gap-4 md:gap-8 w-full lg:w-auto animate-fade-in-left delay-200">
          <p className="text-xl md:text-2xl font-medium text-gradient-secondary text-center lg:text-left">
            All your Medicine <br /> needs in one place
          </p>
          <ul className="text-sm md:text-base space-y-3 md:space-y-4 text-white/90 mx-auto lg:mx-0 max-w-sm lg:max-w-none">
            <li className="flex items-center gap-3 animate-fade-in-left delay-300">
              <span className="w-2 md:w-3 h-2 md:h-3 bg-secondary rounded-full shadow-lg shadow-secondary/50"></span>
              <span className="font-medium">
                Take a Picture of your Prescription
              </span>
            </li>
            <li className="flex items-center gap-3 animate-fade-in-left delay-400">
              <span className="w-2 md:w-3 h-2 md:h-3 bg-secondary rounded-full shadow-lg shadow-secondary/50"></span>
              <span className="font-medium">Upload the Prescription</span>
            </li>
            <li className="flex items-center gap-3 animate-fade-in-left delay-500">
              <span className="w-2 md:w-3 h-2 md:h-3 bg-secondary rounded-full shadow-lg shadow-secondary/50"></span>
              <span className="font-medium">Select Pharmacies to Order</span>
            </li>
          </ul>
        </div>

        {/* Center Image - Enhanced for dark theme */}
        <div className="flex-1 flex justify-center max-w-full lg:max-w-[40%] my-4 lg:my-0 animate-fade-in-scale delay-400">
          {assets.pharmacy_img ? (
            <img
              src={assets.header_img}
              alt="Pharmacy service"
              className="object-contain w-full h-auto max-h-[300px] md:max-h-[400px] lg:max-h-[400px] mx-3 float-animation drop-shadow-2xl"
              onError={(e) => {
                // Error handling remains the same
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-[200px] md:h-[300px]">
              <div className="text-white/70">Image not available</div>
            </div>
          )}
        </div>

        {/* Right Card - Responsive width */}
        <GlassCard
          title="Upload Your Prescription"
          icon={Camera}
          iconColor="text-primary"
          headerGradient="from-secondary/90 to-primary-hover/90"
          animationDelay="delay-300"
        >
          <GradientButton
            text="Upload Prescription"
            icon={Upload}
            iconSize={16}
            animationDelay="delay-600"
            onClick={openPrescriptionModal}
            className="w-full mb-4"
          />

          <p className="text-[10px] md:text-[11px] text-center text-gray-300 mt-2 md:mt-3 flex items-center justify-center gap-1">
            <div className="w-1 h-1 bg-secondary rounded-full"></div>
            Your data is always protected
            <div className="w-1 h-1 bg-secondary rounded-full"></div>
          </p>
        </GlassCard>
      </div>

      {/* Wave effect - no changes needed */}
      <div className="absolute bottom-0 left-0 w-full h-16 z-5">
        <svg
          className="absolute bottom-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="rgba(255,255,255,0.05)"
            fillOpacity="1"
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero1;
