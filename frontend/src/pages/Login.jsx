import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Pill, User, Lock, ArrowRight } from "lucide-react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-hover to-accent relative overflow-hidden px-4 py-10">
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow"></div>
      <div className="absolute top-32 right-20 w-80 h-80 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay"></div>
      <div className="absolute -bottom-20 left-32 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-6000"></div>

      {/* Medical pattern background */}
      <div className="medical-pattern absolute inset-0 opacity-5"></div>

      {/* Animated geometric shapes */}
      <div className="absolute top-20 left-[20%] w-20 h-20 border-4 border-white/10 rounded-lg rotate-12 animate-spin-slow"></div>
      <div className="absolute bottom-40 right-[15%] w-16 h-16 border-4 border-secondary/20 rounded-full animate-pulse-slow"></div>

      {/* Enhanced glassmorphism login card */}
      <div
        className={`relative bg-white/15 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 w-full max-w-md flex flex-col items-center gap-5 sm:gap-6 hover:shadow-3xl hover:bg-white/20 transition-all duration-500 fade-in ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Glass edge highlights */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30"></div>
        <div className="absolute bottom-0 left-[15%] right-[15%] h-[1px] bg-black/5"></div>
        <div className="absolute top-[5%] bottom-[5%] left-0 w-[1px] bg-white/20"></div>
        <div className="absolute top-[5%] bottom-[5%] right-0 w-[1px] bg-black/5"></div>

        {/* Logo and branding */}
        <div className="flex flex-col items-center mb-1 relative z-10">
            <img
              src={assets.logo2}
              alt="icon"
              className="w-20 h-20 sm:w-28 sm:h-28 md:w-34 md:h-34 filter drop-shadow-lg"
            />
         
          <p className="text-white/80 text-sm mt-1">
            Your health journey starts here
          </p>

          {/* Animated rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-20 h-20 rounded-full border border-white/40 animate-ping-slow"></div>
            <div  
              className="absolute w-32 h-32 rounded-full border border-white/20 animate-ping-slow"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>
        </div>

        {/* Email input */}
        <div className="w-full relative z-10">
          <label className="block text-white/90 text-sm font-medium mb-2">
            Email or Username
          </label>
          <div className="relative group">
            <input
              type="text"
              placeholder="Enter your email"
              className="w-full rounded-xl  backdrop-blur-sm border border-white/30 placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white/25 transition-all duration-300"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 group-hover:text-white/80 transition-colors duration-200">
              <User size={20} />
            </div>
          </div>
        </div>

        {/* Password input */}
        <div className="w-full relative z-10">
          <label className="block text-white/90 text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/60 text-white pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white/25 transition-all duration-300"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 group-hover:text-white/80 transition-colors duration-200">
              <Lock size={20} />
            </div>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <div className="w-full text-right relative z-10">
          <button className="text-white/80 text-sm hover:text-white hover:underline transition-all duration-200">
            Forgot Password?
          </button>
        </div>

        {/* Sign in button */}
        <button className="w-full bg-gradient-to-r from-secondary/90 to-secondary hover:from-secondary hover:to-secondary/90 text-white font-semibold py-3 rounded-xl backdrop-blur-sm border border-white/10 shadow-lg hover:shadow-secondary/30 active:scale-[0.98] transition-all duration-300 group-hover:scale-[1.02] relative overflow-hidden z-10">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 rounded-xl"></div>
          <div className="flex gap-2 items-center justify-center font-medium relative">
            <span>Sign In</span>
            <ArrowRight size={16} className="animate-bounce-gentle" />
          </div>
        </button>

        {/* Social login divider */}
        <div className="flex items-center w-full my-1 relative z-10">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="text-white/60 text-xs sm:text-sm px-4">
            Or continue with
          </span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        {/* Social login buttons */}
        <div className="flex gap-4 relative z-10">
          {/* Google */}
          <button className="bg-white/20 hover:bg-white/30 rounded-full p-3 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105 shadow-md">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </button>

          {/* Apple */}
          <button className="bg-white/20 hover:bg-white/30 rounded-full p-3 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105 shadow-md">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
          </button>

          {/* Facebook */}
          <button className="bg-white/20 hover:bg-white/30 rounded-full p-3 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105 shadow-md">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>
        </div>

        {/* Create account */}
        <div className="w-full mt-2 relative z-10">
          <p className="text-white/80 text-xs sm:text-sm text-center">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-white font-medium hover:underline transition-all duration-200"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Medical/Pharmacy themed floating elements */}
        <div className="absolute top-[15%] right-[10%] w-8 h-4 bg-secondary/30 rounded-full rotate-45 animate-pulse-slow"></div>
        <div className="absolute bottom-[20%] left-[12%] w-6 h-3 bg-primary/40 rounded-full rotate-[30deg] animate-pulse-slow"></div>
        <div
          className="absolute top-[70%] right-[8%] w-4 h-4 bg-accent/30 rounded-full animate-ping"
          style={{ animationDuration: "3s" }}
        ></div>
      </div>
    </div>
  );
};

export default Login;
