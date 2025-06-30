import React, { useState, useEffect, useRef } from "react";
import { Building, FileText, Users, Calendar } from "lucide-react";

const stats = [
  {
    id: 1,
    icon: <Building />,
    value: 1500,
    label: "Registered Pharmacies",
    color: "text-primary-blue",
    bgColor: "bg-primary/10",
    delay: "delay-100"
  },
  {
    id: 2,
    icon: <FileText />,
    value: 125000,
    label: "Prescriptions Processed",
    color: "text-secondary-green",
    bgColor: "bg-secondary/10",
    delay: "delay-200"
  },
  {
    id: 3,
    icon: <Users />,
    value: 50000,
    label: "Happy Customers",
    color: "text-accent-purple",
    bgColor: "bg-accent/10",
    delay: "delay-300"
  },
  {
    id: 4,
    icon: <Calendar />,
    value: 5,
    label: "Years of Service",
    color: "text-primary-blue",
    bgColor: "bg-primary/10",
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
    <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-br from-primary/20 via-transparent to-accent/20">
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-4 animate-fade-in-up">
            Our Impact
          </h2>
          <p className="text-muted max-w-xl mx-auto animate-fade-in-up delay-200">
            Numbers that showcase our commitment to revolutionizing pharmacy services
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div 
              key={stat.id}
              className={`${stat.delay} animate-fade-in-up bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 group card-shine`}
            >
              <div className={`w-16 h-16 mx-auto rounded-full ${stat.bgColor} flex items-center justify-center ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              
              <h3 className="text-3xl font-bold text-light mb-2">
                <CountUp end={stat.value} />
                {stat.id === 4 && "+"}
              </h3>
              
              <p className="text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;