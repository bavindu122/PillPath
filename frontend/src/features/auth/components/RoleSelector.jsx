import React, { useState } from "react";
import { User, Building2, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import Lottie from "lottie-react";
import customerAnimation from "../../../assets/animations/customer-waving.json";
import pharmacyAnimation from "../../../assets/animations/pharmacy-person.json";

const RoleSelector = ({ onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (onRoleSelect) {
      onRoleSelect(role);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary text-center mb-3 animate-fade-in-up">
        Choose your account type
      </h2>
      <p className="text-light text-center mb-10 max-w-lg mx-auto animate-fade-in-up delay-100">
        Select the type of account you want to create to get started with
        <span className="text-secondary-green font-semibold"> PillPath</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Customer Card */}
        <div
          className={`group cursor-pointer animate-fade-in-up delay-200 ${
            selectedRole === "customer" ? "scale-[1.02]" : ""
          }`}
          onClick={() => handleRoleSelect("customer")}
        >
          <div
            className={`relative h-full bg-white/15 backdrop-blur-xl rounded-3xl shadow-xl border overflow-hidden transition-all duration-500
            ${
              selectedRole === "customer"
                ? "border-secondary/50 bg-white/20 shadow-secondary/20"
                : "border-white/20 hover:bg-white/20 hover:shadow-2xl"
            }`}
          >
            {/* Background Blurs */}
            <div className="absolute top-[-40px] right-[-30px] w-64 h-64 bg-secondary/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-[-50px] left-[-40px] w-80 h-80 bg-primary/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>

            {/* Glass edge highlights */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30"></div>
            <div className="absolute bottom-0 left-[15%] right-[15%] h-[1px] bg-black/5"></div>

            {/* Content Container */}
            <div className="p-6 md:p-8 flex flex-col h-full">
              {/* Animated Customer Avatar - New Addition */}
              <div className="relative w-40 h-40 mx-auto mb-4">
                <div className="absolute inset-0 bg-secondary/10 rounded-full blur-md"></div>
                <div className="relative z-10 h-full w-full">
                  <Lottie
                    animationData={customerAnimation}
                    loop={true}
                    className="w-full h-full"
                    onMouseEnter={(e) => {
                      // Play animation at higher speed on hover
                      e.currentTarget.setSpeed(1.5);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.setSpeed(1);
                    }}
                  />
                </div>

                {/* Animated rings around avatar */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-full rounded-full border border-secondary/20 opacity-70 animate-ping-slow"></div>
                  <div
                    className="absolute w-[110%] h-[110%] rounded-full border border-secondary/10 opacity-50 animate-ping-slow"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                </div>
              </div>

              {/* Title - updated */}
              <h3 className="text-xl md:text-2xl font-bold text-light text-center mb-3">
                Customer
              </h3>

              {/* Description - updated */}
              <p className="text-secondary-green text-center mb-6">
                Create a personal account to search for medications, upload
                prescriptions, and order from pharmacies near you.
              </p>

              {/* Feature List - updated */}
              <ul className="space-y-3 text-sm mb-6 flex-grow">
                <li className="flex items-start gap-2">
                  <div className="text-secondary-green mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-light">
                    Upload and manage prescriptions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="text-secondary-green mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-light">
                    Order medications from local pharmacies
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="text-secondary-green mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-light">
                    Track delivery status in real-time
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="text-secondary-green mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-light">
                    Receive medication reminders
                  </span>
                </li>
              </ul>

              {/* Selection Button */}
              <button
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl transition-all duration-300
                ${
                  selectedRole === "customer"
                    ? "bg-secondary text-white shadow-lg shadow-secondary/30"
                    : "bg-white/20 text-white/90 hover:bg-white/30"
                }`}
              >
                {selectedRole === "customer"
                  ? "Selected"
                  : "Select as Customer"}
                <ArrowRight
                  size={16}
                  className={
                    selectedRole === "customer" ? "animate-bounce-gentle" : ""
                  }
                />
              </button>
            </div>
          </div>
        </div>

        {/* Pharmacy Card */}
        <div
          className={`group cursor-pointer animate-fade-in-up delay-300 ${
            selectedRole === "pharmacy" ? "scale-[1.02]" : ""
          }`}
          onClick={() => handleRoleSelect("pharmacy")}
        >
          <div
            className={`relative h-full bg-white/15 backdrop-blur-xl rounded-3xl shadow-xl border overflow-hidden transition-all duration-500
            ${
              selectedRole === "pharmacy"
                ? "border-accent/50 bg-white/20 shadow-accent/20"
                : "border-white/20 hover:bg-white/20 hover:shadow-2xl"
            }`}
          >
            {/* Background Blurs */}
            <div className="absolute top-[-40px] right-[-30px] w-64 h-64 bg-accent/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-[-50px] left-[-40px] w-80 h-80 bg-primary/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>

            {/* Glass edge highlights */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30"></div>
            <div className="absolute bottom-0 left-[15%] right-[15%] h-[1px] bg-black/5"></div>

            {/* Content Container */}
            <div className="p-6 md:p-8 flex flex-col h-full">
              {/* Animated Pharmacy Avatar - New Addition */}
              <div className="relative w-40 h-40 mx-auto mb-4">
                <div className="absolute inset-0 bg-accent/10 rounded-full blur-md"></div>
                <div className="relative z-10 h-full w-full">
                  <Lottie
                    animationData={pharmacyAnimation}
                    loop={true}
                    className="w-full h-full"
                    onMouseEnter={(e) => {
                      e.currentTarget.setSpeed(1.5);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.setSpeed(1);
                    }}
                  />
                </div>

                {/* Animated rings around avatar */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-full rounded-full border border-accent/20 opacity-70 animate-ping-slow"></div>
                  <div
                    className="absolute w-[110%] h-[110%] rounded-full border border-accent/10 opacity-50 animate-ping-slow"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                </div>
              </div>

              {/* Title - updated */}
              <h3 className="text-xl md:text-2xl font-bold text-light text-center mb-3">
                Pharmacy
              </h3>

              {/* Description - updated */}
              <p className="text-accent-purple text-center mb-6">
                Register your pharmacy to receive prescription orders, manage
                inventory, and grow your business with PillPath.
              </p>

              {/* Feature List - updated */}
              <ul className="space-y-3 text-sm mb-6 flex-grow">
                <li className="flex items-start gap-2">
                  <div className="text-accent-purple mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-light">
                    Receive and manage digital prescriptions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="text-accent-purple mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-light">
                    Manage your pharmacy's inventory
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="text-accent-purple mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-light">
                    Process orders and arrange deliveries
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="text-accent-purple mt-0.5">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-light">
                    Increase your pharmacy's visibility
                  </span>
                </li>
              </ul>

              {/* Selection Button */}
              <button
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl transition-all duration-300
                ${
                  selectedRole === "pharmacy"
                    ? "bg-accent text-white shadow-lg shadow-accent/30"
                    : "bg-white/20 text-white/90 hover:bg-white/30"
                }`}
              >
                {selectedRole === "pharmacy"
                  ? "Selected"
                  : "Select as Pharmacy"}
                <ArrowRight
                  size={16}
                  className={
                    selectedRole === "pharmacy" ? "animate-bounce-gentle" : ""
                  }
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Login link - updated */}
      <div className="mt-8 text-center">
        <Link to="/login">
          <button className="px-8 py-3 rounded-xl text-light font-medium transition-all duration-300 shadow-lg inline-flex items-center gap-2 border-1 border-white/30 bg-primary/20 hover:bg-primary/90 shadow-primary/30">
            <span className="text-info">Already have an account?</span> Log in
            <ArrowRight size={16} className="animate-bounce-gentle" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RoleSelector;
