
import React, { useState, useEffect, useRef } from "react";
import { Building, FileText, Users, Calendar } from "lucide-react";

const stats = [
  {
    id: 1,
    icon: <Building className="w-8 h-8" />,
    value: 1500,
    label: "Registered Pharmacies",
    color: "from-blue-500 to-blue-600",
    textColor: "text-blue-400",
    delay: "delay-100"
  },
  {
    id: 2,
    icon: <FileText className="w-8 h-8" />,
    value: 125000,
    label: "Prescriptions Processed",
    color: "from-green-500 to-green-600",
    textColor: "text-green-400",
    delay: "delay-200"
  },
  {
    id: 3,
    icon: <Users className="w-8 h-8" />,
    value: 50000,
    label: "Happy Customers",
    color: "from-purple-500 to-purple-600",
    textColor: "text-purple-400",
    delay: "delay-300"
  },
  {
    id: 4,
    icon: <Calendar className="w-8 h-8" />,
    value: 5,
    label: "Years of Service",
    color: "from-blue-500 to-blue-600",
    textColor: "text-blue-400",
    delay: "delay-400"
  }
];

const CountUp = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (countRef.current) {
      observer.observe(countRef.current);
    }
    
    return () => {
      if (countRef.current) {
        observer.disconnect();
      }
    };
  }, []);
  
  useEffect(() => {
    if (!isVisible) return;
    
    let startTime;
    let animationFrame;
    
    const startAnimation = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(end * percentage));
      
      if (percentage < 1) {
        animationFrame = requestAnimationFrame(startAnimation);
      }
    };
    
    animationFrame = requestAnimationFrame(startAnimation);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [end, duration, isVisible]);
  
  return <span ref={countRef}>{count.toLocaleString()}</span>;
};

const Statistics = () => {
  return (
    <section className="py-16 px-4 relative overflow-hidden">
      {/* Dark background matching CoreFeatures */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#030B17] via-[#0F172A] to-[#1E1B4B]"></div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        <div className="particles-container">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20 animate-float-random"
              style={{
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 15 + 8}s`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-blue-500/10 rotate-45 opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full border-4 border-purple-500/10 -rotate-12 opacity-20"></div>
      <div className="absolute top-1/2 left-0 w-64 h-64 -translate-y-1/2 rounded-full radial-pulse-accent opacity-10"></div>

      <div className="container mx-auto relative z-10">
        {/* Header matching CoreFeatures style */}
        <div className="text-center mb-12">
          <h6 className="text-green-400 uppercase tracking-wider text-sm font-semibold mb-2 animate-fade-in-up">
            Our Achievement
          </h6>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up text-shadow-sm">
            <span className="text-gradient-primary">Our</span>{" "}
            <span className="text-white">Impact</span>
          </h2>

          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 rounded-full mx-auto mb-4"></div>

          <p className="text-white text-base max-w-2xl mx-auto animate-fade-in-up delay-200">
            Numbers that showcase our commitment to revolutionizing pharmacy services and improving healthcare accessibility
          </p>
        </div>
        
        {/* Stats grid matching CoreFeatures layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div 
              key={stat.id}
              className={`${stat.delay} animate-fade-in-up rounded-xl bg-white/10 backdrop-blur-md border border-white/10 p-6 text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden`}
            >
              {/* Glass highlight effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Icon container */}
              <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg relative z-10`}>
                {stat.icon}
              </div>
              
              {/* Counter */}
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300 relative z-10">
                <CountUp end={stat.value} />
                {stat.id === 4 && "+"}
              </h3>
              
              {/* Label */}
              <p className="text-gray-300 font-medium text-sm uppercase tracking-wider leading-relaxed relative z-10">
                {stat.label}
              </p>

              {/* Bottom accent line */}
              <div className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r ${stat.color} group-hover:w-full transition-all duration-700`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
