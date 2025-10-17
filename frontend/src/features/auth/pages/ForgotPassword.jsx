import React, { useState, useEffect } from "react";
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from "lucide-react";
import { assets } from "../../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../../components/Layout/Navbar";
import GradientButton from "../../../components/UIs/GradientButton";
import { requestPasswordReset } from "../../../services/api/authApi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err) {
      console.error("Password reset request failed:", err);
      // For security, we always show success message
      setSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-hover to-accent relative overflow-hidden px-4 py-25">
      <Navbar />

      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow"></div>
      <div className="absolute top-32 right-20 w-80 h-80 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
      <div className="absolute -bottom-20 left-32 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>

      {/* Medical pattern background */}
      <div className="medical-pattern absolute inset-0 opacity-5"></div>

      {/* Glassmorphism card */}
      <div
        className={`relative bg-white/15 backdrop-blur-2xl rounded-3xl shadow-2xl border-white/20 p-6 sm:p-8 w-full max-w-md flex flex-col items-center gap-5 sm:gap-6 hover:shadow-3xl hover:bg-white/20 transition-all duration-500 fade-in ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Glass edge highlights */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30"></div>
        <div className="absolute bottom-0 left-[15%] right-[15%] h-[1px] bg-black/5"></div>

        {/* Back button */}
        <div className="w-full flex justify-start relative z-10 animate-fade-in">
          <Link
            to="/login"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Back to Login</span>
          </Link>
        </div>

        {/* Logo and branding */}
        <div className="flex flex-col items-center mb-1 relative z-10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 animate-fade-in-scale">
            {success ? (
              <CheckCircle size={40} className="text-green-400" />
            ) : (
              <Mail size={40} className="text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mt-4 text-center">
            {success ? "Check Your Email" : "Forgot Password?"}
          </h1>
          <p className="text-white/70 text-sm mt-1 text-center px-4">
            {success
              ? "We've sent you a password reset link"
              : "Enter your email and we'll send you a reset link"}
          </p>
        </div>

        {success ? (
          /* Success Message */
          <div className="w-full space-y-5 relative z-10 animate-fade-in">
            <div className="w-full p-4 bg-green-500/20 border border-green-500/40 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-200 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-green-100 text-sm leading-relaxed">
                    If an account exists with <strong>{email}</strong>, you will
                    receive a password reset link shortly. Please check your inbox
                    and spam folder.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <h3 className="text-white font-semibold text-sm mb-2">
                Didn't receive the email?
              </h3>
              <ul className="text-white/70 text-xs space-y-1 list-disc list-inside">
                <li>Check your spam or junk folder</li>
                <li>Make sure you entered the correct email</li>
                <li>Wait a few minutes for the email to arrive</li>
              </ul>
            </div>

            <GradientButton
              text="Back to Login"
              icon={ArrowLeft}
              iconSize={18}
              gradient="from-secondary/90 to-secondary"
              hoverGradient="hover:from-secondary hover:to-accent/70"
              onClick={() => navigate("/login")}
            />
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {/* Error Display */}
            {error && (
              <div className="w-full p-3 bg-red-500/20 border border-red-500/40 rounded-lg animate-fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-200" />
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Email input */}
            <div className="w-full relative z-10 animate-fade-in-up delay-300">
              <label className="block text-light text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white/25 transition-all duration-300 ${
                    error ? "border-red-400" : "border-white/30"
                  }`}
                  disabled={isLoading}
                  autoFocus
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 group-hover:text-white/80 transition-colors duration-200">
                  <Mail size={20} />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="w-full animate-fade-in-up delay-400">
              <GradientButton
                text={isLoading ? "Sending..." : "Send Reset Link"}
                icon={Send}
                iconSize={18}
                gradient="from-secondary/90 to-secondary"
                hoverGradient="hover:from-secondary hover:to-accent/70"
                type="submit"
                disabled={isLoading}
                className={`${isLoading ? "opacity-80 pointer-events-none" : ""}`}
              />
            </div>

            {/* Security info */}
            <div className="w-full p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 animate-fade-in-up delay-500">
              <p className="text-white/70 text-xs text-center">
                For security reasons, we'll send you an email only if an account
                exists with the provided email address. The reset link will be
                valid for 15 minutes.
              </p>
            </div>
          </form>
        )}

        {/* Decorative elements */}
        <div className="absolute top-[15%] right-[10%] w-8 h-4 bg-secondary/30 rounded-full rotate-45 animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] left-[12%] w-6 h-3 bg-primary/40 rounded-full rotate-[30deg] animate-pulse-slow"></div>
      </div>
    </div>
  );
};

export default ForgotPassword;
