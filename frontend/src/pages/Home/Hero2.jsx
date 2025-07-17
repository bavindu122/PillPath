import React from "react";
import { MapPin, Locate, Search } from "lucide-react";
import { assets } from "../../assets/assets";
import GradientButton from "../../components/UIs/GradientButton";
import { useNavigate } from "react-router-dom";
import GlassCard from "../../components/UIs/GlassCard";

const Hero2 = () => {
  const navigate = useNavigate();

  const handleFindPharmacy = () => {
    navigate("/find-pharmacy");
  };
  return (
    <div className="relative flex flex-col min-h-[75vh] sm:max-h-[90vh] md:flex-row flex-wrap z-0 rounded-2xl px-4 md:px-8 lg:px-18 shadow-lg overflow-hidden top-5">
      <div className="absolute inset-0 bg-gradient-to-br from-[#030B17] via-[#0F172A] to-[#1E1B4B]"></div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      {/* Background Elements */}

      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-delay"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-xl animate-float-slow"></div>
      </div>
      {/* Title Section */}
      <div className="w-full text-center mb-8 md:mb-12 fade-in relative z-10">
        <h1 className="flex flex-row sm:flex-row items-center justify-center gap-1 sm:gap-3 relative">
          {/* 3D PILL text with less glow */}
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white transform transition-all duration-700 animate-title-entrance opacity-0 translate-y-10 ">
            PHAR
          </span>

          <div className="bottom-[-35px] relative mx-0 sm:mx-2 my-2 sm:my-0 transform-gpu">
            {/* Subtle background for 3D depth */}
            <div className="absolute -inset-1 bg-white/10 rounded-full blur-md"></div>

            {/* Logo with 3D shadow effect */}
            <div className="relative transform-gpu animate-logo-entrance opacity-0 scale-70">
              <img
                src={assets.logo2}
                alt="PillPath logo"
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 object-contain filter drop-shadow-[2px_4px_6px_rgba(0,0,0,0.4)] transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* 3D PATH text with less glow */}
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white transition-all duration-700 delay-300 animate-title-entrance opacity-0 translate-y-10 ">
            MACY
          </span>
        </h1>
      </div>

      {/* Main Content Area */}
      <div className="p-5 flex flex-col lg:flex-row items-center justify-between mx-auto relative z-10 w-full gap-8 lg:gap-12 xl:gap-20">
        {/* Left Text Content */}
        <div className="flex flex-col justify-center my-2 md:my-6 gap-4 md:gap-8 w-full lg:w-auto animate-fade-in-left delay-200">
          <p className="text-xl md:text-2xl font-medium text-accent-purple text-center lg:text-left">
            Find pharmacies <br /> near you
          </p>
          <ul className="text-sm md:text-base space-y-3 md:space-y-4 text-white">
            <li className="flex items-center gap-3 animate-fade-in-left delay-300">
              <span className="w-2 md:w-3 h-2 md:h-3 bg-accent rounded-full shadow-glow"></span>
              <span className="font-medium">
                Click Find the Nearest Pharmacy
              </span>
            </li>
            <li className="flex items-center gap-3 animate-fade-in-left delay-400">
              <span className="w-2 md:w-3 h-2 md:h-3 bg-accent rounded-full shadow-glow"></span>
              <span className="font-medium">Allow GPS Access</span>
            </li>
            <li className="flex items-center gap-3 animate-fade-in-left delay-500">
              <span className="w-2 md:w-3 h-2 md:h-3 bg-accent rounded-full shadow-glow"></span>
              <span className="font-medium">Browse Your Favorite Pharmacy</span>
            </li>
          </ul>
        </div>

        {/* Center Image */}
        <div className="flex-1 flex justify-center max-w-full lg:max-w-[40%] my-4 lg:my-0 animate-fade-in-scale delay-400">
          {assets.pharmacy_img ? (
            <img
              src={assets.pharmacy_img}
              alt="Pharmacy service"
              className="object-contain w-full h-auto max-h-[300px] md:max-h-[400px] lg:max-h-[400px] mx-3 float-animation drop-shadow-2xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
                console.error("Failed to load pharmacy image");
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-[200px] md:h-[300px]">
              <div className="text-white opacity-70">Image not available</div>
            </div>
          )}
        </div>

        {/* Right Card - Responsive width */}
        <GlassCard
          title="Discover Nearby Pharmacies"
          icon={MapPin}
          iconColor="text-indigo-600"
          headerGradient="from-accent/90 to-primary-hover/90"
          animationDelay="delay-300"
        >
          <GradientButton
            text="Find Nearby Pharmacy"
            icon={Locate}
            iconSize={16}
            gradient="from-accent to-accent"
            hoverGradient="hover:from-accent hover:to-accent/90"
            animationDelay="delay-600"
            onClick={handleFindPharmacy}
          />

          <p className="text-[10px] md:text-[11px] text-center text-gray-900 mt-2 md:mt-3 flex items-center justify-center gap-1">
            <div className="w-1 h-1 bg-teal-400 rounded-full"></div>
            Location services will be requested
            <div className="w-1 h-1 bg-teal-400 rounded-full"></div>
          </p>

          {/* Added feature tags to enhance UX */}
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            <span className="text-[8px] md:text-[9px] px-1.5 py-0.5 bg-white/20 rounded-full text-white/80">
              Real-time
            </span>
            <span className="text-[8px] md:text-[9px] px-1.5 py-0.5 bg-white/20 rounded-full text-white/80">
              24/7 Service
            </span>
            <span className="text-[8px] md:text-[9px] px-1.5 py-0.5 bg-white/20 rounded-full text-white/80">
              Nearby
            </span>
          </div>
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
            fill="rgba(255,255,255,0.15)"
            fillOpacity="1"
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero2;
