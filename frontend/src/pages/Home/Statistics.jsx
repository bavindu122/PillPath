import React, { useState, useEffect, useRef } from "react";
import { Building, FileText, Users, Calendar } from "lucide-react";

const stats = [
  {
    id: 1,
    icon: <Building className="w-8 h-8" />,
    value: 1500,
    label: "Registered Pharmacies",
    color: "from-blue-500 to-blue-600",
    textColor: "text-blue-600",
    delay: "delay-100"
  },
  {
    id: 2,
    icon: <FileText className="w-8 h-8" />,
    value: 125000,
    label: "Prescriptions Processed",
    color: "from-green-500 to-green-600",
    textColor: "text-green-600",
    delay: "delay-200"
  },
  {
    id: 3,
    icon: <Users className="w-8 h-8" />,
    value: 50000,
    label: "Happy Customers",
    color: "from-purple-500 to-purple-600",
    textColor: "text-purple-600",
    delay: "delay-300"
  },
  {
    id: 4,
    icon: <Calendar className="w-8 h-8" />,
    value: 5,
    label: "Years of Service",
    color: "from-indigo-500 to-indigo-600",
    textColor: "text-indigo-600",
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
    <section className="py-12 px-4 relative overflow-hidden">
      {/* Light background matching OtcProducts */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900"></div>
      
      {/* Enhanced floating elements for dark theme */}
      <div className="absolute top-20 left-[10%] w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float-slow"></div>
      <div className="absolute top-32 right-20 w-80 h-80 bg-indigo-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delay"></div>
      <div className="absolute -bottom-20 left-32 w-96 h-96 bg-slate-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-400/15 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-6000"></div>

      {/* Medical Pattern Overlay */}
      <div className="absolute inset-0 medical-pattern opacity-10"></div>

      {/* Geometric Shapes for Visual Interest */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-white/20 rotate-45 animate-pulse"></div>
      <div className="absolute top-40 right-32 w-3 h-3 bg-green-400/30 rotate-12 animate-bounce"></div>
      <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-purple-400/40 rounded-full animate-ping"></div>
      <div className="absolute bottom-48 right-20 w-5 h-5 bg-white/15 rotate-45 animate-pulse"></div>

      <div className="container mx-auto relative z-10">
        {/* Header with light theme styling */}
        <div className="text-center mb-12">
          <h6 className="text-green-400 uppercase tracking-wider text-sm font-semibold mb-2 animate-fade-in-up">
            Our Achievement
          </h6>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up text-shadow-sm">
            <span className="text-gradient-secondary">Our</span>{" "}
            <span className="text-white">Impact</span>
          </h2>

          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 rounded-full mx-auto mb-4"></div>

          <p className="text-white/80 text-base max-w-2xl mx-auto animate-fade-in-up delay-200">
            Numbers that showcase our commitment to revolutionizing pharmacy services and improving healthcare accessibility
          </p>
        </div>
        
        {/* Stats grid with light theme styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div 
              key={stat.id}
              className={`${stat.delay} animate-fade-in-up rounded-xl bg-white/15 backdrop-blur-xl border border-white/20 p-6 text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden`}
            >
              {/* Glass highlight effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Background Effects */}
              <div className="absolute top-[-20px] right-[-15px] w-32 h-32 bg-blue-500/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700"></div>
              
              {/* Icon container */}
              <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg relative z-10`}>
                {stat.icon}
              </div>
              
              {/* Counter */}
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors duration-300 relative z-10">
                <CountUp end={stat.value} />
                {stat.id === 4 && "+"}
              </h3>
              
              {/* Label */}
              <p className="text-white/70 font-medium text-sm uppercase tracking-wider leading-relaxed relative z-10">
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