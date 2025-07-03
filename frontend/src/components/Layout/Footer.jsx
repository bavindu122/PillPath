import React from "react";
import { NavLink } from "react-router-dom";
import { Mail, Phone, ArrowUpRight, Heart } from "lucide-react";
import logo from "../../assets/logo1.png";

const Footer = () => {
  return (
    <footer className="relative z-0 ">
      {/* Glass Background Effects */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/80 via-primary-hover/70 to-accent/80"></div>
      <div className="absolute top-[-120px] right-[-80px] bg-secondary/20 rounded-full blur-3xl"></div>
      <div className="absolute  left-[-100px] w-[25rem] h-[25rem] bg-primary/25 rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-accent/15 rounded-full blur-2xl animate-float-gentle"></div>

      <div className="container mx-auto px-4 py-10">
        {/* Main Footer Content */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden relative">
          {/* Glass Edge Highlights */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          <div className="absolute bottom-0 left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>

          {/* Footer Content Grid */}
          <div className="px-8 pt-12 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* Column 1: Brand */}
              <div className="flex flex-col">
                <img
                  src={logo}
                  alt="Pharma Logo"
                  className=" h-24 mb-4 z-20 backdrop-blur-md rounded-full shadow-lg"
                />
                <p className="text-light/80 mb-6">
                  Your trusted partner for fast, secure, and affordable pharmacy
                  solutions.
                </p>

                {/* Social Media Icons */}
                <div className="flex gap-3 mb-4">
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-white/10 hover:bg-primary/30 transition-all duration-300 hover:scale-110 shadow border border-white/10"
                    aria-label="Twitter"
                  >
                    <svg
                      className="w-5 h-5 text-light"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.38 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.83 1.92 3.61-.71-.02-1.38-.22-1.97-.54v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 0 1 2 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 24 4.59a8.36 8.36 0 0 1-2.54.7z" />
                    </svg>
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-white/10 hover:bg-primary/30 transition-all duration-300 hover:scale-110 shadow border border-white/10"
                    aria-label="Facebook"
                  >
                    <svg
                      className="w-5 h-5 text-light"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.68 0H1.32C.59 0 0 .59 0 1.32v21.36C0 23.41.59 24 1.32 24h11.5v-9.29H9.69v-3.62h3.13V8.41c0-3.1 1.89-4.79 4.65-4.79 1.32 0 2.45.1 2.78.14v3.22h-1.91c-1.5 0-1.79.71-1.79 1.75v2.3h3.58l-.47 3.62h-3.11V24h6.09c.73 0 1.32-.59 1.32-1.32V1.32C24 .59 23.41 0 22.68 0" />
                    </svg>
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-white/10 hover:bg-primary/30 transition-all duration-300 hover:scale-110 shadow border border-white/10"
                    aria-label="Instagram"
                  >
                    <svg
                      className="w-5 h-5 text-light"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.16c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.43.41a4.92 4.92 0 0 1 1.77 1.02 4.92 4.92 0 0 1 1.02 1.77c.17.46.354 1.26.41 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.41 2.43a4.92 4.92 0 0 1-1.02 1.77 4.92 4.92 0 0 1-1.77 1.02c-.46.17-1.26.354-2.43.41-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.43-.41a4.92 4.92 0 0 1-1.77-1.02 4.92 4.92 0 0 1-1.02-1.77c-.17-.46-.354-1.26-.41-2.43C2.172 15.584 2.16 15.2 2.16 12s.012-3.584.07-4.85c.056-1.17.24-1.97.41-2.43a4.92 4.92 0 0 1 1.02-1.77 4.92 4.92 0 0 1 1.77-1.02c.46-.17 1.26-.354 2.43-.41C8.416 2.172 8.8 2.16 12 2.16zm0-2.16C8.736 0 8.332.012 7.052.07 5.77.128 4.89.31 4.13.54a7.07 7.07 0 0 0-2.57 1.64A7.07 7.07 0 0 0 .54 4.13c-.23.76-.412 1.64-.47 2.92C.012 8.332 0 8.736 0 12c0 3.264.012 3.668.07 4.948.058 1.28.24 2.16.47 2.92a7.07 7.07 0 0 0 1.64 2.57 7.07 7.07 0 0 0 2.57 1.64c.76.23 1.64.412 2.92.47C8.332 23.988 8.736 24 12 24s3.668-.012 4.948-.07c1.28-.058 2.16-.24 2.92-.47a7.07 7.07 0 0 0 2.57-1.64 7.07 7.07 0 0 0 1.64-2.57c.23-.76.412-1.64.47-2.92.058-1.28.07-1.684.07-4.948s-.012-3.668-.07-4.948c-.058-1.28-.24-2.16-.47-2.92a7.07 7.07 0 0 0-1.64-2.57A7.07 7.07 0 0 0 19.87.54c-.76-.23-1.64-.412-2.92-.47C15.668.012 15.264 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm7.842-10.406a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div className="flex flex-col">
                <h4 className="text-lg font-semibold text-light mb-4 relative">
                  <span className="relative z-10">Quick Links</span>
                  <span className="absolute bottom-0 left-0 h-0.5 w-10 bg-secondary"></span>
                </h4>
                <ul className="flex flex-col gap-3">
                  <li>
                    <NavLink
                      to="/"
                      className="text-light/80 hover:text-secondary transition-colors duration-300 flex items-center group"
                    >
                      <span>Home</span>
                      <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/about"
                      className="text-light/80 hover:text-secondary transition-colors duration-300 flex items-center group"
                    >
                      <span>About Us</span>
                      <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/pharmacies"
                      className="text-light/80 hover:text-secondary transition-colors duration-300 flex items-center group"
                    >
                      <span>Pharmacies</span>
                      <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/contact"
                      className="text-light/80 hover:text-secondary transition-colors duration-300 flex items-center group"
                    >
                      <span>Contact Us</span>
                      <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </NavLink>
                  </li>
                </ul>
              </div>

              {/* Column 3: Services */}
              <div className="flex flex-col">
                <h4 className="text-lg font-semibold text-light mb-4 relative">
                  <span className="relative z-10">Services</span>
                  <span className="absolute bottom-0 left-0 h-0.5 w-10 bg-secondary"></span>
                </h4>
                <ul className="flex flex-col gap-3">
                  <li className="text-light/80 hover:text-secondary transition-colors duration-300 cursor-pointer">
                    Prescription Management
                  </li>
                  <li className="text-light/80 hover:text-secondary transition-colors duration-300 cursor-pointer">
                    Pharmacy Matching
                  </li>
                  <li className="text-light/80 hover:text-secondary transition-colors duration-300 cursor-pointer">
                    Order Preview
                  </li>
                  <li className="text-light/80 hover:text-secondary transition-colors duration-300 cursor-pointer">
                    OTC Storefront
                  </li>
                  <li className="text-light/80 hover:text-secondary transition-colors duration-300 cursor-pointer">
                    SMS Alerts
                  </li>
                  <li className="text-light/80 hover:text-secondary transition-colors duration-300 cursor-pointer">
                    Family Profile Management
                  </li>
                </ul>
              </div>

              {/* Column 4: Contact Info */}
              <div className="flex flex-col">
                <h4 className="text-lg font-semibold text-light mb-4 relative">
                  <span className="relative z-10">Contact Info</span>
                  <span className="absolute bottom-0 left-0 h-0.5 w-10 bg-secondary"></span>
                </h4>
                <div className="flex flex-col gap-4">
                  <a
                    href="mailto:pillpath@gmail.com"
                    className="text-light/80 hover:text-secondary transition-colors duration-300 flex items-center gap-2"
                  >
                    <div className="p-2 bg-white/10 rounded-full">
                      <Mail className="w-4 h-4 text-secondary" />
                    </div>
                    <span>pillpath@gmail.com</span>
                  </a>
                  <a
                    href="tel:+9411321489"
                    className="text-light/80 hover:text-secondary transition-colors duration-300 flex items-center gap-2"
                  >
                    <div className="p-2 bg-white/10 rounded-full">
                      <Phone className="w-4 h-4 text-secondary" />
                    </div>
                    <span>+94 11 321 489</span>
                  </a>
                </div>

                {/* Newsletter Signup */}
                <div className="mt-6 p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                  <h5 className="text-sm font-medium text-light mb-2">
                    Get Updates
                  </h5>
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="bg-white/10 border border-white/10 text-light text-sm rounded-l-lg block w-full p-2.5 focus:outline-none focus:ring-1 focus:ring-secondary"
                    />
                    <button className="bg-secondary hover:bg-secondary-hover text-white text-sm font-medium rounded-r-lg px-4 transition-colors duration-300">
                      Join
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="px-8 py-4 border-t border-white/10 backdrop-blur-md bg-white/5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-light/70">
                &copy; {new Date().getFullYear()} PillPath. All rights reserved.
              </p>
              <div className="flex items-center gap-1.5 text-light/70">
                <span className="text-xs">Made with</span>
                <Heart className="w-3.5 h-3.5 text-secondary fill-secondary animate-pulse" />
                <span className="text-xs">by PillPath Team</span>
              </div>
              <div className="flex gap-4 text-xs">
                <a
                  href="/privacy"
                  className="text-light/70 hover:text-secondary transition-colors duration-300"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-light/70 hover:text-secondary transition-colors duration-300"
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
