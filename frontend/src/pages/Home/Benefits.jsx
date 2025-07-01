import React from "react";
import { Clock, DollarSign, Smartphone, Shield } from "lucide-react";

const benefits = [
  {
    id: 1,
    icon: <Clock size={28} />,
    title: "Time Saving",
    description: "Save time with quick pharmacy comparison",
    color: "from-primary to-primary-blue",
    delay: "delay-100",
  },
  {
    id: 2,
    icon: <DollarSign size={28} />,
    title: "Cost Effective",
    description: "Compare prices across multiple pharmacies",
    color: "from-secondary to-secondary-green",
    delay: "delay-200",
  },
  {
    id: 3,
    icon: <Smartphone size={28} />,
    title: "Convenient",
    description: "Order from anywhere, anytime",
    color: "from-accent to-accent-purple",
    delay: "delay-300",
  },
  {
    id: 4,
    icon: <Shield size={28} />,
    title: "Secure",
    description: "Your health data is always protected",
    color: "from-primary to-accent",
    delay: "delay-400",
  },
];

const Benefits = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-hover to-accent relative overflow-hidden px-4 py-20">
      {/* Background elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow"></div>
      <div className="absolute top-32 right-20 w-80 h-80 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
      <div className="absolute -bottom-20 left-32 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-6000"></div>

      {/* Medical pattern background */}
      <div className="medical-pattern absolute inset-0 opacity-5"></div>

      {/* Animated geometric shapes */}
      <div className="absolute top-20 left-[20%] w-20 h-20 border-4 border-white/10 rounded-lg rotate-12 animate-spin-slow"></div>
      <div className="absolute bottom-40 right-[15%] w-16 h-16 border-4 border-secondary/20 rounded-full animate-pulse-slow"></div>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto py-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up">
            Benefits for You
          </h2>
          <div className="w-30 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-4"></div>
          <p className="text-white/80 max-w-xl mx-auto animate-fade-in-up delay-200">
            Experience the advantages of using PillPath for all your medication needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className={`${benefit.delay} animate-fade-in-up bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl p-8 flex items-start gap-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
            >
              <div
                className={`shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg ${
                  benefit.id === 1 && "bg-gradient-to-br from-blue-500 to-blue-700"
                } ${
                  benefit.id === 2 && "bg-gradient-to-br from-green-500 to-green-700"
                } ${
                  benefit.id === 3 && "bg-gradient-to-br from-purple-500 to-purple-700"
                } ${
                  benefit.id === 4 && "bg-gradient-to-br from-red-500 to-red-700"
                }`}
              >
                {benefit.icon}
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-white/70">{benefit.description}</p>
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