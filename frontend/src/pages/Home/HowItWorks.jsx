import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  MapPin,
  Pill,
  ChevronRight,
  ArrowRight
} from "lucide-react";

const steps = [
  {
    id: 1,
    number: "1",
    title: "Upload Prescription",
    description: "Securely upload your prescription through our HIPAA-compliant platform",
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
    description: "Compare nearby pharmacies with real-time medication availability",
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
    description: "Collect at pharmacy or choose home delivery for your medications",
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
    <section className="py-12 bg-grad relative">
      <div className="container mx-auto max-w-5xl px-4">
        {/* Clean header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-blue mb-4">
            How PillPath Works
          </h2>
          
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-4"></div>
          
          <p className="text-dark max-w-lg mx-auto">
            Get your medications in three simple steps
          </p>
        </div>

        {/* Steps with better spacing */}
        <div className="flex flex-col md:flex-row md:gap-8 lg:gap-20">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex-1 relative mb-8 md:mb-0"
              onMouseEnter={() => setHoverStep(index)}
              onMouseLeave={() => setHoverStep(null)}
            >
              {/* Number indicator */}
              <div className="flex justify-center mb-6">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold z-10 transition-all duration-300 ${
                    activeStep === index ? step.color : "bg-white border border-gray-200 text-gray-500"
                  } ${activeStep === index ? "shadow-md" : ""}`}
                >
                  {step.number}
                </div>
              </div>
              
              {/* Step content with more padding */}
              <div 
                className={`px-10 py-3 rounded-lg transition-all duration-300 ${
                  activeStep === index 
                    ? `${step.lightColor} ${step.borderColor} border` 
                    : "bg-white border border-gray-100"
                }`}
              >
                <div 
                  className={`inline-flex p-2  rounded-md mb-4 ${
                    activeStep === index ? step.color : "bg-gray-100"
                  }`}
                >
                  <div className={activeStep === index ? "text-white" : "text-gray-600"}>
                    {step.icon}
                  </div>
                </div>
                
                <h3 
                  className={`font-bold text-lg mb-3 ${
                    activeStep === index ? step.textColor : "text-gray-800"
                  }`}
                >
                  {step.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {step.description}
                </p>
                
                {(activeStep === index || hoverStep === index) && (
                  <div className="text-right">
                    <button className={`text-sm font-medium ${step.textColor} inline-flex items-center`}>
                      Learn more
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Progress indicator dots */}
        <div className="flex justify-center space-x-3 mt-12">
          {steps.map((_, index) => (
            <button 
              key={index}
              onClick={() => setActiveStep(index)}
              className="w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none"
              style={{
                backgroundColor: activeStep === index ? 'var(--color-primary)' : '#e5e7eb',
                transform: activeStep === index ? 'scale(1.2)' : 'scale(1)'
              }}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Clean CTA */}
        <div className="text-center mt-10">
          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors duration-300"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          
          {/* Temporary Pharmacist Dashboard Access */}
          <Link
            to="/pharmacist"
            className="inline-flex items-center px-6 py-3 bg-secondary text-white font-medium rounded-lg hover:bg-secondary-hover transition-colors duration-300"
          >
            Pharmacist Dashboard (Demo)
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          
        </div>
        
      </div>
    </section>
  );
};

export default HowItWorks;