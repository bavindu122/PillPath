import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import RoleSelector from "../components/RoleSelector";
import RegisterForm from "../components/RegisterForm";
import Navbar from "../../../components/Layout/Navbar";

export const Register = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    setShowForm(true);
  };

  const handleBackToRoleSelection = () => {
    setShowForm(false);
  };

  const handleRegistrationSubmit = (formData) => {
    // Here you would typically handle the API call to register the user
    console.log("Registration submitted:", formData);

    // For demonstration, we'll just set registration complete
    setRegistrationComplete(true);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-hover to-accent relative overflow-hidden px-4 py-10 top-[-30px]">
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
        <div className="relative z-10 w-full py-10">
          {registrationComplete ? (
            <div className="w-full max-w-md mx-auto bg-white/15 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 animate-fade-in text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Registration Successful!
              </h2>
              <p className="text-white/80 mb-8">
                {selectedRole === "customer"
                  ? "Your account has been created successfully. You can now log in to access all features."
                  : "Your pharmacy registration has been submitted for review. We'll notify you once your account is approved."}
              </p>
              <Link to="/login">
                <button className="px-8 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium transition-all duration-300 shadow-lg inline-flex items-center justify-center gap-2 w-full">
                  Go to Login
                  <ArrowRight size={16} className="animate-bounce-gentle" />
                </button>
              </Link>
            </div>
          ) : !showForm ? (
            <>
              <RoleSelector onRoleSelect={handleRoleSelect} />
              {selectedRole && (
                <div className="mt-8 text-center animate-fade-in-up">
                  <button
                    onClick={handleContinue}
                    className={`px-8 py-3 rounded-xl text-white font-medium transition-all duration-300 shadow-lg inline-flex items-center gap-2
                      ${
                        selectedRole === "customer"
                          ? "bg-secondary hover:bg-secondary/90 shadow-secondary/30"
                          : "bg-accent hover:bg-accent/90 shadow-accent/30"
                      }`}
                  >
                    Continue as{" "}
                    {selectedRole === "customer" ? "Customer" : "Pharmacy"}
                    <ArrowRight size={16} className="animate-bounce-gentle" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <RegisterForm
              role={selectedRole}
              onBack={handleBackToRoleSelection}
              onSubmit={handleRegistrationSubmit}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Register;
