import React from "react";
import { NavLink } from "react-router-dom";
import { Mail, Phone, ArrowUpRight, Heart, Send } from "lucide-react";
import logo from "../../assets/logo1.png";

const Footer = () => {
  return (
    <footer className="relative z-0 overflow-hidden">
      {/* Dark Background matching OTC Products */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#030B17] via-[#0F172A] to-[#1E1B4B]"></div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        <div className="particles-container">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20 animate-float-random"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 5}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-24 h-24 rounded-full border-2 border-blue-500/10 rotate-45 opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full border-2 border-purple-500/10 -rotate-12 opacity-20"></div>

      <div className="relative z-10">
        {/* Glass Edge Highlights */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

        {/* Footer Content Grid */}
        <div className="container mx-auto px-6 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Column 1: Brand */}
            <div className="flex flex-col space-y-6">
              <div className="flex items-center">
                <img
                  src={logo}
                  alt="PillPath Logo"
                  className="h-16 w-auto brightness-110"
                />
              </div>
              
              <p className="text-white/70 text-sm leading-relaxed">
                Your trusted partner for fast, secure, and affordable pharmacy solutions across Sri Lanka.
              </p>

              {/* Social Media Icons */}
              <div className="flex gap-3">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-110"
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4 text-white group-hover:text-blue-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.38 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.83 1.92 3.61-.71-.02-1.38-.22-1.97-.54v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 0 1 2 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 24 4.59a8.36 8.36 0 0 1-2.54.7z" />
                  </svg>
                </a>
                
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-blue-600/20 hover:border-blue-600/40 transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 text-white group-hover:text-blue-500 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.68 0H1.32C.59 0 0 .59 0 1.32v21.36C0 23.41.59 24 1.32 24h11.5v-9.29H9.69v-3.62h3.13V8.41c0-3.1 1.89-4.79 4.65-4.79 1.32 0 2.45.1 2.78.14v3.22h-1.91c-1.5 0-1.79.71-1.79 1.75v2.3h3.58l-.47 3.62h-3.11V24h6.09c.73 0 1.32-.59 1.32-1.32V1.32C24 .59 23.41 0 22.68 0" />
                  </svg>
                </a>
                
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-pink-500/20 hover:border-pink-500/40 transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 text-white group-hover:text-pink-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.16c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.43.41a4.92 4.92 0 0 1 1.77 1.02 4.92 4.92 0 0 1 1.02 1.77c.17.46.354 1.26.41 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.41 2.43a4.92 4.92 0 0 1-1.02 1.77 4.92 4.92 0 0 1-1.77 1.02c-.46.17-1.26.354-2.43.41-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.43-.41a4.92 4.92 0 0 1-1.77-1.02 4.92 4.92 0 0 1-1.02-1.77c-.17-.46-.354-1.26-.41-2.43C2.172 15.584 2.16 15.2 2.16 12s.012-3.584.07-4.85c.056-1.17.24-1.97.41-2.43a4.92 4.92 0 0 1 1.02-1.77 4.92 4.92 0 0 1 1.77-1.02c.46-.17 1.26-.354 2.43-.41C8.416 2.172 8.8 2.16 12 2.16zm0-2.16C8.736 0 8.332.012 7.052.07 5.77.128 4.89.31 4.13.54a7.07 7.07 0 0 0-2.57 1.64A7.07 7.07 0 0 0 .54 4.13c-.23.76-.412 1.64-.47 2.92C.012 8.332 0 8.736 0 12c0 3.264.012 3.668.07 4.948.058 1.28.24 2.16.47 2.92a7.07 7.07 0 0 0 1.64 2.57 7.07 7.07 0 0 0 2.57 1.64c.76.23 1.64.412 2.92.47C8.332 23.988 8.736 24 12 24s3.668-.012 4.948-.07c1.28-.058 2.16-.24 2.92-.47a7.07 7.07 0 0 0 2.57-1.64 7.07 7.07 0 0 0 1.64-2.57c.23-.76.412-1.64.47-2.92.058-1.28.07-1.684.07-4.948s-.012-3.668-.07-4.948c-.058-1.28-.24-2.16-.47-2.92a7.07 7.07 0 0 0-1.64-2.57A7.07 7.07 0 0 0 19.87.54c-.76-.23-1.64-.412-2.92-.47C15.668.012 15.264 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm7.842-10.406a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="flex flex-col space-y-6">
              <h4 className="text-lg font-semibold text-white mb-2 relative">
                <span className="relative z-10">Quick Links</span>
                <div className="absolute bottom-0 left-0 h-0.5 w-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
              </h4>
              
              <ul className="flex flex-col space-y-3">
                {[
                  { to: "/", label: "Home" },
                  { to: "/about", label: "About Us" },
                  { to: "/pharmacies", label: "Pharmacies" },
                  { to: "/contact", label: "Contact Us" },
                  { to: "/otc-store", label: "OTC Store" }
                ].map((link, index) => (
                  <li key={index}>
                    <NavLink
                      to={link.to}
                      className="group text-white/70 hover:text-green-400 transition-all duration-300 flex items-center text-sm"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.label}
                      </span>
                      <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Services */}
            <div className="flex flex-col space-y-6">
              <h4 className="text-lg font-semibold text-white mb-2 relative">
                <span className="relative z-10">Our Services</span>
                <div className="absolute bottom-0 left-0 h-0.5 w-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              </h4>
              
              <ul className="flex flex-col space-y-3">
                {[
                  "Prescription Management",
                  "Pharmacy Matching",
                  "Order Preview",
                  "OTC Storefront",
                  "SMS Alerts",
                  "Family Profiles"
                ].map((service, index) => (
                  <li key={index} className="text-white/70 hover:text-blue-400 transition-colors duration-300 cursor-pointer text-sm hover:translate-x-1 transform transition-transform">
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact & Newsletter */}
            <div className="flex flex-col space-y-6">
              <h4 className="text-lg font-semibold text-white mb-2 relative">
                <span className="relative z-10">Get in Touch</span>
                <div className="absolute bottom-0 left-0 h-0.5 w-12 bg-gradient-to-r from-green-500 to-purple-500 rounded-full"></div>
              </h4>
              
              {/* Contact Info */}
              <div className="flex flex-col space-y-4">
                <a
                  href="mailto:pillpath@gmail.com"
                  className="group text-white/70 hover:text-green-400 transition-all duration-300 flex items-center gap-3 text-sm"
                >
                  <div className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 group-hover:bg-green-500/20 group-hover:border-green-500/40 transition-all duration-300">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    pillpath@gmail.com
                  </span>
                </a>
                
                <a
                  href="tel:+9411321489"
                  className="group text-white/70 hover:text-blue-400 transition-all duration-300 flex items-center gap-3 text-sm"
                >
                  <div className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 group-hover:bg-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    +94 11 321 489
                  </span>
                </a>
              </div>

              {/* Newsletter Signup */}
              <div className="p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-300">
                <h5 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                  <Send className="w-4 h-4 text-green-400" />
                  Stay Updated
                </h5>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm rounded-l-lg block w-full p-2.5 focus:outline-none focus:ring-2 focus:ring-green-400/40 focus:bg-white/20 transition-all duration-300"
                  />
                  <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white text-sm font-medium rounded-r-lg px-4 transition-all duration-300 hover:scale-105">
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-white/10 bg-white/5 backdrop-blur-md">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-white/60">
                &copy; {new Date().getFullYear()} PillPath. All rights reserved.
              </p>
              
              <div className="flex items-center gap-2 text-white/60">
                <span className="text-xs">Made with</span>
                <Heart className="w-3.5 h-3.5 text-green-400 fill-green-400 animate-pulse" />
                <span className="text-xs">by PillPath Team</span>
              </div>
              
              <div className="flex gap-6 text-xs">
                <a
                  href="/privacy"
                  className="text-white/60 hover:text-green-400 transition-colors duration-300"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-white/60 hover:text-blue-400 transition-colors duration-300"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;