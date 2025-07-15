import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import logo from "../../../assets/logo2.png";
import { assets } from "../../../assets/assets";



export const Cta = () => {
  return (
    <section className="py-1 px-4 relative overflow-hidden">
      {/* Softer background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900"></div>
      
      {/* Subtle floating elements */}
      <div className="absolute top-10 right-20 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-float-gentle"></div>
      <div className="absolute bottom-10 left-20 w-24 h-24 bg-secondary/5 rounded-full blur-xl animate-float-delay"></div>
      <div className="absolute top-5 left-1/4 w-16 h-16 bg-accent/5 rounded-full blur-lg animate-pulse"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - 3D Illustration */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <img
                src={assets.cta_img}
                alt="3D Pharmacy Scene"
                className="w-full max-w-md h-auto object-contain drop-shadow-2xl"
                loading="lazy"
                draggable={false}
              />
              {/* Floating elements around the 3D scene */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-secondary/20 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Right side - CTA Content */}
          <div className="text-center lg:text-left">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white/40 shadow-xl">
              
              {/* Logo */}
              <div className="flex justify-center lg:justify-start mb-4">
                <img
                  src={logo}
                  alt="PillPath Logo"
                  className="w-16 h-16 object-contain drop-shadow-md"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
                Ready to Simplify Your <span className="text-primary">Pharmacy Experience</span>?
              </h2>
              
              <p className="text-gray-600 text-base mb-6 leading-relaxed">
                Join thousands of users who have transformed how they manage medications with PillPath's comprehensive services.
              </p>
              
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-hover text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Get Started Free
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/services#features"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-primary border-2 border-primary/20 font-semibold rounded-xl hover:bg-primary/5 transition-all duration-300"
                >
                  Learn More
                  <ChevronRight size={18} />
                </Link>
              </div>
              
              {/* Trust badge */}
              <div className="flex justify-center lg:justify-start">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm border border-green-200">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  No credit card required
                </span>
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </section>
  );
};

export default Cta;