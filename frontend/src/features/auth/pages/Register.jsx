import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, ClipboardCheck, HelpCircle, MessageSquare } from "lucide-react";
import RoleSelector from "../components/RoleSelector";
import RegisterForm from "../components/RegisterForm";
import Navbar from "../../../components/Layout/Navbar";
import { useAuth } from "../../../hooks/useAuth";

export const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user && registrationComplete) {
      // Auto redirect customers to dashboard after successful registration
      if (selectedRole === "customer") {
        setTimeout(() => {
          navigate("/customer/dashboard");
        }, 3000);
      }
    }
  }, [user, registrationComplete, selectedRole, navigate]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    setShowForm(true);
  };

  const handleBackToRoleSelection = () => {
    setShowForm(false);
  };

  const handleRegistrationSubmit = (responseData) => {
    console.log("Registration successful:", responseData);
    setSubmittedData(responseData);
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
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  selectedRole === "customer"
                    ? "bg-green-500/20"
                    : "bg-yellow-500/20"
                }`}
              >
                {selectedRole === "customer" && user && (
                  <div className="mt-4 p-3 bg-green-500/20 border border-green-500/40 rounded-lg">
                    <p className="text-green-200 text-sm">
                      Redirecting to your dashboard in 3 seconds...
                    </p>
                  </div>
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {selectedRole === "customer"
                  ? "Customer Registration Successful!"
                  : "Pharmacy Registration Complete"}
              </h2>

              {selectedRole === "customer" ? (
                <p className="text-white/80 mb-8">
                  Your account has been created successfully. You can now log in
                  to access all features.
                </p>
              ) : (
                <div className="space-y-4 mb-8">
                  <p className="text-white/80">
                    Thank you for registering your pharmacy with PillPath!
                  </p>

                  <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                    <h3 className="text-white font-medium mb-2 flex items-center justify-center gap-2">
                      <Clock size={18} className="text-yellow-400" />
                      Pending Admin Review
                    </h3>
                    <p className="text-white/70 text-sm">
                      Your registration data has been received and is awaiting
                      review by our administrators. You will receive an email
                      notification at{" "}
                      <span className="text-white">
                        {submittedData?.email || "your registered email"}
                      </span>{" "}
                      once your account is approved.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white/10 rounded-lg p-3 border border-white/10">
                      <h4 className="text-white/90 font-medium mb-1 flex items-center gap-1">
                        <Clock size={14} className="text-accent/80" /> Review
                        Timeline
                      </h4>
                      <p className="text-white/70">
                        Typically 1-2 business days
                      </p>
                    </div>

                    <div className="bg-white/10 rounded-lg p-3 border border-white/10">
                      <h4 className="text-white/90 font-medium mb-1 flex items-center gap-1">
                        <HelpCircle size={14} className="text-accent/80" /> Need
                        Help?
                      </h4>
                      <p className="text-white/70">Contact our support team</p>
                    </div>
                  </div>

                  <div className="mt-2 text-white/70 text-xs">
                    <p>
                      We verify all pharmacy information to ensure platform
                      integrity and safety.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Link to="/login">
                  <button
                    className={`px-8 py-3 rounded-xl text-white font-medium transition-all duration-300 shadow-lg inline-flex items-center justify-center gap-2 w-full
          ${
            selectedRole === "customer"
              ? "bg-secondary hover:bg-secondary/90"
              : "bg-white/20 hover:bg-white/30"
          }`}
                  >
                    {selectedRole === "customer"
                      ? "Go to Login"
                      : "Return to Login"}
                    <ArrowRight size={16} className="animate-bounce-gentle" />
                  </button>
                </Link>

                {selectedRole === "pharmacy" && (
                  <Link to="/contact">
                    <button className="px-8 py-3 rounded-xl bg-accent/20 hover:bg-accent/30 text-white font-medium transition-all duration-300 shadow-lg inline-flex items-center justify-center gap-2 w-full">
                      Contact Support
                      <MessageSquare size={16} />
                    </button>
                  </Link>
                )}
              </div>
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
