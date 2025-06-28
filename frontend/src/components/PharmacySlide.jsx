import React from "react";
import { MapPin, Locate, Search } from "lucide-react";
import { assets } from "../assets/assets";

const PharmacySlide = () => {
  return (
    <div className="relative flex flex-col min-h-[75vh] md:flex-row flex-wrap bg-gradient-to-b from-primary to-primary-hover z-0 rounded-2xl px-4 md:px-8 lg:px-18 shadow-lg overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        {/* Animated circle pattern */}
        <div className="absolute top-10 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float-delay"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-xl animate-float-slow"></div>

        {/* Pharmacy-specific pattern - pill shapes */}
        <div className="absolute top-[30%] right-[25%] w-28 h-12 border-4 border-white/10 rounded-full rotate-45 animate-pulse-slow"></div>
        <div
          className="absolute top-[35%] right-[27%] w-28 h-12 border-4 border-white/10 rounded-full rotate-45 animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Additional pill shapes */}
        <div className="absolute top-20 left-[20%] w-20 h-20 border-4 border-white/10 rounded-lg rotate-12 animate-spin-slow"></div>
        <div className="absolute bottom-[40%] left-[20%] w-24 h-10 border-4 border-secondary/20 rounded-full rotate-[30deg] animate-pulse-slow"></div>
       
        {/* Medical cross patterns */}
        <div className="medical-pattern absolute inset-0 opacity-10"></div>

        {/* Map-like grid pattern for the pharmacy finder theme */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 gap-2">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="col-span-1 h-full border-r border-white/10"
              ></div>
            ))}
          </div>
          <div
            className="absolute top-20 right-[25%] w-4 h-4 bg-secondary/40 rounded-full animate-ping"
            style={{ animationDuration: "3s" }}
          ></div>

          <div
            className="absolute bottom-40 left-[30%] w-3 h-3 bg-secondary/40 rounded-full animate-ping"
            style={{ animationDuration: "4s", animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-[60%] right-[15%] w-2 h-2 bg-secondary/40 rounded-full animate-ping"
            style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}
          ></div>
        </div>
      </div>

      <div className="w-full text-center md:text-left mb-8 fade-in relative z-10">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-2 ">
          <span className="text-7xl sm:text-9xl text-white ">PHAR</span>
          <img
            src={assets.logo2}
            alt="icon"
            className="w-34 h-34 filter drop-shadow-lg"
          />
          <span className="text-7xl sm:text-9xl text-white ">MACY</span>
        </h1>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mx-auto relative z-10 w-full">
        <div
          className="flex flex-col justify-center my-6 gap-8 fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <p className="text-2xl font-medium text-white">
            Find pharmacies <br /> near you
          </p>
          <ul className="text-base space-y-4 text-white stagger-fade-in">
            <li className="flex items-center gap-3">
              <span className="w-3 h-3 bg-secondary rounded-full shadow-glow"></span>
              <span className="font-medium">
                Click Find the Nearest Pharmacy
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-3 h-3 bg-secondary rounded-full shadow-glow"></span>
              <span className="font-medium">Allow GPS Access</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-3 h-3 bg-secondary rounded-full shadow-glow"></span>
              <span className="font-medium">Browse Your Favorite Pharmacy</span>
            </li>
          </ul>
        </div>

        <div className="flex-1 flex justify-center">
          {assets.pharmacy_img ? (
            <img
              src={assets.pharmacy_img}
              alt="Pharmacy service"
              className="object-contain h-110 mx-3 float-animation drop-shadow-2xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
                console.error("Failed to load pharmacy image");
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-110">
              <div className="text-white opacity-70">Image not available</div>
            </div>
          )}
        </div>

        <div className="fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="flex flex-col items-center justify-center mb-6 h-50 w-80 bg-white/90 backdrop-blur-md rounded-xl gap-3 hover:translate-y-[-5px] transition-all duration-300 shadow-xl card-shine">
            <div className="bg-upload-bg-hover p-4 rounded-t-xl flex flex-col justify-center items-center w-full">
              <p className="mb-4 text-sm font-medium text-primary">
                Discover pharmacies in your area
              </p>
              <MapPin className="w-10 h-10 text-primary animate-pulse drop-shadow-md" />
            </div>
            <button className="px-4 my-3 bg-secondary text-white py-3 rounded-full hover:bg-secondary-hover transition-all pulse-on-hover shadow-md">
              <div className="flex gap-2 items-center font-medium">
                <Locate size={18} />
                <span>Find nearby pharmacy</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Wave effect at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-16 z-5">
        <svg
          className="absolute bottom-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="rgba(255,255,255,0.15)"
            fillOpacity="1"
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default PharmacySlide;
