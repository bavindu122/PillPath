import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, MapPin, Pill, ChevronRight, ArrowRight } from "lucide-react";

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
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [hoverStep, setHoverStep] = useState(null);

  useEffect(() => {
    // Auto-cycle through steps for demonstration
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 relative overflow-hidden animate-fade-in-up">
      {/* Vibrant top overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent via-[var(--color-step-pink)] to-[var(--color-step-yellow)] opacity-10 pointer-events-none"></div>

      <div className="container mx-auto max-w-5xl px-4 relative z-10">
        {/* Modern header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-primary-blue mb-4 animate-fade-in-up">
            How PillPath Works
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-[var(--color-step-pink)] mx-auto mb-4"></div>
          <p className="text-dark max-w-lg mx-auto text-lg">
            Follow these simple steps for all your pharmacy needs
          </p>
        </div>

        {/* Steps in a more dynamic layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center p-6 rounded-xl transition-all duration-300 border ${
                activeStep === index
                  ? `${step.borderColor} ${step.lightColor}`
                  : "bg-white border-gray-100"
              } hover:shadow-lg relative group animate-float-gentle`}
              onMouseEnter={() => setHoverStep(index)}
              onMouseLeave={() => setHoverStep(null)}
              onClick={() => setActiveStep(index)}
            >
              {/* Number circle */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full mb-4 font-semibold text-white shadow-md transition-all duration-300 ${
                  activeStep === index
                    ? `${step.color} scale-110`
                    : "bg-white text-gray-500 border border-gray-300"
                }`}
              >
                {step.number}
              </div>

              {/* Icon */}
              <div
                className={`text-white p-3 rounded-md mb-4 transition-all duration-300 ${
                  activeStep === index
                    ? step.color
                    : "bg-gray-200 text-gray-600"
                } group-hover:scale-110`}
              >
                {step.icon}
              </div>

              {/* Title & Description */}
              <h3
                className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                  activeStep === index ? step.textColor : "text-gray-800"
                }`}
              >
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm text-center mb-3">
                {step.description}
              </p>

              {/* Learn More Button */}
              {(activeStep === index || hoverStep === index) && (
                <button
                  className={`text-sm font-medium inline-flex items-center transition-all duration-300 delay-100 ${step.textColor} hover:underline`}
                >
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              )}

              {/* Subtle accent behind the step */}
              <div className="absolute top-0 left-0 w-full h-full bg-white/5 rounded-xl blur-xl group-hover:opacity-30 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Animated progress dots */}
        <div className="flex justify-center space-x-3">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className="w-3 h-3 rounded-full transition-all duration-300 focus:outline-none"
              style={{
                backgroundColor:
                  activeStep === index ? "var(--color-step-pink)" : "#e5e7eb",
                transform: activeStep === index ? "scale(1.3)" : "scale(1)",
              }}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        {/* Clean CTA Section */}
        <div className="text-center mt-10">
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-3 bg-[var(--color-step-pink)] text-white font-medium rounded-lg hover:bg-[var(--color-step-yellow)] transition-colors duration-300 mr-4"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            to="/pharmacist"
            className="inline-flex items-center px-8 py-3 bg-secondary text-white font-medium rounded-lg hover:bg-secondary-hover transition-colors duration-300"
          >
            Pharmacist Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        
      </div>
    </section>
  );
};

export default HowItWorks;
