import React from "react";
import { Shield, Lock, FileCheck, Star } from "lucide-react";

const TrustSafety = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30"></div>
      
      <div className="absolute top-10 left-[10%] w-40 h-40 rounded-full border-2 border-blue-200/40 rotate-45 opacity-30"></div>
      <div className="absolute bottom-10 right-[10%] w-60 h-60 rounded-full border-2 border-purple-200/40 -rotate-12 opacity-30"></div>
      <div className="absolute top-1/2 left-0 w-72 h-72 -translate-y-1/2 rounded-full bg-gradient-radial from-blue-100/20 to-transparent opacity-50"></div>
      <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-gradient-radial from-green-100/20 to-transparent opacity-50"></div>
      
      <div className="absolute inset-0">
        <div className="particles-container">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-300/30 animate-pulse"
              style={{
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 4 + 2}s`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h6 className="text-green-600 uppercase tracking-wider text-sm font-semibold mb-2 opacity-90">
            Security & Compliance
          </h6>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Trust
            </span>{" "}
            <span className="text-gray-800">&</span>{" "}
            <span className="text-gray-800 bg-clip-text ">
              Safety
            </span>
          </h2>
          
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 rounded-full mx-auto mb-4"></div>
          
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Your health information security is our top priority
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4 md:mb-0">
                <Shield size={32} strokeWidth={1.5} />
              </div>
              
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                  HIPAA Compliant
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  All your health data is handled according to HIPAA standards for complete privacy and compliance
                </p>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-700"></div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4 md:mb-0">
                <Lock size={32} strokeWidth={1.5} />
              </div>
              
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors duration-300">
                  SSL Secured
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  256-bit SSL encryption ensures your data is securely transmitted and stored
                </p>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-green-600 group-hover:w-full transition-all duration-700"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4 md:mb-0">
                <FileCheck size={32} strokeWidth={1.5} />
              </div>
              
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors duration-300">
                  Licensed Pharmacists
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Every prescription is verified by licensed and certified pharmacists
                </p>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-600 group-hover:w-full transition-all duration-700"></div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 mb-4 md:mb-0">
                <Star size={32} strokeWidth={1.5} />
              </div>
              
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                  Trusted by Customers
                </h3>
                <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={18} fill="#3B82F6" color="#3B82F6" />
                  ))}
                  <span className="text-blue-600 ml-1 font-semibold">4.9/5</span>
                </div>
                <p className="text-gray-600 leading-relaxed italic">
                  "PillPath has completely transformed how I manage my family's medications."
                </p>
                <p className="text-gray-500 text-sm mt-1">- Maria S.</p>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-700"></div>
          </div>
        </div>
        
       <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-full px-8 py-4 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-medium">Secure & Encrypted</span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-medium">24/7 Protected</span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-medium">HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSafety;

