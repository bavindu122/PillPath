import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import RoleSelection from "../components/RoleSelector";
import RegisterForm from "../components/RegisterForm";
import { useAuth } from "../../../hooks/useAuth"; 
export const Register = () => {
  const [currentStep, setCurrentStep] = useState("role");
  const [selectedRole, setSelectedRole] = useState("");
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const { register, loading, error } = useAuth();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setCurrentStep("form");
  };

  const handleBackToRole = () => {
    setCurrentStep("role");
    setSelectedRole("");
  };

  const handleRegistrationSubmit = async (formData, userType) => {
    try {
      console.log(`${userType} registration data:`, formData);
      
      // ✅ Now register is properly imported and available
      const response = await register(formData, userType);
      
      console.log("Registration successful:", response);
      setSubmittedData(response);
      setRegistrationComplete(true);
    } catch (error) {
      console.error("Registration failed:", error);
      // You might want to show an error message to the user here
    }
  };

  const getSuccessMessage = () => {
    if (selectedRole === "customer") {
      return {
        title: "Welcome to PillPath!",
        message: "Your account has been created successfully. You can now start exploring our services.",
        action: "Go to Dashboard"
      };
    } else {
      return {
        title: "Registration Submitted!",
        message: "Your pharmacy registration has been submitted for review. We'll notify you once it's approved.",
        action: "Back to Home"
      };
    }
  };

  if (registrationComplete) {
    const successInfo = getSuccessMessage();
    
    return (
      <div className="min-h-screen bg-dark-theme flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto bg-white/15 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            {successInfo.title}
          </h2>
          
          <p className="text-white/70 mb-8">
            {successInfo.message}
          </p>
          
          <Link
            to={selectedRole === "customer" ? "/customer" : "/"}
            className="inline-block bg-accent hover:bg-accent/90 text-white font-medium py-3 px-8 rounded-xl transition-colors duration-300"
          >
            {successInfo.action}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-theme relative">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-[10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute top-32 right-[5%] w-80 h-80 bg-indigo-400/15 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-[20%] w-72 h-72 bg-slate-600/20 rounded-full blur-3xl opacity-35 animate-pulse delay-2000"></div>
        <div className="absolute bottom-32 right-[15%] w-88 h-88 bg-blue-400/15 rounded-full blur-3xl opacity-30 animate-pulse delay-3000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 mb-6">
              <ArrowLeft size={20} />
              Back to Home
            </Link>
            
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
            >
              Join <span className="text-gradient-accent">PillPath</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/70 text-lg max-w-2xl mx-auto"
            >
              {currentStep === "role" 
                ? "Choose your role to get started with our comprehensive pharmaceutical services"
                : `Complete your ${selectedRole} registration`
              }
            </motion.p>
          </div>

          {/* Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            {currentStep === "role" ? (
              <RoleSelection onRoleSelect={handleRoleSelect} />
            ) : (
              <RegisterForm 
                role={selectedRole} 
                onBack={handleBackToRole}
                onSubmit={handleRegistrationSubmit}
              />
            )}
          </motion.div>

          {/* ✅ ADD: Show loading state */}
          {loading && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                <p className="text-white">Processing registration...</p>
              </div>
            </div>
          )}

          {/* ✅ ADD: Show error state */}
          {error && (
            <div className="fixed bottom-4 right-4 bg-red-500/90 backdrop-blur-sm text-white p-4 rounded-xl shadow-lg z-50">
              <p className="font-medium">Registration Failed</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-white/60">
              Already have an account?{" "}
              <Link to="/login" className="text-accent hover:text-accent/80 transition-colors duration-300 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;