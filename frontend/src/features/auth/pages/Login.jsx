import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  ArrowRight,
  LogIn,
  Mail,
  AlertCircle,
  Building2,
  Users,
  Stethoscope,
} from "lucide-react";
import { assets } from "../../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../../components/Layout/Navbar";
import GradientButton from "../../../components/UIs/GradientButton";
import { useAuth } from "../../../hooks/useAuth";

// ✅ HARDCODED CREDENTIALS
const HARDCODED_CREDENTIALS = {
  'pharmacy-admin': {
    email: 'admin@gmail.com',
    password: 'admin123'
  },
  'pharmacist': {
    email: 'pharmacist@gmail.com',
    password: 'pharma123'
  }
};

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error, isAuthenticated, userType, setHardcodedUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loginType, setLoginType] = useState('customer'); // 'customer', 'pharmacy-admin', or 'pharmacist'
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // ✅ Enhanced redirect logic based on user type
  useEffect(() => {
    if (isAuthenticated && userType) {
      console.log('User authenticated, redirecting...', { userType });
      if (userType === 'customer') {
        navigate("/customer");
      } else if (userType === 'pharmacy-admin') {
        navigate("/pharmacy");
      } else if (userType === 'pharmacist') {
        navigate("/pharmacist");
      }
    }
  }, [isAuthenticated, userType, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (submitError) setSubmitError("");
  };

  // ✅ UPDATED: Enhanced login type toggle with 3 options
  const handleLoginTypeChange = (newType) => {
    if (loginType !== newType) {
      console.log('Changing login type from', loginType, 'to', newType);
      setLoginType(newType);
      setFormData({ email: "", password: "" });
      setErrors({});
      setSubmitError("");
      
      // ✅ Pre-fill with hardcoded credentials for non-customer types
      if (newType !== 'customer' && HARDCODED_CREDENTIALS[newType]) {
        setFormData(HARDCODED_CREDENTIALS[newType]);
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ UPDATED: Handle hardcoded login for pharmacy staff
  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSubmitError("");
      
      console.log('Current loginType state:', loginType);
      console.log(`Attempting ${loginType} login with:`, formData);
      
      // ✅ Handle hardcoded pharmacy admin/pharmacist login
      if (loginType !== 'customer') {
        const hardcodedCreds = HARDCODED_CREDENTIALS[loginType];
        
        if (formData.email === hardcodedCreds.email && formData.password === hardcodedCreds.password) {
          console.log(`Successful hardcoded login as ${loginType}`);
          
          // Create a mock user with appropriate role
          const mockUser = {
            id: loginType === 'pharmacy-admin' ? 1 : 2,
            email: formData.email,
            fullName: loginType === 'pharmacy-admin' ? 'Admin User' : 'Staff Pharmacist',
            userType: loginType,
            role: loginType,
            pharmacyId: 1,
            pharmacyName: 'PillPath Main Pharmacy',
            // Add any other required fields
          };
          
          // Use the hardcoded login method
          await setHardcodedUser(mockUser, loginType);
          
          // Navigation will be handled by the useEffect above
          return;
        } else {
          throw new Error(`Invalid credentials for ${loginType}. Please use the hardcoded values.`);
        }
      }
      
      // Regular customer login - use the existing authentication flow
      const response = await login(formData, 'customer');
      console.log("Customer login successful:", response);
      
    } catch (error) {
      console.error('Login failed:', error);
      setSubmitError(error.message || "Login failed. Please try again.");
    }
  };

  // ✅ Get dynamic content based on login type
  const getLoginContent = () => {
    if (loginType === 'pharmacy-admin') {
      return {
        title: "Pharmacy Admin Portal",
        subtitle: "Manage your <span class='text-secondary-green'>pharmacy</span> operations",
        icon: Building2,
        color: "text-blue-500",
        gradient: "from-blue-500/90 to-blue-600",
        hoverGradient: "hover:from-blue-600 hover:to-indigo-600/70",
      };
    } else if (loginType === 'pharmacist') {
      return {
        title: "Pharmacist Portal",
        subtitle: "Provide <span class='text-secondary-green'>expert</span> pharmaceutical care",
        icon: Stethoscope,
        color: "text-teal-500",
        gradient: "from-teal-500/90 to-teal-600",
        hoverGradient: "hover:from-teal-600 hover:to-cyan-600/70",
      };
    } else {
      return {
        title: "Customer Portal",
        subtitle: "Your <span class='text-secondary-green'>health</span> journey starts <span class='text-accent-purple'>here</span>",
        icon: User,
        color: "text-secondary",
        gradient: "from-secondary/90 to-secondary",
        hoverGradient: "hover:from-secondary hover:to-accent/70",
      };
    }
  };

  const content = getLoginContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-hover to-accent relative overflow-hidden px-4 py-25">
      <Navbar />
      
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

      {/* Glassmorphism login card */}
      <div
        className={`relative bg-white/15 backdrop-blur-2xl rounded-3xl shadow-2xl border-white/20 p-6 sm:p-8 w-full max-w-md flex flex-col items-center gap-5 sm:gap-6 hover:shadow-3xl hover:bg-white/20 transition-all duration-500 fade-in ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Glass edge highlights */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30"></div>
        <div className="absolute bottom-0 left-[15%] right-[15%] h-[1px] bg-black/5"></div>
        <div className="absolute top-[5%] bottom-[5%] left-0 w-[1px] bg-white/20"></div>
        <div className="absolute top-[5%] bottom-[5%] right-0 w-[1px] bg-black/5"></div>

        {/* ✅ UPDATED: Enhanced Login Type Toggle with 3 options */}
        <div className="w-full flex items-center justify-center mb-4 relative z-10 animate-fade-in-up delay-100">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handleLoginTypeChange('customer')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  loginType === 'customer'
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                <Users size={14} />
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => handleLoginTypeChange('pharmacy-admin')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  loginType === 'pharmacy-admin'
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                <Building2 size={14} />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleLoginTypeChange('pharmacist')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  loginType === 'pharmacist'
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                <Stethoscope size={14} />
                <span>Pharmacist</span>
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Hardcoded credentials info for non-customer logins */}
        {/* {loginType !== 'customer' && (
          <div className="w-full mb-2 p-3 bg-blue-500/20 border border-blue-500/40 rounded-lg animate-fade-in text-xs">
            <p className="text-white text-center mb-1 font-semibold">
              Use these hardcoded credentials:
            </p>
            <div className="flex justify-between items-center">
              <span className="text-blue-200">Email:</span>
              <code className="bg-black/20 px-2 py-1 rounded text-white">
                {HARDCODED_CREDENTIALS[loginType].email}
              </code>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-blue-200">Password:</span>
              <code className="bg-black/20 px-2 py-1 rounded text-white">
                {HARDCODED_CREDENTIALS[loginType].password}
              </code>
            </div>
          </div>
        )} */}

        {/* Logo and branding */}
        <div className="flex flex-col items-center mb-1 relative z-10">
          <img
            src={assets.logo2}
            alt="icon"
            className="w-20 h-20 sm:w-28 sm:h-28 md:w-34 md:h-34 filter drop-shadow-lg animate-fade-in-scale"
          />
          <p 
            className="text-light text-sm mt-1 animate-fade-in-up delay-200"
            dangerouslySetInnerHTML={{ __html: content.subtitle }}
          />

          {/* Animated rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-20 h-20 rounded-full border border-white/40 animate-ping-slow"></div>
            <div
              className="absolute w-32 h-32 rounded-full border border-white/20 animate-ping-slow"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>
        </div>

        {/* Error Display */}
        {(submitError || error) && (
          <div className="w-full mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-red-200" />
              <p className="text-red-200 text-sm">{submitError || error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="w-full space-y-5">
          {/* Email input */}
          <div className="w-full relative z-10 animate-fade-in-up delay-300">
            <label className="block text-light text-sm font-medium mb-2">
              Email
            </label>
            <div className="relative group">
              <input
                type="email"
                name="email"
                placeholder={`Enter your ${loginType !== 'customer' ? `${loginType} ` : ''}email`}
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border placeholder-white/60 text-white pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white/25 transition-all duration-300 ${
                  errors.email ? "border-red-400" : "border-white/30"
                }`}
                disabled={loading}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 group-hover:text-white/80 transition-colors duration-200">
                <Mail size={20} />
              </div>
            </div>
            {errors.email && (
              <p className="text-red-300 text-xs mt-1 animate-fade-in">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password input */}
          <div className="w-full relative z-10 animate-fade-in-up delay-400">
            <label className="block text-light text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full rounded-xl bg-white/20 backdrop-blur-sm border placeholder-white/60 text-white pl-12 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:bg-white/25 transition-all duration-300 ${
                  errors.password ? "border-red-400" : "border-white/30"
                }`}
                disabled={loading}
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 group-hover:text-white/80 transition-colors duration-200">
                <Lock size={20} />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-300 text-xs mt-1 animate-fade-in">
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot password - only show for customer */}
          {loginType === 'customer' && (
            <div className="w-full text-right relative z-10 animate-fade-in-up delay-500">
              <button
                type="button"
                className="text-info text-sm hover:text-primary-blue hover:underline transition-all duration-200"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Sign in button */}
          <div className="w-full animate-fade-in-up delay-600">
            <GradientButton
              text={loading ? "Signing In..." : `Sign In as ${
                loginType === 'pharmacy-admin' ? 'Pharmacy Admin' : 
                loginType === 'pharmacist' ? 'Pharmacist' : 'Customer'
              }`}
              icon={LogIn}
              iconSize={18}
              gradient={content.gradient}
              hoverGradient={content.hoverGradient}
              type="submit"
              disabled={loading}
              className={`${loading ? "opacity-80 pointer-events-none" : ""}`}
            />
          </div>
        </form>

        {/* ✅ Social login buttons - only for customer */}
        {loginType === 'customer' && (
          <>
            {/* Social login divider */}
            <div className="flex items-center w-full my-1 relative z-10 animate-fade-in-up delay-700">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="text-muted text-xs sm:text-sm px-4">
                Or continue with
              </span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            {/* Social login buttons */}
            <div className="flex gap-4 relative z-10 animate-fade-in-up delay-800">
              {/* Google */}
              <button
                type="button"
                className="bg-white/20 hover:bg-white/30 rounded-full p-3 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105 shadow-md group"
                disabled={loading}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 relative z-10"
                    viewBox="0 0 24 24"
                  >
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
                </div>
              </button>

              {/* Other social login buttons */}
              {/* ... (existing social login buttons) ... */}
            </div>
          </>
        )}

        {/* ✅ Conditional Create account link for customers only */}
        {loginType === 'customer' && (
          <div className="w-full mt-2 relative z-10 animate-fade-in-up delay-900">
            <p className="text-muted text-xs sm:text-sm text-center">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-secondary-green font-medium hover:underline transition-all duration-200"
              >
                Create Account
              </Link>
            </p>
          </div>
        )}

        {/* ✅ Pharmacy admin specific note */}
        {loginType === 'pharmacy-admin' && (
          <div className="w-full mt-2 relative z-10 animate-fade-in-up delay-900">
            <p className="text-muted text-xs sm:text-sm text-center">
              Need pharmacy admin access?{" "}
              <Link
                to="/register"
                className="text-secondary-green font-medium hover:underline transition-all duration-200"
              >
                Register Your Pharmacy
              </Link>
            </p>
          </div>
        )}

        {/* ✅ Pharmacist specific note */}
        {loginType === 'pharmacist' && (
          <div className="w-full mt-2 relative z-10 animate-fade-in-up delay-900">
            <p className="text-muted text-xs sm:text-sm text-center">
              Contact your pharmacy administrator for account access
            </p>
          </div>
        )}

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