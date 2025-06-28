import React from "react";
import { assets } from "../assets/assets";
import { Camera, Upload, PlusCircle } from "lucide-react";

const Header = () => {
  return (
    <div className="relative flex flex-col min-h-[75vh] md:flex-row flex-wrap bg-gradient-to-b from-primary to-primary-hover z-0 rounded-2xl px-4 md:px-8 lg:px-18 shadow-lg overflow-hidden top-5">
      {/* Background Elements remain unchanged */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        {/* Keep existing background elements */}
        <div className="absolute top-10 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float-delay"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-xl animate-float-slow"></div>

        {/* Animated circle pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-secondary/10 rounded-full blur-xl animate-float-delay"></div>

        {/* Medical cross patterns */}
        <div className="medical-pattern absolute inset-0 opacity-5"></div>

        {/* Animated geometric shapes */}
        <div className="absolute top-20 left-[20%] w-20 h-20 border-4 border-white/10 rounded-lg rotate-12 animate-spin-slow"></div>
        <div className="absolute bottom-40 right-[15%] w-16 h-16 border-4 border-secondary/20 rounded-full animate-pulse-slow"></div>
      </div>

      {/* Title Section */}
      <div className="w-full text-center md:text-left mb-4 md:mb-8 fade-in relative z-10">
        <h1 className="text-4xl font-bold flex flex-col sm:flex-row items-center justify-center gap-2">
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white transition-all duration-700 animate-title-entrance opacity-0 transform translate-y-10">
            PILL
          </span>
          <img
            src={assets.logo2}
            alt="icon"
            className="w-20 h-20 sm:w-28 sm:h-28 md:w-34 md:h-34 filter drop-shadow-lg transition-all duration-700 delay-200 animate-logo-entrance opacity-0 transform scale-50"
          />
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white transition-all duration-700 delay-400 animate-title-entrance opacity-0 transform translate-y-10">
            PATH
          </span>
        </h1>
      </div>

      {/* Main Content Area - Improved responsive layout */}
      <div className="flex flex-col lg:flex-row items-center justify-between mx-auto relative z-10 w-full gap-6 md:gap-8 lg:gap-12 xl:gap-20">
        {/* Left Text Content */}
        <div className="flex flex-col justify-center my-2 md:my-6 gap-4 md:gap-8 w-full lg:w-auto animate-fade-in-left delay-200">
          <p className="text-xl md:text-2xl font-medium text-white text-center lg:text-left">
            All your Medicine <br /> needs in one place
          </p>
          <ul className="text-sm md:text-base space-y-3 md:space-y-4 text-white mx-auto lg:mx-0 max-w-sm lg:max-w-none">
            <li className="flex items-center gap-3 animate-fade-in-left delay-300">
              <span className="w-2 md:w-3 h-2 md:h-3 bg-secondary rounded-full shadow-glow"></span>
              <span className="font-medium">
                Take a Picture of your Prescription
              </span>
            </li>
            <li className="flex items-center gap-3 animate-fade-in-left delay-400">
              <span className="w-2 md:w-3 h-2 md:h-3 bg-secondary rounded-full shadow-glow"></span>
              <span className="font-medium">Upload the Prescription</span>
            </li>
            <li className="flex items-center gap-3 animate-fade-in-left delay-500">
              <span className="w-2 md:w-3 h-2 md:h-3 bg-secondary rounded-full shadow-glow"></span>
              <span className="font-medium">Select Pharmacies to Order</span>
            </li>
          </ul>
        </div>

        {/* Center Image - Improved responsive sizing */}
        <div className="flex-1 flex justify-center max-w-full lg:max-w-[40%] my-4 lg:my-0 animate-fade-in-scale delay-400">
          {assets.pharmacy_img ? (
            <img
              src={assets.header_img}
              alt="Pharmacy service"
              className="object-contain w-full h-auto max-h-[300px] md:max-h-[400px] lg:max-h-[500px] mx-3 float-animation drop-shadow-2xl"
              onError={(e) => {
                // Error handling remains the same
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-[200px] md:h-[300px]">
              <div className="text-white opacity-70">Image not available</div>
            </div>
          )}
        </div>

        {/* Right Card - Responsive width */}
        <div className="w-full sm:w-auto mx-auto lg:mx-0 animate-fade-in-right delay-300">
          <div className="group flex flex-col items-center justify-center mb-6 h-auto w-full sm:w-[340px] max-w-full bg-white/20 backdrop-blur-xl rounded-2xl gap-4 hover:translate-y-[-8px] hover:shadow-2xl transition-all duration-500 shadow-xl relative overflow-hidden border border-white/30">
            {/* Background glass elements */}
            <div className="absolute top-[-40px] right-[-30px] w-64 h-64 bg-secondary/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-[-50px] left-[-40px] w-80 h-80 bg-primary/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute top-[30%] left-[-20px] w-40 h-40 bg-secondary/10 rounded-full blur-xl group-hover:scale-105 transition-transform duration-700"></div>

            {/* Prescription themed floating elements */}
            <div className="absolute top-[10%] right-[10%] w-8 h-4 bg-indigo-400/40 rounded-full rotate-45 animate-pulse-slow"></div>
            <div className="absolute bottom-[15%] left-[15%] w-6 h-3 bg-pink-400/40 rounded-full rotate-[30deg] animate-pulse-slow"></div>
            <div
              className="absolute top-[60%] right-[15%] w-4 h-4 bg-teal-400/30 rounded-full animate-ping"
              style={{ animationDuration: "3s" }}
            ></div>
            <div
              className="absolute top-[70%] left-[20%] w-2 h-2 bg-indigo-300/30 rounded-full animate-ping"
              style={{ animationDuration: "4s" }}
            ></div>

            {/* Paper/prescription element */}
            <div className="absolute top-[35%] right-[15%] w-12 h-16 bg-white/30 rounded-sm rotate-12 border-t-2 border-indigo-300/30"></div>

            {/* Modern glass morphism header - responsive adjustments */}
            <div className="bg-gradient-to-r from-secondary/90 to-primary-hover/90 backdrop-blur-md p-4 md:p-6 rounded-t-2xl flex flex-col justify-center items-center w-full relative overflow-hidden border-b border-white/10">
              {/* Glass reflections */}
              <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-white/20 to-transparent"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-xl"></div>

              {/* Enhanced animated rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-40 h-40 rounded-full border-2 border-white/20 opacity-70 animate-ping-slow"></div>
                <div
                  className="absolute w-60 h-60 rounded-full border border-white/10 opacity-50 animate-ping-slow"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute w-20 h-20 rounded-full border-2 border-white/30 opacity-80 animate-ping-slow"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>

              {/* Scattered dots pattern */}
              <div className="absolute inset-0 overflow-hidden opacity-30">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.5 + 0.3,
                    }}
                  ></div>
                ))}
              </div>

              <h3 className="mb-3 md:mb-4 text-base md:text-lg font-semibold text-white tracking-wide drop-shadow-md relative z-10">
                Upload Your Prescription
              </h3>

              <div className="relative z-10">
                <div className="absolute inset-0 bg-white/30 rounded-full blur-md transform scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                <div className="relative bg-white/80 backdrop-blur-md p-3 md:p-4 rounded-full shadow-md group-hover:shadow-lg transition-all duration-300 border border-white/50">
                  <Camera className="w-10 h-10 md:w-12 md:h-12 text-primary animate-pulse drop-shadow-md" />
                </div>
              </div>
            </div>

            {/* Enhanced button section - responsive padding */}
             <div className="px-4 md:px-6 pb-4 md:pb-6 w-full">
        <button className="w-full bg-gradient-to-r from-secondary/90 to-secondary hover:from-secondary hover:to-secondary/90 text-white py-3 md:py-4 rounded-xl backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-secondary/30 active:scale-[0.98] transition-all duration-300 group-hover:scale-[1.02] relative overflow-hidden animate-scale-in delay-600">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 rounded-xl"></div>
                <div className="flex gap-2 md:gap-3 items-center justify-center font-medium relative z-10">
                  <Upload size={16} className="animate-bounce-gentle" />
                  <span className="text-sm md:text-base">
                    Upload Prescription
                  </span>
                </div>
              </button>

              <p className="text-[10px] md:text-[11px] text-center text-gray-300 mt-2 md:mt-3 flex items-center justify-center gap-1">
                <div className="w-1 h-1 bg-secondary rounded-full"></div>
                Your data is always protected
                <div className="w-1 h-1 bg-secondary rounded-full"></div>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave effect - no changes needed */}
      <div className="absolute bottom-0 left-0 w-full h-16 z-5">
        <svg
          className="absolute bottom-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="rgba(255,255,255,0.1)"
            fillOpacity="1"
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Header;
