import React from "react";
import { Shield, Lock, FileCheck, Star } from "lucide-react";

const TrustSafety = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
      <div className="medical-pattern absolute inset-0 opacity-[0.03]"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-4 animate-fade-in-up">
            Trust & Safety
          </h2>
          <p className="text-muted max-w-xl mx-auto animate-fade-in-up delay-200">
            Your health information security is our top priority
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 animate-fade-in-left card-shine">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary-blue mb-4 md:mb-0">
                <Shield size={32} />
              </div>
              
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-light mb-2">HIPAA Compliant</h3>
                <p className="text-muted">All your health data is handled according to HIPAA standards for complete privacy and compliance</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 animate-fade-in-right card-shine">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-green mb-4 md:mb-0">
                <Lock size={32} />
              </div>
              
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-light mb-2">SSL Secured</h3>
                <p className="text-muted">256-bit SSL encryption ensures your data is securely transmitted and stored</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 animate-fade-in-left delay-300 card-shine">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center text-accent-purple mb-4 md:mb-0">
                <FileCheck size={32} />
              </div>
              
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-light mb-2">Licensed Pharmacists</h3>
                <p className="text-muted">Every prescription is verified by licensed and certified pharmacists</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 animate-fade-in-right delay-300 card-shine">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary-blue mb-4 md:mb-0">
                <Star size={32} />
              </div>
              
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-light mb-2">Trusted by Customers</h3>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={18} fill="#4FA4FF" color="#4FA4FF" />
                  ))}
                  <span className="text-primary-blue ml-1">4.9/5</span>
                </div>
                <p className="text-muted">"PillPath has completely transformed how I manage my family's medications." - Maria S.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSafety;