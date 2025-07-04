import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
// Import your logo (adjust the path if needed)
import logo from "../../../assets/logo2.png"; // or logo.svg

export const Cta = () => {
  return (
    <div>
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Enhanced animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-hover to-accent opacity-95"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[30%] bg-white/10 rounded-full blur-3xl animate-float-gentle"></div>
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-white/10 rounded-full blur-3xl animate-float-delay"
          style={{ animationDelay: "3s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse opacity-40 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-10 right-1/4">
          <Sparkles className="w-10 h-10 text-white/40 animate-spin-slow" />
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl ring-2 ring-primary/10 hover:ring-accent/20 transition-all duration-500">
            <div className="text-center">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <img
                  src={logo}
                  alt="PillPath Logo"
                  className="w-24 h-24 object-contain drop-shadow-lg"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white drop-shadow">
                Ready to Simplify Your Pharmacy Experience?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of users who have transformed how they manage medications with <span className="font-semibold text-accent-purple ">PillPath</span>'s comprehensive services.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-10 py-5 bg-white text-primary font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:scale-105 focus:ring-2 focus:ring-primary/40"
                >
                  Create Free Account
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/services#features"
                  className="inline-flex items-center gap-2 px-10 py-5 bg-transparent text-white border-2 border-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-accent/40"
                >
                  Learn More
                  <ChevronRight size={20} />
                </Link>
              </div>
              <div className="mt-8 flex justify-center">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white/80 rounded-full text-sm shadow backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-accent-purple animate-pulse" />
                  No credit card required
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cta;