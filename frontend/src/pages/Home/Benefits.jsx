import React from "react";
import { Clock, DollarSign, Smartphone, Shield } from "lucide-react";

const benefits = [
  {
    id: 1,
    icon: <Clock size={28} />,
    title: "Time Saving",
    description: "Save time with quick pharmacy comparison",
    color: "from-primary to-primary-blue",
    delay: "delay-100"
  },
  {
    id: 2,
    icon: <DollarSign size={28} />,
    title: "Cost Effective",
    description: "Compare prices across multiple pharmacies",
    color: "from-secondary to-secondary-green",
    delay: "delay-200"
  },
  {
    id: 3,
    icon: <Smartphone size={28} />,
    title: "Convenient",
    description: "Order from anywhere, anytime",
    color: "from-accent to-accent-purple",
    delay: "delay-300"
  },
  {
    id: 4,
    icon: <Shield size={28} />,
    title: "Secure",
    description: "Your health data is always protected",
    color: "from-primary to-accent",
    delay: "delay-400"
  }
];

const Benefits = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
      <div className="medical-pattern absolute inset-0 opacity-[0.03]"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-4 animate-fade-in-up">
            Benefits for You
          </h2>
          <p className="text-muted max-w-xl mx-auto animate-fade-in-up delay-200">
            Experience the advantages of using PillPath for all your medication needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit) => (
            <div 
              key={benefit.id}
              className={`${benefit.delay} animate-fade-in-up bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex items-start gap-6 hover:shadow-xl transition-all duration-300 card-shine`}
            >
              <div className={`shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center text-white`}>
                {benefit.icon}
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-light mb-3">{benefit.title}</h3>
                <p className="text-muted">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center animate-fade-in-up delay-500">
          <a href="/register" className="inline-block px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
            Get Started Today
          </a>
        </div>
      </div>
    </section>
  );
};

export default Benefits;