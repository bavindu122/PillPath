import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, MapPin, Pill, ChevronRight, ArrowRight } from "lucide-react";
import { assets } from "../../assets/assets";
import { motion } from "framer-motion";

const stepImages = [
  assets.upload_rx_img,
  assets.find_pharmacy_img,
  assets.delivery_img,
];

const steps = [
  {
    id: 1,
    number: "1",
    title: "Upload Prescription",
    description:
      "Securely upload your prescription through our HIPAA-compliant platform",
    icon: <FileText size={22} />,
    color: "bg-primary",
    lightColor: "bg-primary/10",
    borderColor: "border-primary/20",
    textColor: "text-primary-blue",
    hoverColor: "text-primary-blue",
    gradient: "from-blue-400/80 to-indigo-500/80",
    imageBg: "bg-gradient-to-br from-blue-50 to-cyan-100",
  },
  {
    id: 2,
    number: "2",
    title: "Find Pharmacy",
    description:
      "Compare nearby pharmacies with real-time medication availability",
    icon: <MapPin size={22} />,
    color: "bg-secondary",
    lightColor: "bg-secondary/10",
    borderColor: "border-secondary/20",
    textColor: "text-secondary-green",
    hoverColor: "text-secondary-green",
    gradient: "from-emerald-400/80 to-teal-500/80",
    imageBg: "bg-gradient-to-br from-emerald-50 to-teal-100",
  },
  {
    id: 3,
    number: "3",
    title: "Get Medications",
    description:
      "Collect at pharmacy or choose home delivery for your medications",
    icon: <Pill size={22} />,
    color: "bg-accent",
    lightColor: "bg-accent/10",
    borderColor: "border-accent/20",
    textColor: "text-accent-purple",
    hoverColor: "text-accent-purple",
    gradient: "from-orange-400/80 to-red-500/80",
    imageBg: "bg-gradient-to-br from-orange-50 to-red-100",
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [hoverStep, setHoverStep] = useState(null);

  useEffect(() => {
    // Auto-cycle through steps for demonstration
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-5 relative overflow-hidden">
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

      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        {/* Modern header with glassmorphic styling */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How <span className="text-gradient-secondary">PillPath</span>{" "}
              Works
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent mx-auto mb-6 rounded-full"></div>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              Your medication journey made simple, secure, and seamless
            </p>
          </div>
        </motion.div>

        {/* Enhanced glassmorphic cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
            >
              <div
                className={`h-full flex flex-col rounded-2xl transition-all duration-500 group relative overflow-hidden cursor-pointer ${
                  activeStep === index
                    ? "shadow-2xl scale-105 z-10"
                    : "shadow-xl hover:shadow-2xl hover:scale-102"
                }`}
                onMouseEnter={() => setHoverStep(index)}
                onMouseLeave={() => setHoverStep(null)}
                onClick={() => setActiveStep(index)}
              >
                {/* Background glass elements - similar to GlassCard */}
                <div className="absolute top-[-40px] right-[-30px] w-64 h-64 bg-secondary/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute bottom-[-50px] left-[-40px] w-80 h-80 bg-primary/20 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute top-[30%] left-[-20px] w-40 h-40 bg-secondary/10 rounded-full blur-xl group-hover:scale-105 transition-transform duration-700"></div>

                {/* Floating elements - matching GlassCard */}
                <div className="absolute top-[10%] right-[10%] w-8 h-4 bg-indigo-400/40 rounded-full rotate-45 animate-pulse-slow"></div>
                <div className="absolute bottom-[15%] left-[15%] w-6 h-3 bg-pink-400/40 rounded-full rotate-[30deg] animate-pulse-slow"></div>
                <div
                  className="absolute top-[60%] right-[15%] w-4 h-4 bg-teal-400/30 rounded-full animate-ping"
                  style={{ animationDuration: "3s" }}
                ></div>

                {/* Glass effect overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    step.gradient
                  } transition-opacity duration-500 pointer-events-none ${
                    activeStep === index ? "opacity-20" : "opacity-0"
                  }`}
                ></div>

                {/* Main card background - enhanced glass effect */}
                <div className="absolute inset-0 bg-white/20 backdrop-blur-xl border border-white/30"></div>

                {/* Card content */}
                <div className="relative z-10 flex flex-col h-full">
                  {/* Image section with glass header */}
                  <div
                    className={` backdrop-blur-md rounded-t-2xl overflow-hidden h-56 relative border-b border-white/20`}
                  >
                    {/* Glass reflections */}
                    <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-white/20 to-transparent"></div>

                    <img
                      src={stepImages[index]}
                      alt={step.title}
                      className="w-full h-full object-contain object-center transition-transform duration-700 transform group-hover:scale-105 mix-blend-overlay"
                    />

                    {/* Step number floating badge */}
                    <div
                      className={`absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full text-white font-bold shadow-lg transition-all duration-300 ${
                        activeStep === index
                          ? step.color
                          : "bg-white/30 backdrop-blur-md"
                      } ${activeStep === index ? "scale-110" : ""}`}
                    >
                      {step.number}
                    </div>

                    {/* Scattered dots pattern */}
                    <div className="absolute inset-0 overflow-hidden opacity-30">
                      {[...Array(10)].map((_, i) => (
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
                  </div>

                  {/* Text content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3
                      className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                        activeStep === index ? step.hoverColor : step.textColor
                      }`}
                    >
                      {step.title}
                    </h3>

                    <p
                      className={`text-sm mb-4 flex-grow transition-colors duration-300 ${
                        activeStep === index ? "text-white/90" : "text-white/70"
                      }`}
                    >
                      {step.description}
                    </p>

                    {/* Learn More Button */}
                    <div className="mt-auto">
                      <button
                        className={`text-sm font-medium inline-flex items-center transition-all duration-300 ${
                          activeStep === index
                            ? step.hoverColor
                            : "text-white/80 hover:text-white"
                        } hover:underline`}
                      >
                        Learn more <ChevronRight className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom accent border */}
                <div
                  className={`h-1.5 w-full ${
                    step.color
                  } absolute bottom-0 left-0 right-0 transition-all duration-500 ${
                    activeStep === index ? "opacity-100" : "opacity-0"
                  }`}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Animated progress dots */}
        <div className="flex justify-center space-x-4 mb-12">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`w-3 h-3 rounded-full transition-all duration-500 focus:outline-none ${
                activeStep === index
                  ? "bg-white shadow-md shadow-white/30"
                  : "bg-white/50"
              }`}
              style={{
                transform: activeStep === index ? "scale(1.4)" : "scale(1)",
              }}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
